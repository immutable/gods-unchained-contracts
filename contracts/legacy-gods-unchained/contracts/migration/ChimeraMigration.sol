pragma solidity 0.6.6;

import "@imtbl/gods-unchained/contracts/factories/S3PromoFactory.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

import "../cards/CardIntegrationTwo.sol";
import "../cards/CardBase.sol";

import "./BaseMigration.sol";

contract ChimeraMigration is BaseMigration, Ownable {

    // The old cards contract
    CardIntegrationTwo public oldCards;

    // The promo factory that ChimeraMigration can create new cards from
    S3PromoFactory public promoFactory;

    // The cut off point at which before cards will NOT be migrated.
    uint public cutOffLimit;

    // Keep track of migrated and claimed chimeras
    mapping (uint => bool) public hasMigrated;

    event Migrated(
        uint tokenId,
        address owner,
        uint16 proto,
        uint8 quality
    );

    constructor(
        address _oldCardsAddress,
        address _promoFactoryAddress,
        uint _cutOffLimit
    )
        public
    {
        oldCards = CardIntegrationTwo(_oldCardsAddress);
        promoFactory = S3PromoFactory(_promoFactoryAddress);
        cutOffLimit = _cutOffLimit;
    }

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
     * @dev Migrate Chimeras from the old Cards contract to the new one.
     */
    function migrate(
        uint _tokenId
    ) public returns (bool) {
        require(
            _tokenId >= cutOffLimit,
            "Chimera Migration: must be greater than or equal to the cut off"
        );

        address originalOwner = oldCards.ownerOf(_tokenId);

        require(
            hasMigrated[_tokenId] == false,
            "Chimera Migration: has already migrated Chimera"
        );

        (uint16 proto, uint16 purity) = oldCards.getCard(_tokenId);

        require(
            proto == 394,
            "Chimera Migration: must be a Chimera card"
        );

        uint16 convertedProto = convertProto(proto);
        uint8 convertedQuality = convertPurity(purity);

        uint16[] memory protos = new uint16[](1);
        protos[0] = convertedProto;

        uint8[] memory qualities = new uint8[](1);
        qualities[0] = convertedQuality;

        hasMigrated[_tokenId] = true;
        promoFactory.mint(originalOwner, protos, qualities);

        emit Migrated(_tokenId, originalOwner, convertedProto, convertedQuality);
    }
}