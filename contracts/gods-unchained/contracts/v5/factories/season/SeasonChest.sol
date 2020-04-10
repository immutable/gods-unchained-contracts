pragma solidity 0.5.11;

import "./SeasonCore.sol";

contract SeasonChest {

    // Access to core functions
    SeasonCore private core;

    // Limit how many to be sold
    uint256 public SALE_CAP;

    event ChestPurchased();

    event ChestOpened();

    /**
     * @dev Purchase a chest of packs.
     *
     * @param _count The number of chests to purchase
     * @param _affiliate The affiliate to give a cut to
     */
    function purchaseChest(
        uint256 _count,
        address _affiliate
    ) public {}

    /**
     * @dev Purchase a chest of packs on behalf of someone else.
     * 
     * @param _user The user to purchase it for
     * @param _count The number of chests to purchase
     * @param _affiliate The affiliate to give a cut to
     */
    function purchaseChestFor(
        address _user,
        uint256 _count,
        address _affiliate
    ) public {}

    /**
     * @dev // TODO: Purchase a chest via a signed receipt.
     */
    function purchaseChestViaReceipt() public {}

    /**
     * @dev Open a chest that has been purchased
     *
     * @param _count Number of chests to open
     */
    function openChest(
        uint256 _count
    ) public {}

    /**
     * @dev Open a chest on behalf of another user
     *
     * @param _user User to open on behalf of
     * @param _count Number of chest to open
     */
    function openChestFor(
        address _user,
        uint256 _count
    ) public {}

    /**
     * @dev Unlock trading of chests between users.
     */
    function unlockTrading() public {}
  
}