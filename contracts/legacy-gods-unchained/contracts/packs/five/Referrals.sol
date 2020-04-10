pragma solidity 0.6.6;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Referrals is Ownable {

    using SafeMath for uint;

    uint public discountLimit;
    uint public defaultDiscount;
    uint public defaultRefer;

    mapping(address => Split) public splits;

    struct Split {
        bool set;
        uint8 discountPercentage;
        uint8 referrerPercentage;
    }

    event SplitChanged(address user, uint8 discount, uint8 referrer);

    constructor(uint _discountLimit, uint _defaultDiscount, uint _defaultRefer) public {
        setDiscountLimit(_discountLimit);
        setDefaults(_defaultDiscount, _defaultRefer);
    }

    // sets the discount and referral percentages for the current user
    // this is deliberately user-customisable
    function setSplit(uint8 discount, uint8 referrer) public {
        require(discountLimit >= discount + referrer, "can't give more than the limit");
        require(discount + referrer >= discount, "can't overflow");
        splits[msg.sender] = Split({
            discountPercentage: discount,
            referrerPercentage: referrer,
            set: true
        });
        emit SplitChanged(msg.sender, discount, referrer);
    }

    // override a user's split
    function overrideSplit(address user, uint8 discount, uint8 referrer) public onlyOwner {
        require(discountLimit >= discount + referrer, "can't give more than the limit");
        require(discount + referrer >= discount, "can't overflow");
        splits[user] = Split({
            discountPercentage: discount,
            referrerPercentage: referrer,
            set: true
        });
        emit SplitChanged(user, discount, referrer);
    }

    // sets the max purchase total discount
    function setDiscountLimit(uint _limit) public onlyOwner {
        require(_limit <= 100, "discount limit must be <= 100");
        discountLimit = _limit;
    }

    // sets the default discount and referral percentages
    function setDefaults(uint _discount, uint _refer) public onlyOwner {
        require(discountLimit >= _discount + _refer, "can't be more than the limit");
        require(_discount + _refer >= _discount, "can't overflow");
        defaultDiscount = _discount;
        defaultRefer = _refer;
    }

    // gets the discount and referral rates for a particular user
    function getSplit(address user) public view returns (uint8 discount, uint8 referrer) {
        if (user == address(0)) {
            return (0, 0);
        }
        Split memory s = splits[user];
        if (!s.set) {
            return (uint8(defaultDiscount), uint8(defaultRefer));
        }
        return (s.discountPercentage, s.referrerPercentage);
    }

}