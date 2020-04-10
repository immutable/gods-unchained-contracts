pragma solidity 0.6.6;

import "../packs/four/IPackFour.sol";
import "./BaseMigration.sol";

contract v1Migration is BaseMigration {

    constructor(address[] memory _packs) public {
        for (uint i = 0; i < _packs.length; i++) {
            canMigrate[_packs[i]] = true;
        }
    }
    mapping (address => bool) public canMigrate;

    mapping (address => mapping (uint => bool)) v1Migrated;

    function migrate(IPackFour pack, uint id) public returns (uint start, uint end) {
        require(canMigrate[address(pack)], "must be migrating from an approved pack");
        require(!v1Migrated[address(pack)][id], "purchase already migrated");
        (uint16 current, uint16 count, address user, uint256 randomness,) = pack.purchases(id);

        uint size = (count - current) * 5;

        uint16[] memory protos;
        uint16[] memory purities;

        (protos, purities) = pack.predictPacks(id);
        // TODO: what if size is > blocksize/limit?
    
        v1Migrated[address(pack)][id] = true;
    }

}

    