pragma solidity 0.5.11;
pragma experimental ABIEncoderV2;

// solium-disable security/no-block-members

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./IPurchaseProcessor.sol";
import "../oracle/IOracle.sol";

contract PurchaseProcessor is IPurchaseProcessor, Ownable {

    using SafeMath for uint256;

    // Emitted when a seller's approval to sell a particular product is changed
    event SellerApprovalChanged(bytes32 indexed sku, address indexed seller, bool approved);

    // Emitted when a signer's limit is changed
    event SignerLimitChanged(address indexed signer, uint256 usdCentsLimit);

    // Emitted when a payment has been processed
    event PaymentProcessed(
        uint256 indexed id,
        address indexed vendor,
        Order order,
        PaymentParams payment
    );

    // Emitted when an oracle is set
    event OracleChanged(address indexed oracle);

    // Stores whether a nonce has been used by a particular signer
    mapping(address => mapping(uint256 => bool)) public receiptNonces;

    // Track whether a contract can sell through this processor
    mapping(bytes32 => mapping(address => bool)) public sellerApproved;

    // Track the daily limit of each signing address
    mapping(address => Limit) public signerLimits;

    // The number of payments this contract has processed
    uint256 public count;

    // Address of the oracle to use
    address public priceOracle;

    // Wallet to recieve funds
    address payable public wallet;

    // Address to send funds
    constructor(address payable _wallet) public {
        wallet = _wallet;
    }

    function setOracle(
        address oracleAddress
    )
        public
        onlyOwner
    {
        priceOracle = oracleAddress;
    }

    function setSignerLimit(
        address signer,
        uint256 usdCentsLimit
    )
        public
        onlyOwner
    {
        signerLimits[signer].total = usdCentsLimit;
        emit SignerLimitChanged(signer, usdCentsLimit);
    }

    function setSellerApproval(
        address seller,
        bytes32[] memory skus,
        bool approved
    )
        public
        onlyOwner
    {
        for (uint i = 0; i < skus.length; i++) {
            bytes32 sku = skus[i];
            sellerApproved[sku][seller] = approved;
            emit SellerApprovalChanged(sku, seller, approved);
        }
    }

    /** @dev Process an order
     *
     * @param order the details of the order, supplied by an authorised seller
     * @param payment the details of the user's proposed payment
     */
    function process(
        Order memory order,
        PaymentParams memory payment
    )
        public
        payable returns (uint)
    {

        require(
            order.sku != bytes32(0),
            "IM:PurchaseProcessor: must have a set SKU"
        );

        require(
            order.quantity > 0,
            "IM:PurchaseProcessor: must have a valid quality"
        );

        require(
            sellerApproved[order.sku][msg.sender],
            "IM:PurchaseProcessor: must be approved to sell this product"
        );

        // What is the order itself priced in
        if (order.currency == Currency.USDCents) {
            // What currency is the payment given in
            if (payment.currency == Currency.USDCents) {
                // Pay USD via a signed receipt
                _payUsdPricedInUsd(order, payment);
            } else if (payment.currency == Currency.ETH) {
                // Pay ETH directly
                _payEthPricedInUsd(order, payment);
            } else {
                require(false, "IM:PurchaseProcessor: unknown currency");
            }
        } else {
            // What currency is the payment given in
            if (payment.currency == Currency.USDCents) {
                // Pay USD via a signed receipt
                _payUsdPricedInEth(order, payment);
            } else if (payment.currency == Currency.ETH) {
                // Pay ETH directly
                _payEthPricedInEth(order, payment);
            }  else {
                require(false, "IM:PurchaseProcessor: unknown currency");
            }
        }

        uint id = count++;

        emit PaymentProcessed(id, msg.sender, order, payment);

        return id;
    }

    function _validateOrderPaymentMatch(
        Order memory order,
        PaymentParams memory payment
    )
        internal
        pure
    {
        require(
            payment.value >= order.totalPrice,
            "IM:PurchaseProcessor: receipt value must be sufficient"
        );

        require(
            order.currency == Currency.USDCents,
            "IM:PurchaseProcessor: receipt currency must match"
        );
    }

    function _updateSignerLimit(address signer, uint256 amount) internal {
        Limit storage limit = signerLimits[signer];
        require(
            limit.total > 0,
            "IM:PurchaseProcessor: invalid signer"
        );

        if (limit.periodEnd < block.timestamp) {
            limit.periodEnd = block.timestamp + 1 days;
            limit.used = 0;
        }
        uint nextUsed = limit.used.add(amount);

        require (
            limit.total >= nextUsed,
            "IM:PurchaseProcessor: exceeds signing limit for this address"
        );

        limit.used = nextUsed;
    }

    function _getSigner(
        Order memory order,
        PaymentParams memory payment
    )
        internal
        view
        returns (address)
    {
        bytes32 sigHash = keccak256(abi.encodePacked(
            address(this),
            msg.sender,
            order.recipient,
            order.sku,
            order.quantity,
            payment.nonce,
            payment.escrowFor,
            payment.value,
            payment.currency
        ));

        bytes32 recoveryHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", sigHash)
        );

        return ecrecover(recoveryHash, payment.v, payment.r, payment.s);
    }

    function _payUsdPricedInUsd(
        Order memory _order,
        PaymentParams memory _payment
    )
        internal
    {
        address signer = _getSigner(_order, _payment);

        _updateSignerLimit(signer, _order.totalPrice);

        require(
            !receiptNonces[signer][_payment.nonce],
            "IM:PurchaseProcessor: nonce must not be used"
        );

        receiptNonces[signer][_payment.nonce] = true;

        _validateOrderPaymentMatch(_order, _payment);
    }

    function _payEthPricedInUsd(
        Order memory _order,
        PaymentParams memory _payment
    )
        internal
    {
        require(
            priceOracle != address(0),
            "IM:PurchaseProcessor: oracle must be set"
        );

        uint256 amount = IOracle(priceOracle).convert(1, 0, _order.totalPrice);

        require(
            msg.value >= amount,
            "IM:PurchaseProcessor: not enough ETH sent"
        );

        uint256 remaining = msg.value.sub(amount);

        // solium-disable-next-line
        wallet.call.value(amount)("");

        if (remaining > 0) {
            // @TODO: Need to add re-entrency guards on remaining contracts.
            address payable recipient = address(uint160(_order.recipient));
            // solium-disable-next-line
            recipient.call.value(remaining)("");
        }

        require(
            address(this).balance == 0,
            "IM:PurchaseProcessor: ETH left over"
        );

    }

    function _payUsdPricedInEth(
        Order memory _order,
        PaymentParams memory _payment
    )
        internal
    {
        uint256 usdAmount = IOracle(priceOracle).convert(0, 1, _order.totalPrice);

        address signer = _getSigner(_order, _payment);

        _updateSignerLimit(signer, usdAmount);

        require(
            !receiptNonces[signer][_payment.nonce],
            "IM:PurchaseProcessor: nonce must not be used"
        );

        receiptNonces[signer][_payment.nonce] = true;

        require(
        _payment.value >= usdAmount,
            "IM:PurchaseProcessor: receipt value must be sufficient"
        );

        require(
            _payment.currency == Currency.USDCents,
            "IM:PurchaseProcessor: receipt currency must match"
        );
    }

    function _payEthPricedInEth(
        Order memory _order,
        PaymentParams memory _payment
    )
        internal
    {

        require(
            msg.value >= _order.totalPrice,
            "IM:PurchaseProcessor: not enough ETH sent"
        );

        uint256 remaining = msg.value.sub(_order.totalPrice);

        // solium-disable-next-line
        wallet.call.value(_order.totalPrice)("");

        if (remaining > 0) {
            // @TODO: Need to add re-entrency guards on remaining contracts.
            address payable recipient = address(uint160(_order.recipient));
            // solium-disable-next-line
            recipient.call.value(remaining)("");
        }

        require(
            address(this).balance == 0,
            "IM:PurchaseProcessor: ETH left over"
        );

    }

}