pragma solidity 0.5.11;

import "../IBeacon.sol";

contract Consumer {

    function multiCommit(IBeacon beacon, uint count) public {
        for (uint i = 0; i < count; i++) {
            beacon.commit(0);
        }
    }
}