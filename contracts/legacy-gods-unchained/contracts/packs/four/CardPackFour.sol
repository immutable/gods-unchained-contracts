pragma solidity 0.6.6;

import "./MigrationInterface.sol";

contract CardPackFour {

    MigrationInterface public migration;
    uint public creationBlock;

    constructor(MigrationInterface _core) public payable {
        migration = _core;
        creationBlock = 5939061 + 2000; // set to creation block of first contracts + 8 hours for down time
    }

    event Referral(address indexed referrer, uint value, address purchaser);

    /**
    * purchase 'count' of this type of pack
    */
    // function purchase(uint16 packCount, address referrer) public payable;

    // store purity and shine as one number to save users gas
    function _getPurity(uint16 randOne, uint16 randTwo) internal pure returns (uint16) {
        if (randOne >= 998) {
            return 3000 + randTwo;
        } else if (randOne >= 988) {
            return 2000 + randTwo;
        } else if (randOne >= 938) {
            return 1000 + randTwo;
        } else {
            return randTwo;
        }
    }

}