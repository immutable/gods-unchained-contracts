pragma solidity 0.6.6;

import "../../cards/ICards.sol";
import "./Pack.sol";

contract RarityProvider {

    ICards cards;

    constructor(ICards _cards) public {
        cards = _cards;
    }

    struct RandomnessComponents {
        uint random;
        uint32 rarity;
        uint16 quality;
        uint16 purity;
        uint16 proto;
    }

    // return 'length' bytes of 'num' starting at 'start'
    function extract(uint num, uint length, uint start) internal pure returns (uint) {
        return (((1 << (length * 8)) - 1) & (num >> ((start - 1) * 8)));
    }

    // divides the random seed into components
    function getComponents(
        uint cardIndex, uint rand
    ) internal pure returns (
        RandomnessComponents memory
    ) {
        uint random = uint(keccak256(abi.encodePacked(cardIndex, rand)));
        return RandomnessComponents({
            random: random,
            rarity: uint32(extract(random, 4, 10) % 1000000),
            quality: uint16(extract(random, 2, 4) % 1000),
            purity: uint16(extract(random, 2, 6) % 1000),
            proto: uint16(extract(random, 2, 8) % (2**16-1))
        });
    }

    function getCardDetails(Pack.Type packType, uint cardIndex, uint result) internal view returns (uint16, uint16) {
        if (packType == Pack.Type.Shiny) {
            return _getShinyCardDetails(cardIndex, result);
        } else if (packType == Pack.Type.Legendary) {
            return _getLegendaryCardDetails(cardIndex, result);
        } else if (packType == Pack.Type.Epic) {
            return _getEpicCardDetails(cardIndex, result);
        }
        return _getRareCardDetails(cardIndex, result);
    }

    function _getShinyCardDetails(uint cardIndex, uint result) internal view returns (uint16 proto, uint16 purity) {
        
        RandomnessComponents memory rc = getComponents(cardIndex, result); 

        ICards.Rarity rarity;

        if (cardIndex % 5 == 0) {
            rarity = _getLegendaryPlusRarity(rc.rarity);
            purity = _getShinyPurityBase(rc.quality) + rc.purity;
        } else if (cardIndex % 5 == 1) {
            rarity = _getRarePlusRarity(rc.rarity);
            purity = _getPurityBase(rc.quality) + rc.purity;
        } else {
            rarity = _getCommonPlusRarity(rc.rarity);
            purity = _getPurityBase(rc.quality) + rc.purity;
        }
        proto = cards.getRandomCard(rarity, rc.proto);
        return (proto, purity);
    }

    function _getLegendaryCardDetails(uint cardIndex, uint result) internal view returns (uint16 proto, uint16 purity) {
        
        RandomnessComponents memory rc = getComponents(cardIndex, result);

        ICards.Rarity rarity;

        if (cardIndex % 5 == 0) {
            rarity = _getLegendaryPlusRarity(rc.rarity);
        } else if (cardIndex % 5 == 1) {
            rarity = _getRarePlusRarity(rc.rarity);
        } else {
            rarity = _getCommonPlusRarity(rc.rarity);
        }

        purity = _getPurityBase(rc.quality) + rc.purity;
    
        proto = cards.getRandomCard(rarity, rc.proto);

        return (proto, purity);
    }


    function _getEpicCardDetails(uint cardIndex, uint result) internal view returns (uint16 proto, uint16 purity) {
        
        RandomnessComponents memory rc = getComponents(cardIndex, result);

        ICards.Rarity rarity;

        if (cardIndex % 5 == 0) {
            rarity = _getEpicPlusRarity(rc.rarity);
        } else {
            rarity = _getCommonPlusRarity(rc.rarity);
        }

        purity = _getPurityBase(rc.quality) + rc.purity;
    
        proto = cards.getRandomCard(rarity, rc.proto);

        return (proto, purity);
    } 

    function _getRareCardDetails(uint cardIndex, uint result) internal view returns (uint16 proto, uint16 purity) {

        RandomnessComponents memory rc = getComponents(cardIndex, result);

        ICards.Rarity rarity;

        if (cardIndex % 5 == 0) {
            rarity = _getRarePlusRarity(rc.rarity);
        } else {
            rarity = _getCommonPlusRarity(rc.rarity);
        }

        purity = _getPurityBase(rc.quality) + rc.purity;
    
        proto = cards.getRandomCard(rarity, rc.proto);
        return (proto, purity);
    }  


    function _getCommonPlusRarity(uint32 rand) internal pure returns (ICards.Rarity) {
        if (rand == 999999) {
            return ICards.Rarity.Mythic;
        } else if (rand >= 998345) {
            return ICards.Rarity.Legendary;
        } else if (rand >= 986765) {
            return ICards.Rarity.Epic;
        } else if (rand >= 924890) {
            return ICards.Rarity.Rare;
        } else {
            return ICards.Rarity.Common;
        }
    }

    function _getRarePlusRarity(uint32 rand) internal pure returns (ICards.Rarity) {
        if (rand == 999999) {
            return ICards.Rarity.Mythic;
        } else if (rand >= 981615) {
            return ICards.Rarity.Legendary;
        } else if (rand >= 852940) {
            return ICards.Rarity.Epic;
        } else {
            return ICards.Rarity.Rare;
        } 
    }

    function _getEpicPlusRarity(uint32 rand) internal pure returns (ICards.Rarity) {
        if (rand == 999999) {
            return ICards.Rarity.Mythic;
        } else if (rand >= 981615) {
            return ICards.Rarity.Legendary;
        } else {
            return ICards.Rarity.Epic;
        }
    }

    function _getLegendaryPlusRarity(uint32 rand) internal pure returns (ICards.Rarity) {
        if (rand == 999999) {
            return ICards.Rarity.Mythic;
        } else {
            return ICards.Rarity.Legendary;
        } 
    }

    // store purity and shine as one number to save users gas
    function _getPurityBase(uint16 randOne) internal pure returns (uint16) {
        if (randOne >= 998) {
            return 3000;
        } else if (randOne >= 988) {
            return 2000;
        } else if (randOne >= 938) {
            return 1000;
        }
        return 0;
    }

    function _getShinyPurityBase(uint16 randOne) internal pure returns (uint16) {
        if (randOne >= 998) {
            return 3000;
        } else if (randOne >= 748) {
            return 2000;
        } else {
            return 1000;
        }
    }

    function getShine(uint16 purity) public pure returns (uint8) {
        return uint8(purity / 1000);
    }

}