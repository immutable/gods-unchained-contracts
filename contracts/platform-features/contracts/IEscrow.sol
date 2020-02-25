pragma solidity ^0.5.11;

interface IEscrow {

    function assetOwner(
        uint256 _holdingId
    )
        public
        returns (address);

}