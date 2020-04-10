pragma solidity 0.6.6;
pragma experimental ABIEncoderV2;

import "@imtbl/platform/contracts/token/TradeToggleERC20.sol";
import "@imtbl/platform/contracts/escrow/IEscrow.sol";
import "./Product.sol";
import "./IPack.sol";

contract Chest is Product, TradeToggleERC20 {

    struct Purchase {
        address user;
        uint256 count;
    }

    // Pack contract in which these chests can be opened
    IPack public pack;
    // Temporary variable to hold purchase details before the escrow callback
    uint256 internal temporaryCount;

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        IPack _pack,
        bytes32 _sku,
        uint256 _saleCap,
        uint256 _price,
        IReferral _referral,
        ICreditCardEscrow _escrow,
        IPay _pay
    ) public Product(_sku, _saleCap, _price, _referral, _escrow, _pay) TradeToggleERC20(_name, _symbol, _decimals) {
        require(address(_pack) != address(0), "GU:S1:Chest: pack must be set on construction");
        pack = _pack;
    }

    /** @dev Purchase chests for a user
     *
     * @param _user the user who will receive the chests
     * @param _quantity the number of chests to purchase
     * @param _payment the details of the method by which payment will be made
     * @param _referrer the address of the user who made this referral
     */
    function purchaseFor(
        address payable _user,
        uint256 _quantity,
        IPay.Payment memory _payment,
        address payable _referrer
    ) public override {

        super.purchaseFor(_user, _quantity, _payment, _referrer);

        if (_payment.currency == IPay.Currency.ETH || _payment.escrowFor == 0) {
            _mint(_user, _quantity);
        } else {
            // escrow the chests
            IEscrow.Vault memory vault = IEscrow.Vault({
                player: _user,
                releaser: address(fiatEscrow),
                asset: address(this),
                balance: _quantity,
                lowTokenID: 0,
                highTokenID: 0,
                tokenIDs: new uint256[](0)
            });

            temporaryCount = _quantity;

            bytes memory data = abi.encodeWithSignature("mintTokens()");

            fiatEscrow.escrow(vault, address(this), data, _payment.escrowFor);
        }
    }

    function mintTokens() public {
        address protocol = address(fiatEscrow.getProtocol());
        require(msg.sender == protocol, "GU:S1:Chest: minter must be core escrow contract");
        require(temporaryCount > 0, "GU:S1:Chest: must create some tokens");
        _mint(protocol, temporaryCount);
        temporaryCount = 0;
    }

    /** @dev Open a number of chests
     *
     * @param _count the number of chests to open
     */
    function open(uint _count) public {
        _burn(msg.sender, _count);
        pack.openChests(msg.sender, _count);
    }

    /** @dev One way switch to enable trading */
    function makeTradable() external onlyOwner {
        require(!tradable, "GU:S1:Chest: must not be already tradable");
        tradable = true;
        emit TradabilityChanged(true);
    }

}