pragma solidity 0.5.11;

import "@openzeppelin/contracts-v5/ownership/Ownable.sol";

import "../interfaces/ICards.sol";

contract S3PromoFactory is Ownable {

    ICards public cards;

    mapping(uint16 => Promo) public promos;

    uint16 public maxProto;
    uint16 public minProto;

    struct Promo {
        bool isLocked;
        address minter;
    }
    
    /**
     * Events
    */

    event PromoAssigned(
        uint16 proto,
        address minter
    );

    event PromoLocked(
        uint16 proto
    );

    /**
     * Constructor
     */

    constructor(
        ICards _cards,
        uint16 _minProto,
        uint16 _maxProto
    )
        public
    {
        cards = _cards;
        minProto = _minProto;
        maxProto = _maxProto;
    }

    /**
     * Public functions
     */

    function mint(
        address _to,
        uint16[] memory _protos,
        uint8[] memory _qualities
    )
        public
    {
        require(
            _protos.length == _qualities.length,
            "Promo Factory: array length mismatch between protos and qualities"
        );

        for (uint i; i < _protos.length; i++) {
            require(
                promos[_protos[i]].minter == msg.sender,
                "Promo Factory: only assigned minter can mint for this proto"
            );

            require(
                promos[_protos[i]].isLocked == false,
                "Promo Factory: cannot mint a locked proto"
            );
        }

        cards.mintCards(_to, _protos, _qualities);
    }

    // TODO: Add tests for this method (already have test for multiple mint)
    function mintSingle(
        address _to,
        uint16 _proto,
        uint8 _quality
    )
        public
    {

        require(
            promos[_proto].minter == msg.sender,
            "Promo Factory: only assigned minter can mint for this proto"
        );

        require(
            promos[_proto].isLocked == false,
            "Promo Factory: cannot mint a locked proto"
        );

        cards.mintCard(_to, _proto, _quality);
    }

    /**
     * Only Owner functions
     */

    function assignPromoMinter(
        address minter,
        uint16 proto
    )
        public
        onlyOwner
    {
        require(
            proto >= minProto,
            "Promo Factory: proto must be greater than min proto"
        );

        require(
            proto <= maxProto,
            "Promo Factory: proto must be less than max proto"
        );

        require(
            promos[proto].isLocked == false,
            "Promo Factory: proto already locked"
        );

        promos[proto].minter = minter;

        emit PromoAssigned(proto, minter);

    }

    function lock(
        uint16 proto
    )
        public
        onlyOwner
    {
        require(
            promos[proto].minter != address(0),
            "Promo Factory: must be an assigned proto"
        );

        require(
            promos[proto].isLocked == false,
            "Promo Factory: cannot lock a locked proto"
        );

        promos[proto].isLocked = true;

        emit PromoLocked(proto);
    }
}