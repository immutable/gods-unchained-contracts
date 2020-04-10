pragma solidity 0.6.6;

import "./BaseMigration.sol";
import "../packs/five/PackFive.sol";

contract v2Migration is BaseMigration {

    constructor(address[] memory _packs) public {
        for (uint i = 0; i < _packs.length; i++) {
            canMigrate[_packs[i]] = true;
        }
    }

    mapping (address => bool) public canMigrate;
    mapping (address => mapping (uint => bool)) v2Migrated;

    function migrate(PackFive pack, uint id) public returns (uint start, uint end) {
        require(canMigrate[address(pack)], "must be migrating from an approved pack");
        (uint count, uint randomness,,,,, address user) = pack.purchases(id);
        uint[] memory state = pack.getPurchaseState(id);
        require(noCardsActivated(state), "must have no cards activated");
        require(v2Migrated[address(pack)][id], "must not have been migrated previously");

        uint16[] memory protos;
        uint16[] memory purities;

        (protos, purities) = pack.predictPacks(id);

    }

    function noCardsActivated(uint[] memory state) public view returns (bool) {
        for (uint i = 0; i < state.length; i++) {
            if (state[i] != 0) {
                return false;
            }
        }
        return true;
    }
}