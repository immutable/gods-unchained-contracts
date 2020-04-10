pragma solidity 0.5.11;

// solium-disable security/no-inline-assembly

import "@openzeppelin/contracts-v5/ownership/Ownable.sol";
import "@openzeppelin/contracts-v5/math/SafeMath.sol";
import "./token/MultiTransfer.sol";
import "./token/BatchToken.sol";
import "./token/ImmutableToken.sol";
import "./token/InscribableToken.sol";

import "./interfaces/ICards.sol";

import "./util/StorageWrite.sol";

/**
 * @title Immutable's Gods Unchained Contracts.
 * @notice The core ERC721 contract that holds all cards.
 * @author Immutable
 */
contract Cards is Ownable, MultiTransfer, BatchToken, ImmutableToken, InscribableToken {

    uint16 private constant MAX_UINT16 = 2**16 - 1;

    uint16[] public cardProtos;
    uint8[] public cardQualities;

    struct Season {
        uint16 high;
        uint16 low;
    }

    struct Proto {
        bool locked;
        bool exists;
        uint8 god;
        uint8 cardType;
        uint8 rarity;
        uint8 mana;
        uint8 attack;
        uint8 health;
        uint8 tribe;
    }

    event ProtoUpdated(
        uint16 indexed id
    );

    event SeasonStarted(
        uint16 indexed id,
        string name,
        uint16 indexed low,
        uint16 indexed high
    );

    event QualityChanged(
        uint256 indexed tokenId,
        uint8 quality,
        address factory
    );

    event CardsMinted(
        uint256 indexed start,
        address to,
        uint16[] protos,
        uint8[] qualities
    );

    // Value of index proto = season
    uint16[] public protoToSeason;

    address public propertyManager;

    // Array containing all protos
    Proto[] public protos;

    // Array containing all seasons
    Season[] public seasons;

    // Map whether a season is tradeable or not
    mapping(uint256 => bool) public seasonTradable;

    // Map whether a factory has been authorised or not
    mapping(address => mapping(uint256 => bool)) public factoryApproved;

    // Whether a factory is approved to create a particular mythic
    mapping(uint16 => mapping(address => bool)) public mythicApproved;

    // Whether a mythic is tradable
    mapping(uint16 => bool) public mythicTradable;

    // Map whether a mythic exists or not
    mapping(uint16 => bool) public mythicCreated;

    uint16 public constant MYTHIC_THRESHOLD = 65000;

    constructor(
        uint256 _batchSize,
        string memory _name,
        string memory _symbol
    )
        public
        BatchToken(_batchSize, _name, _symbol)
    {
        cardProtos.length = MAX_LENGTH;
        cardQualities.length = MAX_LENGTH;
        protoToSeason.length = MAX_LENGTH;
        protos.length = MAX_LENGTH;
        propertyManager = msg.sender;
    }

    /**
     * @dev Mint a card with an owner, proto and quality.
     * Can only be called from the proto's season minter(s)
     *
     * @param to Address where newly minted card will be sent to
     * @param _proto Specified proto of new card (caller must be valid factory in season)
     * @param _quality Specified quality of new card (no validation)
     */
    function mintCard(
        address to,
        uint16 _proto,
        uint8 _quality
    )
        external
        returns (uint id)
    {
        id = _batchMint(to, 1);
        _validateProto(_proto);
        cardProtos[id] = _proto;
        cardQualities[id] = _quality;

        uint16[] memory ps = new uint16[](1);
        ps[0] = _proto;

        uint8[] memory qs = new uint8[](1);
        qs[0] = _quality;

        emit CardsMinted(id, to, ps, qs);
        return id;
    }

    /**
     * @dev Mint cards with an owner, proto and quality.
     * Can only be called from the protos' season minter(s).
     *
     *
     * @param to Address where newly minted card will be sent to
     * @param _protos Array of specified protos of new cards (caller must be valid factory in season)
     * @param _qualities Array of specified qualities of new cards (no validation)
     */
    function mintCards(
        address to,
        uint16[] calldata _protos,
        uint8[] calldata _qualities
    )
        external
        returns (uint)
    {
        require(
            _protos.length > 0,
            "Core: must be some protos"
        );

        require(
            _protos.length == _qualities.length,
            "Core: must be the same number of protos/qualities"
        );

        uint256 start = _batchMint(to, uint16(_protos.length));
        _validateAndSaveDetails(start, _protos, _qualities);

        emit CardsMinted(start, to, _protos, _qualities);

        return start;
    }

    /**
     * @dev Add a valid factory to a season. Factories are able to mint cards.
     * Factories cannot mind a card if the season is already tradeable.
     * Can only be called by owner().
     * 
     * @param _factory The address of the season's factory
     * @param _season The season to add the minter to
     */
    function addFactory(
        address _factory,
        uint256 _season
    )
        public
        onlyOwner
    {
        require(
            seasons.length >= _season,
            "Core: season must exist"
        );

        require(
            _season > 0,
            "Core: season must not be 0"
        );

        require(
            !factoryApproved[_factory][_season],
            "Core: this factory is already approved"
        );

        require(
            !seasonTradable[_season],
            "Core: season must not be tradable"
        );

        factoryApproved[_factory][_season] = true;
    }

    function approveForMythic(
        address _factory,
        uint16 _mythic
    )
        public
        onlyOwner
    {
        require(
            _mythic >= MYTHIC_THRESHOLD,
            "not a mythic"
        );

        require(
            !mythicApproved[_mythic][_factory],
            "Core: this factory is already approved for this mythic"
        );

        mythicApproved[_mythic][_factory] = true;
    }

    /**
     * @dev Enable trading for a certan mythic.
     * Can only be called by owner().
     *
     * @param _mythic The proto of the mythic to enable trading for.
     */
    function makeMythicTradable(
        uint16 _mythic
    )
        public
        onlyOwner
    {
        require(
            _mythic >= MYTHIC_THRESHOLD,
            "Core: not a mythic"
        );

        require(
            !mythicTradable[_mythic],
            "Core: must not be tradable already"
        );

        mythicTradable[_mythic] = true;
    }

    /**
     * @dev Unlock trading for an entire season of cards.
     * Can only be called by owner().
     * 
     * @param _season The season to enable trading for.
     */
    function unlockTrading(
        uint256 _season
    )
        public
        onlyOwner
    {
        require(
            _season > 0 && _season <= seasons.length,
            "Core: must be a current season"
        );

        require(
            !seasonTradable[_season],
            "Core: season must not be tradable"
        );

        seasonTradable[_season] = true;
    }

    /**
     * @dev Transfer cards to another address. Trading must be unlocked to transfer.
     * Can be called by the owner or an approved spender.
     * 
     * @param from The owner of the card
     * @param to The recipient of the card to send to
     * @param tokenId The id of the card you'd like to transfer
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    )
        public
    {
        require(
            isTradable(tokenId),
            "Core: not yet tradable"
        );

        super.transferFrom(from, to, tokenId);
    }

    /**
     * @dev Burn a card forever.
     * Can only be called IF the card is not tradeable and from owner().
     * 
     * @param _tokenId The id of the card to burn
     */
    function burn(uint256 _tokenId) public {
        require(
            isTradable(_tokenId),
            "Core: not yet tradable"
        );

        super.burn(_tokenId);
    }

    /**
     * @dev Burn multiple cards forever.
     * Can only be called IF the card is not tradeable and from owner().
     * 
     * @param tokenIDs The id sof the cards to burn
     */
    function burnAll(uint256[] memory tokenIDs) public {
        for (uint256 i = 0; i < tokenIDs.length; i++) {
            burn(tokenIDs[i]);
        }
    }

    /**
     * @dev Retrieve the proto and quality for a particular card represented by it's token id
     *
     * @param tokenId the id of the card you'd like to retrieve details for
     * @return proto The proto of the specified card
     * @return quality The quality of the specified card
     */
    function getDetails(
        uint256 tokenId
    )
        public
        view
        returns (uint16 proto, uint8 quality)
    {
        return (cardProtos[tokenId], cardQualities[tokenId]);
    }

    /**
     * @dev Check if the card is tradeable or not.
     * Once it's tradeable it cannot be burned, revoked or further minted.
     * 
     * @param _tokenId The id of the card to check against
     * @return A boolean of the status (true/false)
     */
    function isTradable(uint256 _tokenId) public view returns (bool) {
        uint16 proto = cardProtos[_tokenId];
        if (proto >= MYTHIC_THRESHOLD) {
            return mythicTradable[proto];
        }
        return seasonTradable[protoToSeason[proto]];
    }

    /**
     * @dev Create a new season with a range of protos.
     * Cannot overlap with other seasons or start at 0.
     * 
     * @param name The name of the season
     * @param low The starting proto range of the season
     * @param high The ending proto range of the season
     * @return An integer of the season's id
     */
    function startSeason(
        string memory name,
        uint16 low,
        uint16 high
    )
        public
        onlyOwner
        returns (uint)
    {
        require(
            low > 0,
            "Core: must not be zero proto"
        );

        require(
            high > low,
            "Core: must be a valid range"
        );

        require(
            seasons.length == 0 || low > seasons[seasons.length - 1].high,
            "Core: seasons cannot overlap"
        );

        require(
            MYTHIC_THRESHOLD > high,
            "Core: cannot go into mythic territory"
        );

        // seasons start at 1
        uint16 id = uint16(seasons.push(Season({ high: high, low: low })));

        uint256 cp;
        assembly { cp := protoToSeason_slot }
        StorageWrite.repeatUint16(cp, low, (high - low) + 1, id);

        emit SeasonStarted(id, name, low, high);

        return id;
    }

    /**
     * @dev Update the properties of a proto.
     * Can only be called if proto unlocked and by owner().
     *
     * @param _ids An array of the ids to update
     * @param _gods An array of the corresponding gods to update
     * @param _cardTypes An array of the corresponding card types to update
     * @param _rarities An array of the corresponding rarities to update
     * @param _manas An array of the corresponding manas to update
     * @param _attacks An array of the corresponding attacks to update
     * @param _healths An array of the corresponding healths to update
     * @param _tribes An array of the corresponding tribes to update    
     */
    function updateProtos(
        uint16[] memory _ids,
        uint8[] memory _gods,
        uint8[] memory _cardTypes,
        uint8[] memory _rarities,
        uint8[] memory _manas,
        uint8[] memory _attacks,
        uint8[] memory _healths,
        uint8[] memory _tribes
    ) public onlyOwner {
        for (uint256 i = 0; i < _ids.length; i++) {
            uint16 id = _ids[i];

            require(
                id > 0,
                "Core: proto must not be zero"
            );

            Proto memory proto = protos[id];
            require(
                !proto.locked,
                "Core: proto is locked"
            );

            protos[id] = Proto({
                locked: false,
                exists: true,
                god: _gods[i],
                cardType: _cardTypes[i],
                rarity: _rarities[i],
                mana: _manas[i],
                attack: _attacks[i],
                health: _healths[i],
                tribe: _tribes[i]
            });
            emit ProtoUpdated(id);
        }
    }

    /**
     * @dev Lock a proto forever.
     * Once this occurs the properties of a card cannot be changed.
     * Can only be called by owner().
     *
     * @param _ids The ids of the protos to lock
     */
    function lockProtos(uint16[] memory _ids) public onlyOwner {
        require(
            _ids.length > 0,
            "Cards: must lock some"
        );

        for (uint256 i = 0; i < _ids.length; i++) {
            uint16 id = _ids[i];
            require(
                id > 0,
                "Cards: proto must not be zero"
            );

            Proto storage proto = protos[id];

            require(
                !proto.locked,
                "Cards: proto is locked"
            );

            require(
                proto.exists,
                "Cards: proto must exist"
            );

            proto.locked = true;
            emit ProtoUpdated(id);
        }
    }

    /**
     * @dev Set/update the quality of a card.
     * Can only be called by the factory minter of a season.
     *
     * @param _tokenId The id of the token to update
     * @param _quality The quality of token to update
     */
    function setQuality(
        uint256 _tokenId,
        uint8 _quality
    )
        public
    {
        uint16 proto = cardProtos[_tokenId];
        // wont' be able to change mythic season
        uint256 season = protoToSeason[proto];

        require(
            factoryApproved[msg.sender][season],
            "Core: factory can't change quality of this season"
        );

        cardQualities[_tokenId] = _quality;
        emit QualityChanged(_tokenId, _quality, msg.sender);
    }

    function setPropertyManager(
        address _manager
    )
        public 
        onlyOwner 
    {
        propertyManager = _manager;
    }

    function setProperty(
        uint256 _id, 
        bytes32 _key, 
        bytes32 _value
    ) 
        public 
    {
        require(
            msg.sender == propertyManager,
            "Core: must be property manager"
        );

        _setProperty(_id, _key, _value);
    }

    function setClassProperty(
        bytes32 _key, 
        bytes32 _value
    ) 
        public 
    {
        require(
            msg.sender == propertyManager,
            "Core: must be property manager"
        );

        _setClassProperty(_key, _value);
    }

    function _validateAndSaveDetails(
        uint256 start,
        uint16[] memory _protos,
        uint8[] memory _qualities
    )
        internal
    {
        _validateProtos(_protos);

        uint256 cp;
        assembly { cp := cardProtos_slot }
        StorageWrite.uint16s(cp, start, _protos);
        uint256 cq;
        assembly { cq := cardQualities_slot }
        StorageWrite.uint8s(cq, start, _qualities);
    }

    function _validateProto(uint16 proto) internal {
        if (proto >= MYTHIC_THRESHOLD) {
            _checkCanCreateMythic(proto);
        } else {

            uint256 season = protoToSeason[proto];

            require(
                season != 0,
                "Core: must have season set"
            );

            require(
                factoryApproved[msg.sender][season],
                "Core: must be approved factory for this season"
            );
        }
    }

    function _validateProtos(
        uint16[] memory _protos
    )
        internal 
    {
        uint16 maxProto = 0;
        uint16 minProto = MAX_UINT16;
        for (uint256 i = 0; i < _protos.length; i++) {
            uint16 proto = _protos[i];
            if (proto >= MYTHIC_THRESHOLD) {
                _checkCanCreateMythic(proto);
            } else {
                if (proto > maxProto) {
                    maxProto = proto;
                }
                if (minProto > proto) {
                    minProto = proto;
                }
            }
        }

        if (maxProto != 0) {
            uint256 season = protoToSeason[maxProto];
            // cards must be from the same season
            require(
                season != 0,
                "Core: must have season set"
            );

            require(
                season == protoToSeason[minProto],
                "Core: can only create cards from the same season"
            );

            require(
                factoryApproved[msg.sender][season],
                "Core: must be approved factory for this season"
            );
        }
    }

    function _checkCanCreateMythic(uint16 proto) internal {
        require(
            mythicApproved[proto][msg.sender],
            "Core: not approved to create this mythic"
        );

        require(
            !mythicCreated[proto],
            "Core: mythic has already been created"
        );

        mythicCreated[proto] = true;
    }

}