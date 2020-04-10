pragma solidity 0.6.6;
pragma experimental ABIEncoderV2;

import "./Pack.sol";

contract ShinyPack is Pack {

    constructor(
        IBeacon _beacon, ICards _cards, bytes32 _sku,
        IReferral _referral, ICreditCardEscrow _fiatEscrow,
        IPay _processor
    ) public Pack(
        _beacon, _cards, _sku, 0, 14999, _referral, _fiatEscrow, _processor
    ) {}

    function _getCardDetails(uint _index, uint _random) internal override view returns (uint16 proto, uint8 quality) {

        Components memory rc = _getComponents(_index, _random);
        Rarity rarity;

        if (_index % 5 == 0) {
            rarity = Rarity.Legendary;
            quality = _getShinyQuality(rc.quality);
        } else if (_index % 5 == 1) {
            rarity = _getRarePlusRarity(rc.rarity);
            quality = _getQuality(rc.quality);
        } else {
            rarity = _getCommonPlusRarity(rc.rarity);
            quality = _getQuality(rc.quality);
        }
        proto = _getRandomCard(rarity, rc.proto);
        return (proto, quality);
    }

}