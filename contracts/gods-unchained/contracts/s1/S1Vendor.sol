pragma solidity 0.5.11;
pragma experimental ABIEncoderV2;

import "./referral/IReferral.sol";
import "@imtbl/platform/contracts/escrow/releaser/ICreditCardEscrow.sol";
import "@imtbl/platform/contracts/pay/IPurchaseProcessor.sol";
import "@imtbl/platform/contracts/pay/vendor/SingleItemVendor.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract S1Vendor is SingleItemVendor {

    // Referral contract
    IReferral public referral;

    constructor(
        IReferral _referral,
        bytes32 _sku,
        uint256 _price,
        ICreditCardEscrow _escrow,
        IPurchaseProcessor _pay
    ) public SingleItemVendor(
        _sku,
        IPurchaseProcessor.Currency.USDCents,
        _price,
        _escrow,
        _pay
    ) {
        referral = _referral;
    }

    /** @dev Purchase assets
     *
     * @param _quantity the number of this product to purchase
     * @param _payment the details of the method by which payment will be made
     * @param _referrer the address of the user who made this referral
     */
    function purchase(
        uint256 _quantity,
        IPurchaseProcessor.PaymentParams memory _payment,
        address payable _referrer
    ) public payable returns (uint256 paymentID) {
        return purchaseFor(msg.sender, _quantity, _payment, _referrer);
    }

    /** @dev Purchase assets for a user
     *
     * @param _recipient the user who will receive the assets
     * @param _quantity the number of this product to purchase
     * @param _payment the details of the method by which payment will be made
     * @param _referrer the address of the user who made this referral
     */
    function purchaseFor(
        address payable _recipient,
        uint256 _quantity,
        IPurchaseProcessor.PaymentParams memory _payment,
        address payable _referrer
    ) public payable returns (uint256 paymentID) {

        paymentID = super._purchaseFor(_recipient, _quantity, _payment);

        // if the user is paying in ETH, we can pay affiliate fees instantly!
        // if (_payment.currency == IPurchaseProcessor.Currency.ETH) {
        //     if (_referrer != address(0)) {
        //         uint toReferrer;
        //         (totalPrice, toReferrer) = referral.getSplit(_recipient, totalPrice, _referrer);
        //         order.totalPrice = totalPrice;
        //         // TODO: pay the referrer
        //         emit PurchaseReferred(purchaseID, _referrer);
        //     }
        // }

        return paymentID;
    }

}