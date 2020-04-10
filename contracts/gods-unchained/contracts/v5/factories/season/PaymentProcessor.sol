pragma solidity 0.5.11;

contract PaymentProcessor {

    mapping (bytes32 => address[]) public approvedSellers;

    address public sellersArray;

    uint256 public purchasesCount;

    address public revenueCollector;

    event RecordPurchase(
        address user,
        uint256 purchaseId,
        bytes32 sku,
        uint256 itemCost,
        uint256 itemsCount,
        address paymentToken,
        address revenueCollector,
        address[] affiliates,
        uint256[] affiliateAmounts
    );

    event SellerApproved();
    event SellerDisapproved();

    /**
     * @dev Process a payment made and handle referrals as well
     *
     * @param _user The user who made the purchase
     * @param _sku Unique code of the products being purchased
     * @param _itemCost How much was paid per item
     * @param _itemsCount How many items were purchased
     * @param _paymentToken Address of the token to make a payment in
     * @param _affiliateAddresses Who were the affiliates
     * @param _affiliateAmounts How much is each affiliate to recieve
    */
    function processPurchase(
        address _user,
        bytes32 _sku,
        uint256 _itemCost,
        uint256 _itemsCount,
        address _paymentToken,
        address[] memory _affiliateAddresses,
        uint256[] memory _affiliateAmounts
    ) public returns (uint256) {}

    /**
     * @dev Get the approved sellers who can process payments from this contract.
     *
     * @param _code The SKU code to get thes sellers for
     */
    function getSellers(
        bytes32 _code
    ) public view returns (address[] memory) {}

    /**
     * @dev Add a new seller who can process payments.
     * 
     * @param _seller Address of the seller to add
     * @param _code SKU code they can purchase against
    */
    function addSkuCode(
        address _seller,
        bytes32 _code
    ) public {}

    /**
     * @dev Remove an existing seller who can process payments
     * WARNING: this could cause purchases to fail if still being used.
     *
     * @param _seller Address of the seller to remove
     * @param _code SKU code they cannot purchase against
     */
    function removeSkuCode(
        address _seller,
        bytes32 _code
    ) public {}

}