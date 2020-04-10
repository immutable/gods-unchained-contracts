pragma solidity 0.5.11;

import "./SeasonCore.sol";

contract SeasonPack {

    // Access to core functions
    SeasonCore public core;

    // Limit how many cards can be sold
    uint256 public SALE_CAP;
    
    event PackPurchased();

    constructor(
        address _seasonCoreAddress,
        uint256 _saleCap
    )
        public
    {
        core = SeasonCore(_seasonCoreAddress);
        SALE_CAP = _saleCap;
    }

    /**
     * @dev Purchase a pack of cards.
     *
     * @param _count Number of packs to purchase
     * @param _affiliate Address to earn a cut from sale
     */
    function purchasePack(
        uint256 _count,
        address _affiliate
    ) public {}

    /**
     * @dev Purchase a pack of cards on behalf of another user.
     *
     * @param _user User to purchase the pack of cards on behalf of.
     * @param _count Number of packs to purchase
     * @param _affiliate Address to earn a cut from the sale
     */
    function purchasePackFor(
        address _user,
        uint256 _count,
        address _affiliate
    ) public {}

    /**
     * @dev // TODO: Purchase a pack via a signed receipt.
     */
    function purchasePackViaReceipt() public {}

}