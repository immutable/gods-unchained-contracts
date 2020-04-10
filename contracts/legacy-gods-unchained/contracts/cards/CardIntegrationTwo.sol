pragma solidity 0.6.6;

import "./CardOwnershipTwo.sol";
import "./CardProto.sol";

contract CardIntegrationTwo is CardOwnershipTwo, CardProto {
    
    address[] public packs;

    event CardCreated(uint indexed id, uint16 proto, uint16 purity, address owner);

    function addPack(address approved) public onlyGovernor {
        packs.push(approved);
    }

    modifier onlyApprovedPacks {
        require(_isApprovedPack());
        _;
    }

    function _isApprovedPack() private view returns (bool) {
        for (uint i = 0; i < packs.length; i++) {
            if (msg.sender == address(packs[i])) {
                return true;
            }
        }
        return false;
    }

    function createCard(address owner, uint16 proto, uint16 purity) public returns (uint) {
        // if (card.rarity == Rarity.Mythic) {
        //     uint64 limit;
        //     bool exists;
        //     (limit, exists) = getLimit(proto);
        //     require(!exists || limit > 0);
        //     limits[proto].limit--;
        // }
        return _createCard(owner, proto, purity);
    }

    function _createCard(address owner, uint16 proto, uint16 purity) internal returns (uint) {
        
        Card memory card = Card({
            proto: proto,
            purity: purity
        });

        uint id = cards.push(card) - 1;

        _mint(owner, id);

        emit CardCreated(id, proto, purity, owner);

        return id;
    }

}