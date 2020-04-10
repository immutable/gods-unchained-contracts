pragma solidity 0.6.6;
pragma experimental ABIEncoderV2;

import "../Product.sol";
import "./RarityProvider.sol";
import "../../ICards.sol";
import "@imtbl/platform/contracts/randomness/IBeacon.sol";

abstract contract Pack is Product, RarityProvider {

    struct Purchase {
        uint256 commitBlock;
        uint256 quantity;
        uint256 escrowFor;
        address user;
    }

    // All purchases recorded by this pack
    Purchase[] public purchases;
    // The randomness beacon used by this pack
    IBeacon public beacon;
    // The core cards contract
    ICards public cards;
    // The address of the chest linked to this pack
    address public chest;

    constructor(
        IBeacon _beacon,
        ICards _cards,
        bytes32 _sku,
        uint256 _saleCap,
        uint256 _price,
        IReferral _referral,
        ICreditCardEscrow _fiatEscrow,
        IPay _processor
    ) public Product(
        _sku, _saleCap, _price, _referral, _fiatEscrow, _processor
    ) {
        beacon = _beacon;
        cards = _cards;
    }

    /** @dev Purchase packs for a user
     *
     * @param _chest the chest contract for this pack
     */
    function setChest(address _chest) public onlyOwner {
        require(chest == address(0), "GU:S1:Pack: must not have already set chest");
        chest = _chest;
    }

    /** @dev Create cards from a purchase
     *
     * @param _id the ID of the purchase
     */
    function createCards(uint256 _id) public {
        require(_id < purchases.length, "GU:S1:Pack: purchase ID invalid");
        Purchase memory purchase = purchases[_id];
        if (purchase.escrowFor == 0) {
            _createCards(purchase, purchase.user);
        } else {
            _escrowCards(_id);
        }
    }

    function _escrowCards(uint256 _id) internal {

        Purchase memory purchase = purchases[_id];

        uint cardCount = purchase.quantity * 5;
        uint low = cards.nextBatch();
        uint high = low + cardCount;

        IEscrow.Vault memory vault = IEscrow.Vault({
            player: purchase.user,
            releaser: address(fiatEscrow),
            asset: address(cards),
            balance: 0,
            lowTokenID: low,
            highTokenID: high,
            tokenIDs: new uint256[](0)
        });

        bytes memory data = abi.encodeWithSignature("escrowHook(uint256)", _id);

        fiatEscrow.escrow(vault, address(this), data, purchase.escrowFor);
    }

    function escrowHook(uint256 id) public {
        address protocol = address(fiatEscrow.getProtocol());
        require(msg.sender == protocol, "GU:S1:Pack: must be core escrow");
        Purchase memory purchase = purchases[id];
        require(purchase.quantity > 0, "GU:S1:Pack: must have cards available");
        _createCards(purchase, protocol);
        delete purchases[id];
    }

    /** @dev Purchase packs for a user
     *
     * @param _user the user who will receive the packs
     * @param _quantity the number of packs to purchase
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
        if (_payment.currency == IPay.Currency.ETH) {
            _createPurchase(_user, _quantity, 0);
        } else {
            _createPurchase(_user, _quantity, _payment.escrowFor);
        }
    }

    function _createCards(Purchase memory _purchase, address _user) internal {
        uint256 randomness = uint256(beacon.randomness(_purchase.commitBlock));
        uint cardCount = _purchase.quantity * 5;
        uint16[] memory protos = new uint16[](cardCount);
        uint8[] memory qualities = new uint8[](cardCount);
        for (uint i = 0; i < cardCount; i++) {
            (protos[i], qualities[i]) = _getCardDetails(i, randomness);
        }
        cards.mintCards(_user, protos, qualities);
    }

    function openChests(address _user, uint256 _quantity) public {
        require(msg.sender == chest, "GU:S1:Pack: must be the chest contract");
        _createPurchase(_user, _quantity * 6, 0);
    }

    function _createPurchase(
        address _user,
        uint256 _quantity,
        uint256 _escrowFor
    ) internal returns (uint256) {

        purchases.push(Purchase({
            commitBlock: beacon.commit(0),
            quantity: _quantity,
            user: _user,
            escrowFor: _escrowFor
        }));

        return purchases.length - 1;
    }

    function _getCardDetails(uint _index, uint _random) internal virtual view returns (uint16 proto, uint8 quality);

}