pragma solidity 0.6.6;

import "../../cards/CardProto.sol";

contract MigrationInterface {

    function createCard(address user, uint16 proto, uint16 purity) public returns (uint);

    function getRandomCard(CardProto.Rarity rarity, uint16 random) public view returns (uint16);

    function migrate(uint id) public;

}