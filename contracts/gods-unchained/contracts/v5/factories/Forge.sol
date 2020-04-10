pragma solidity 0.5.11;

import "@openzeppelin/contracts-v5/ownership/Ownable.sol";

import "../interfaces/ICards.sol";

contract Forge is Ownable {

    ICards cards;

    uint8 constant diamond = 1;

    bool public locked = false;

    event LockSet(bool status);
    event ForgedCards(uint finalId, uint[] all);

    constructor(ICards _cards) public {
        cards = _cards;
    }

    function forge(uint[] memory _ids) public {
        require(
            locked == false,
            "Forge: contract must be unlocked"
        );

        require(
            _ids.length == 5,
            "Forge: must forge 5 at a time"
        );

        (uint16 proto, uint8 quality) = cards.getDetails(_ids[0]);
        address owner = cards.ownerOf(_ids[0]);

        require(
            owner == msg.sender || cards.isApprovedForAll(owner, msg.sender) == true,
            "Forge: cannot forge without authorisation"
        );

        require(
            quality > diamond,
            "Forge: cannot forge diamond cards"
        );

        for (uint i = 1; i < 5; i++) {
            (uint16 nextProto, uint8 nextQuality) = cards.getDetails(_ids[i]);

            require(
                proto == nextProto,
                "Forge: different protos"
            );

            require(
                quality == nextQuality,
                "Forge: different qualities"
            );

            require(
                cards.ownerOf(_ids[i]) == owner,
                "Forge: different owners"
            );

            cards.burn(_ids[i]);
        }

        cards.setQuality(_ids[0], quality - 1);

        emit ForgedCards(_ids[0], _ids);
    }

    function setLock(bool status)
        onlyOwner
        public
    {
        locked = status;
        emit LockSet(status);
    }

}