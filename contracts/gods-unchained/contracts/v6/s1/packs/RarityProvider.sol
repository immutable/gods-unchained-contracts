pragma solidity 0.6.6;

contract RarityProvider {

    uint16[] legendaries = [4];
    uint16[] epics = [3];
    uint16[] rares = [2];
    uint16[] commons = [1];

    enum Rarity {
        Common,
        Rare,
        Epic,
        Legendary,
        Mythic
    }

    struct Components {
        uint32 rarity;
        uint16 quality;
        uint16 proto;
    }

    // return 'length' bytes of 'num' starting at 'start'
    function extract(uint num, uint length, uint start) internal pure returns (uint) {
        return (((1 << (length * 8)) - 1) & (num >> ((start - 1) * 8)));
    }

    // divides the random seed into components
    function _getComponents(uint _index, uint _rand) internal pure returns (Components memory) {
        uint random = uint(keccak256(abi.encodePacked(_index, _rand)));
        return Components({
            rarity: uint32(extract(random, 4, 10) % 1000000),
            quality: uint16(extract(random, 2, 4) % 1000),
            proto: uint16(extract(random, 2, 8) % (2**16-1))
        });
    }

    function _getCommonPlusRarity(uint32 _rand) internal pure returns (Rarity) {
        if (_rand >= 998345) {
            return Rarity.Legendary;
        } else if (_rand >= 986765) {
            return Rarity.Epic;
        } else if (_rand >= 924890) {
            return Rarity.Rare;
        } else {
            return Rarity.Common;
        }
    }

    function _getRarePlusRarity(uint32 _rand) internal pure returns (Rarity) {
        if (_rand >= 981615) {
            return Rarity.Legendary;
        } else if (_rand >= 852940) {
            return Rarity.Epic;
        } else {
            return Rarity.Rare;
        }
    }

    function _getEpicPlusRarity(uint32 _rand) internal pure returns (Rarity) {
        if (_rand >= 981615) {
            return Rarity.Legendary;
        } else {
            return Rarity.Epic;
        }
    }

    function _getQuality(uint16 _rand) internal pure returns (uint8) {
        if (_rand >= 998) {
            return 1;
        } else if (_rand >= 988) {
            return 2;
        } else if (_rand >= 938) {
            return 3;
        } else {
            return 4;
        }
    }

    function _getShinyQuality(uint16 _rand) internal pure returns (uint8) {
        if (_rand >= 998) {
            return 1;
        } else if (_rand >= 748) {
            return 2;
        } else {
            return 3;
        }
    }

    function _getRandomCard(Rarity _rarity, uint16 _random) internal view returns (uint16) {
        // modulo bias is fine - creates rarity tiers etc
        // will obviously revert is there are no cards of that type: this is expected - should never happen
        if (_rarity == Rarity.Common) {
            return commons[_random % commons.length];
        } else if (_rarity == Rarity.Rare) {
            return rares[_random % rares.length];
        } else if (_rarity == Rarity.Epic) {
            return epics[_random % epics.length];
        } else {
            return legendaries[_random % legendaries.length];
        }
    }

}