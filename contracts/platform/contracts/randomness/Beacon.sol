pragma solidity 0.6.6;

import "./IBeacon.sol";

/**
 * @title Immutable Randomness Beacon
 * @notice A commit/reveal based randomness beacon. Use for low-security randomness.
 * @author Immutable
 */
contract Beacon is IBeacon {

    // Emitted after a commitment is made
    event Commit(uint256 indexed commitBlock);
    // Emitted after a block is 'recommitted'
    event Recommit(uint256 indexed original, uint256 indexed forwardTo);
    // Emitted once a successful callback is made to a particular block
    event Callback(uint256 indexed commitBlock, bytes32 seed);

    // Maps an old commit block to a newer commit block if a recommit is necessary
    mapping(uint256 => uint256) public forwards;
    // Saved block hashes are our source of randomness
    mapping(uint256 => bytes32) public blockHashes;
    // Tracks whether a commit has been requested for a specific block number
    mapping(uint256 => bool) public commitRequested;


    /**
     * @dev Request randomness derived from a particular block
     *
     * @param _offset the offset from the current block of the block which will be used in our random seed
     */
    function commit(uint256 _offset) public override returns (uint256) {
        require(block.number + _offset >= block.number, "IM:Beacon: must not overflow");
        uint256 commitBlock = block.number + _offset;
        if (!commitRequested[commitBlock]) {
            commitRequested[commitBlock] = true;
            emit Commit(commitBlock);
        }
        return commitBlock;
    }

    /**
     * @dev Record the randomness result for a particular block
     *
     * @param _commitBlock the block in question
     */
    function callback(uint256 _commitBlock) public override {

        require(commitRequested[_commitBlock], "IM:Beacon: must have requested a callback on this block");
        require(block.number > _commitBlock, "IM:Beacon: cannot callback on the same block");

        if (blockHashes[_commitBlock] == bytes32(0)) {
            bytes32 bhash = blockhash(_commitBlock);
            require(bhash != bytes32(0), "IM:Beacon: blockhash must not be zero");

            blockHashes[_commitBlock] = bhash;
            emit Callback(_commitBlock, bhash);
        }
    }

    /**
     * @dev Get the randomness result for a particular block
     *
     * @param _commitBlock the block in question
     */
    function randomness(uint256 _commitBlock) public override returns (bytes32) {
        uint256 currentBlock = getCurrentBlock(_commitBlock);
        if (blockHashes[currentBlock] == bytes32(0)) {
            callback(_commitBlock);
        }
        return blockHashes[currentBlock];
    }

    /**
     * @dev Forward all requests for this block's randomness to another block
     * as this block's hash is no longer discoverable
     *
     * @param _commitBlock the original commit block
     * @param _offset the offset from current block of the block which will be used in our random seed
     */
    function recommit(uint256 _commitBlock, uint256 _offset) public override {

        require(commitRequested[_commitBlock], "IM:Beacon: original block must have requested a commit");

        uint256 currentBlock = getCurrentBlock(_commitBlock);

        require(block.number > currentBlock + 256, "IM:Beacon: blockhash period must have expired");
        require(blockHashes[currentBlock] == bytes32(0), "IM:Beacon: randomness must not have been set");
        require(block.number + _offset >= block.number, "IM:Beacon: must not overflow");

        uint256 finalBlock = block.number + _offset;
        forwards[_commitBlock] = finalBlock;
        // actually commit to this new block
        commit(_offset);

        emit Recommit(_commitBlock, finalBlock);
    }

    /**
     * @dev Gets the block which is the latest 'head' of this commit chain
     *
     * @param _commitBlock the original commit block
     */
    function getCurrentBlock(uint256 _commitBlock) public view returns (uint256) {
        uint256 forwardTo = forwards[_commitBlock];
        return (forwardTo == 0 ? _commitBlock : forwardTo);
    }

}