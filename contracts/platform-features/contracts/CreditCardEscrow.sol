pragma solidity ^0.5.11;

import "./Vault.sol";
import "./IEscrow.sol";

contract CreditCardEscrow is IEscrow {

    struct Lock {
        address revoker;
        address purchaser;
        uint256 timeDelay;
        uint256 creationBlock;
    }

    Vault public vault;

    mapping (uint256 => Lock) public locks;

    uint256 public releasePeriod;

    function createNewEscrow(
        Lock _lock,
        Holding _holding
    )
        public
    {
        Lock memory newLock = _lock;
        uint256 holdingId = vault.createHolding(_holding);

        bytes32 id = keccak256(
            abi.encodePacked(
                newLock.revoker,
                newLock.purchaser,
                newLock.vaultHoldingId,
                newLock.creationBlock
            );
        )
        
        locks[holdingId] = newLock;
    }

    function releaseEscrow(
        address _to,
        uint256 _holdingId
    )
        public
    {
        Lock memory lock = locks[_holdingId];

        require(
            lock.creationBlock + releasePeriod >= block.number,
            "CreditCardEscrow: release period has not elapsed yet"
        );

        vault.releaseHolding(_to, lock.vaultHoldingId);
        delete locks[_holdingId];

    }

    function assetOwner(
        uint256 _holdingId
    )
        public
        returns (address)
    {
        return locks[_holdingId].purchaser;        
    }

}