pragma solidity 0.6.6;

interface IReferral {

    /**
     * @dev Get the split of cost between purchaser/referrer
     *
     * @param _user The address of the purchasing user
     * @param _value The total value of the purchase
     * @param _referrer The address of the referring user
     */
    function getSplit(
        address _user, uint256 _value, address _referrer
    ) external view returns (
        uint256 toVendor, uint256 toReferrer
    );

} 