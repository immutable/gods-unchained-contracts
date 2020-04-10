pragma solidity 0.6.6;

import "./PresalePackFour.sol";

contract RarePackFour is PresalePackFour {
    
    function basePrice() public returns (uint) {
        return 12 finney;
    }

    constructor(MigrationInterface _core, address payable vault) public PresalePackFour(_core, vault) {
    }

    function getCardDetails(uint16 packIndex, uint8 cardIndex, uint result) public view returns (uint16 proto, uint16 purity) {
        uint random;
        uint32 rarityRandom;
        uint16 protoRandom;
        uint16 purityOne;
        uint16 purityTwo;
        CardProto.Rarity rarity;

        (random, rarityRandom, purityOne, purityTwo, protoRandom) = getComponents(packIndex, cardIndex, result);

        if (cardIndex == 4) {
            rarity = _getRarePlusRarity(rarityRandom);
        } else {
            rarity = _getCommonPlusRarity(rarityRandom);
        }

        purity = _getPurity(purityOne, purityTwo);

        proto = migration.getRandomCard(rarity, protoRandom);
        return (proto, purity);
    }

}