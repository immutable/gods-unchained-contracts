pragma solidity 0.5.11;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@imtbl/platform/contracts/token/TradeToggleERC20.sol";
import "@imtbl/platform/contracts/escrow/IEscrow.sol";
import "./Product.sol";
import "./IPack.sol";

contract Chest is Product, TradeToggleERC20, ERC20Burnable, Ownable {

    IPack public pack;

    struct Purchase {
        address user;
        uint256 count;
    }

    Purchase internal currentPurchase;

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
        require(address(_pack) != address(0), "pack must be set");
        pack = _pack;
    }

    /** @dev Purchase chests for a user
     *
     * @param _user the user who will receive the chests
     * @param _qty the number of chests to purchase
     * @param _payment the details of the method by which payment will be made
     * @param _referrer the address of the user who made this referral
     */
    function purchaseFor(
        address payable _user,
        uint256 _qty,
        IPay.Payment memory _payment,
        address payable _referrer
    ) public {

        super.purchaseFor(_user, _qty, _payment, _referrer);

        if (_payment.currency == IPay.Currency.ETH) {
            _mint(msg.sender, _qty);
        } else {
            // escrow the chests
            IEscrow.Vault memory vault = IEscrow.Vault({
                player: _user,
                releaser: address(fiatEscrow),
                asset: address(this),
                balance: _qty,
                lowTokenID: 0,
                highTokenID: 0,
                tokenIDs: new uint256[](0)
            });

            currentPurchase = Purchase({
                user: _user,
                count: _qty
            });

            bytes memory data = abi.encodeWithSignature("mintTokens()");

            fiatEscrow.escrow(vault, address(this), data, _payment.escrowFor);
        }
    }

    function mintTokens() public {
        require(msg.sender == address(fiatEscrow.getProtocol()), "must be core escrow contract");
        require(currentPurchase.count > 0, "must create some tokens");
        _mint(currentPurchase.user, currentPurchase.count);
        delete currentPurchase;
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
        require(!tradable, "must not be already tradable");
        tradable = true;
        emit TradabilityChanged(true);
    }

}