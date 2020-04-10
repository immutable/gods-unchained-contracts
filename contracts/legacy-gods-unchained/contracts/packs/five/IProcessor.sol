pragma solidity 0.6.6;

interface IProcessor {

    function processPayment(address user, uint cost, uint items, address referrer) external payable returns (uint id);
    
}