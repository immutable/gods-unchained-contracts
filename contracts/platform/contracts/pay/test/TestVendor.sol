pragma solidity 0.6.6;
pragma experimental ABIEncoderV2;

import "../IPay.sol";

contract TestVendor {

    IPay pay;

    constructor(IPay _pay) public {
        pay = _pay;
    }

    function processPayment(IPay.Order memory order, IPay.Payment memory payment) public payable {
        pay.process.value(msg.value)(order, payment);
    }

}