pragma solidity 0.6.6;
pragma experimental ABIEncoderV2;

import "./referral/IReferral.sol";
import "@imtbl/platform/contracts/escrow/releaser/ICreditCardEscrow.sol";
import "@imtbl/platform/contracts/pay/IPay.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

abstract contract Product is Ownable {

    using SafeMath for uint256;

    event ProductPurchased(uint256 indexed paymentID, uint256 indexed saleID);
    event ProductEscrowed(uint256 indexed saleID, address indexed escrow, uint256 indexed escrowID);

    // Total number of this product which this contract can sell
    uint256 saleCap;
    // Total number of this product sold by this contract
    uint256 sold;
    // Price of each product sold by this contract
    uint256 price;
    // SKU of the product sold by this contract
    bytes32 sku;
    // Referral contract
    IReferral referral;
    // Escrow contract
    ICreditCardEscrow fiatEscrow;
    // Payment processor
    IPay processor;
    // Whether the contract is paused
    bool paused;

    constructor(
        bytes32 _sku,
        uint256 _saleCap,
        uint _price,
        IReferral _referral,
        ICreditCardEscrow _fiatEscrow,
        IPay _processor
    ) public {
        sku = _sku;
        saleCap = _saleCap;
        price = _price;
        referral = _referral;
        fiatEscrow = _fiatEscrow;
        processor = _processor;
    }

    /** @dev Pause or unpause the contract
     *
     * @param _paused whether the contract should be paused
     */
    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
    }

    /** @dev Purchase assets
     *
     * @param _quantity the number of this product to purchase
     * @param _payment the details of the method by which payment will be made
     * @param _referrer the address of the user who made this referral
     */
    function purchase(
        uint256 _quantity,
        IPay.Payment memory _payment,
        address payable _referrer
    ) public {
        purchaseFor(msg.sender, _quantity, _payment, _referrer);
    }

    /** @dev Purchase assets for a user
     *
     * @param _user the user who will receive the assets
     * @param _quantity the number of this product to purchase
     * @param _payment the details of the method by which payment will be made
     * @param _referrer the address of the user who made this referral
     */
    function purchaseFor(
        address payable _user,
        uint256 _quantity,
        IPay.Payment memory _payment,
        address payable _referrer
    ) public virtual {
        require(!paused, "GU:S1:Product: must be unpaused");
        require(saleCap == 0 || saleCap >= sold + _quantity, "GU:S1:Product: product cap has been exhausted");
        uint totalPrice = price.mul(_quantity);

        IPay.Order memory order = IPay.Order({
            currency: IPay.Currency.USDCents,
            totalPrice: totalPrice,
            sku: sku,
            quantity: _quantity,
            user: _user
        });

        uint valueToSend = 0;
        // if the user is paying in ETH, we can pay affiliate fees instantly!
        if (_payment.currency == IPay.Currency.ETH) {
            if (_referrer != address(0)) {
                uint toReferrer;
                (totalPrice, toReferrer) = referral.getSplit(msg.sender, totalPrice, _referrer);
                _referrer.transfer(toReferrer);
            }
            valueToSend = totalPrice;
        }
        processor.process.value(valueToSend)(order, _payment);
        sold += _quantity;
    }

    /** @dev Returns whether this asset is still available */
    function available() public view returns (bool) {
        if (saleCap == 0) {
            return true;
        }
        return saleCap > sold;
    }


}