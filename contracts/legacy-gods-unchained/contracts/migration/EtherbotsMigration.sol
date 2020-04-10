pragma solidity 0.6.6;

import "@imtbl/gods-unchained/contracts/Cards.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

import "../cards/CardIntegrationTwo.sol";
import "../cards/CardBase.sol";

import "./BaseMigration.sol";

contract EtherbotsMigration is BaseMigration, Ownable {

    // The old cards contract
    CardIntegrationTwo public oldCards;

    // The new cards contract to migrate to
    Cards public newCards;

    // Keep track of migrated cards
    mapping (uint => bool) public hasMigrated;

    mapping(uint16 => bool) public etherbotProtos;

    constructor(
        address _oldCardsAddress,
        address _newCardsAddress,
        uint16[] memory _etherbotIds
    ) public {
        oldCards = CardIntegrationTwo(_oldCardsAddress);
        newCards = Cards(_newCardsAddress);

        for (uint16 i = 0; i < _etherbotIds.length; i++) {
            etherbotProtos[_etherbotIds[i]] = true;
        }
    }

    event Migrated(
        uint tokenId,
        address owner,
        uint16 proto,
        uint8 quality
    );

    function selfDestruct() public onlyOwner {
        selfdestruct(address(uint160(0x0)));
    }

    /**
     * @dev Migrate multiple tokens at once.
     *
     * @param _tokenIds List of tokens to migrate
     */
    function migrateMultiple(
        uint[] memory _tokenIds
    )
        public
    {
        for (uint i = 0; i < _tokenIds.length; i++) {
            migrate(_tokenIds[i]);
        }
    }

    /**
     * @dev Migrate Etherbot cards from the old Cards contract to the new one.
     *
     * @param _tokenId The id of the Etherbots card
     */
    function migrate(
        uint _tokenId
    ) public {

        address originalOwner = oldCards.ownerOf(_tokenId);

        require(
            hasMigrated[_tokenId] == false,
            "Etherbots Migration: has already migrated Etherbot"
        );

        (uint16 proto, uint16 purity) = oldCards.getCard(_tokenId);

        require(
            etherbotProtos[proto] == true,
            "Etherbots Migration: not an Etherbots proto"
        );

        uint16 convertedProto = convertProto(proto);
        uint8 convertedQuality = convertPurity(purity);

        hasMigrated[_tokenId] = true;

        newCards.mintCard(originalOwner, convertedProto, convertedQuality);

        emit Migrated(_tokenId, originalOwner, convertedProto, convertedQuality);
    }

    /**
     * @dev Migrate multiple Etherbot cards with the same owner
     */
    function migrateSameOwner(
        uint[] memory _tokenIds,
        address _owner
    ) public {

        if (_tokenIds.length == 1) {
            migrate(_tokenIds[0]);
            return;
        }

        uint16[] memory protos = new uint16[](_tokenIds.length);
        uint8[] memory qualities = new uint8[](_tokenIds.length);

        for (uint i = 0; i < _tokenIds.length; i++) {
            uint256 tokenId = _tokenIds[i];

            require(
                hasMigrated[tokenId] == false,
                "Etherbots Migration: has already migrated Etherbots"
            );

            require(
                oldCards.ownerOf(tokenId) == _owner,
                "Etherbots Migration: different owner found"
            );

            (uint16 proto, uint16 purity) = oldCards.getCard(tokenId);

            require(
                etherbotProtos[proto] == true,
                "Etherbots Migration: not an Etherbots proto"
            );

            protos[i] = convertProto(proto);
            qualities[i] = convertPurity(purity);

            hasMigrated[tokenId] = true;

            emit Migrated(
                tokenId,
                _owner,
                protos[i],
                qualities[i]
            );
        }

        newCards.mintCards(_owner, protos, qualities);
    }
}