pragma solidity ^0.5.11;

import "./SeasonManager.sol";

contract PackTemplate {

    // Access to core functions
    SeasonManager public manager;

    // Limit how many cards can be sold
    uint256 public SALE_CAP;
    
    event PackPurchased();

    constructor(
        address _seasonManagerAddress,
        uint256 _saleCap
    )
        public
    {
        manager = SeasonManager(_seasonManagerAddress);
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