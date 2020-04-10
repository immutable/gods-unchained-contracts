pragma solidity 0.6.6;

import "@imtbl/gods-unchained/contracts/interfaces/ICards.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./OldToken.sol";
import "./BaseMigration.sol";

contract DirectMigration is BaseMigration {

    OldToken old;
    ICards cards;
    
    uint limit;
    uint current;

    event Migrated(address indexed user, uint oldStart, uint oldEnd, uint newStart);
    event NonGenesisMigrated(address indexed user, uint oldID, uint newID);

    constructor(OldToken _old, ICards _cards, uint _limit) public {
        old = _old;
        cards = _cards;
        limit = _limit;
    }

    struct IM {
        uint16 proto;
        uint16 purity;
        uint16 p;
        uint8 q;
        uint id;
    }

    uint public migrated;

    function multiMigrate() public {
        while (gasleft() > 3000000) {
            activatedMigration();
        }
    }

    function activatedMigration() public returns (uint length) {
        uint start = migrated;
        address first = old.ownerOf(start);
        current = start;
        address owner = first;
        uint last = old.totalSupply();

        while (owner == first && current < start + limit) {
            current++;
            if (current >= last) {
                break;
            }
            owner = old.ownerOf(current);
        }

        uint size = current - start;

        require(size > 0, "size is zero");

        uint16[] memory protos = new uint16[](size);
        uint8[] memory qualities = new uint8[](size);

        // dodge the stack variable limit
        IM memory im;
        uint count = 0;

        for (uint i = 0; i < size; i++) {
            (im.proto, im.purity) = old.getCard(start+i);
            im.p = convertProto(im.proto);
            im.q = convertPurity(im.purity);
            if (im.p > 377) {
                im.id = cards.mintCard(first, im.p, im.q);
                emit NonGenesisMigrated(first, start + i, im.id);
            } else {
                protos[count] = im.p;
                qualities[count] = im.q;
                count++;
            }
        }

        if (count > 0) {
            // change lengths back to count
            assembly{mstore(protos, count)}
            assembly{mstore(qualities, count)}

            uint newStart = cards.mintCards(first, protos, qualities);

            emit Migrated(first, start, current, newStart);
        }

        migrated = current;

        return current - start;
    }

}