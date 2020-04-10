pragma solidity 0.6.6;

import "./IReferrals.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Referrals.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract Processor is Ownable {

    using SafeMath for uint256;

    IReferrals public referrals;
    address payable public vault;
    uint public count;
    mapping(address => bool) public approvedSellers;

    event PaymentProcessed(uint id, address user, uint cost, uint items, address referrer, uint toVault, uint toReferrer);
    event SellerApprovalChanged(address seller, bool approved);

    constructor(address payable _vault, IReferrals _referrals) public {
        referrals = _referrals;
        vault = _vault;
    }

    function setCanSell(address seller, bool approved) public onlyOwner {
        approvedSellers[seller] = approved;
        emit SellerApprovalChanged(seller, approved);
    }

    function processPayment(address payable user, uint cost, uint items, address payable referrer) public payable returns (uint) {

        require(approvedSellers[msg.sender]);
        require(user != referrer, "can't refer yourself");
        require(items != 0, "have to purchase at least one item");
        require(cost > 0, "items must cost something");
        // TODO: are these necessary for the simple percentage logic?
        require(cost >= 100, "items must cost at least 100 wei");
        require(cost % 100 == 0, "costs must be multiples of 100");

        uint toVault;
        uint toReferrer;
        
        (toVault, toReferrer) = getAllocations(cost, items, referrer);

        uint total = toVault.add(toReferrer);

        // check that the tx has enough value to complete the payment
        require(msg.value >= total, "not enough value sent to contract");
        if (msg.value > total) {
            uint change = msg.value.sub(total);
            user.transfer(change);
        }

        vault.transfer(toVault);

        // pay the referral fee
        if (toReferrer > 0 && referrer != address(0)) {
            referrer.transfer(toReferrer);
        }

        // give this payment a unique ID
        uint id = count++;
        emit PaymentProcessed(id, user, cost, items, referrer, toVault, toReferrer);

        return id;
    }

    // get the amount of the purchase which will be allocated to
    // the vault and to the referrer
    function getAllocations(uint cost, uint items, address referrer) public view returns (uint toVault, uint toReferrer) {
        uint8 discount;
        uint8 refer;
        (discount, refer) = referrals.getSplit(referrer);
        require(discount + refer <= 100 && discount + refer >= discount, "invalid referral split");
        // avoid overflow
        uint total = cost.mul(items);
        uint8 vaultPercentage = 100 - discount - refer;
        toVault = getPercentage(total, vaultPercentage);
        toReferrer = getPercentage(total, refer);
        uint discountedTotal = getPercentage(total, 100 - discount);
        require(discountedTotal == toVault.add(toReferrer), "not all funds allocated");
        return (toVault, toReferrer);
    }

    // returns the price (including discount) which must be paid by the user
    function getPrice(uint cost, uint items, address referrer) public view returns (uint) {

        uint8 discount;
        (discount, ) = referrals.getSplit(referrer);

        return getPercentage(cost.mul(items), 100 - discount);
    }

    function getPercentage(uint amount, uint8 percentage) public pure returns (uint) {
        
        // TODO: are these necessary for the percentage logic?
        require(amount >= 100, "items must cost at least 100 wei");
        require(amount % 100 == 0, "costs must be multiples of 100 wei");
    
        return amount.mul(percentage).div(100);
    }

}