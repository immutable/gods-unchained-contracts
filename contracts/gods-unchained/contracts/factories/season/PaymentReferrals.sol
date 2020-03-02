pragma solidity ^0.5.11;

contract PaymentReferrals {

    uint256 public splitLimit;

    mapping(address => uint256) public splits;

    event SplitSet(
        address user,
        uint256 percentage
    );

    constructor(uint256 _splitLimit) public {

    }

    /**
     * @dev Determine the amount to split
     *
     * @param _user The user to calculate the split on behalf of
     */
    function determineSplit(
        address _user
    )
        public
    {

    }

    /**
     * @dev Set the amount of split for a user
     *
     * @param _user The user to set the split for
     * @param _percentage The percentage expressed as an integer divisible by 10000 (2 dp)
     */
    function setSplit(
        address _user,
        uint256 _percentage
    )
        public
    {

    }

    /**
     * @dev Set the maximum a referrer can set
     *
     * @param _limit The actual limit  expressed as an integer divisible by 10000 (2 dp)
     */
    function setSplitLimit(
        uint256 _limit
    )
        public
    {

    }

}