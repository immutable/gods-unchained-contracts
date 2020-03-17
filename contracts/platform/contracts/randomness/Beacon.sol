pragma solidity 0.5.11;

import "./IBeacon.sol";

/**
 * @title Immutable's Randomness Beacon
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
    bool[] public commitRequested;

    constructor() public {
        commitRequested.length = 2**256-1;
    }

    /**
     * @dev Request randomness derived from a particular block
     *
     * @param offset the offset from the current block of the block which will be used in our random seed
     */
    function commit(uint256 offset) public {
        require(block.number + offset >= block.number, "must not overflow");
        uint256 commitBlock = block.number + offset;
        if (!commitRequested[commitBlock]) {
            commitRequested[commitBlock] = true;
            emit Commit(commitBlock);
        }
    }

    /**
     * @dev Record the randomness result for a particular block
     *
     * @param commitBlock the block in question
     */
    function callback(uint256 commitBlock) public {

        require(commitRequested[commitBlock], "must have requested a callback on this block");
        require(block.number > commitBlock, "cannot callback on the same block");
        require(blockHashes[commitBlock] == bytes32(0), "callback already set");

        bytes32 bhash = blockhash(commitBlock);
        require(bhash != bytes32(0), "blockhash");

        blockHashes[commitBlock] = bhash;
        emit Callback(commitBlock, bhash);
    }

    /**
     * @dev Get the randomness result for a particular block
     *
     * @param commitBlock the block in question
     */
    function randomness(uint64 commitBlock) public view returns (bytes32) {
        uint256 currentBlock = getCurrentBlock(commitBlock);
        require(blockHashes[currentBlock] != bytes32(0), "randomness has not been set for this block");
        return blockHashes[currentBlock];
    }

    /**
     * @dev Forward all requests for this block's randomness to another block
     * as this block's hash is no longer discoverable
     *
     * @param commitBlock the original commit block
     * @param offset the offset from current block of the block which will be used in our random seed
     */
    function recommit(uint256 commitBlock, uint256 offset) public {

        require(commitRequested[commitBlock], "original block must have requested a commit");

        uint256 currentBlock = getCurrentBlock(commitBlock);

        require(block.number > currentBlock + 256, "blockhash period must have expired");
        require(blockHashes[currentBlock] == bytes32(0), "randomness must not have been set");
        require(block.number + offset >= block.number, "must not overflow");

        forwards[commitBlock] = block.number + offset;

        emit Recommit(commitBlock, block.number + offset);
    }

    /**
     * @dev Gets the block which is the latest 'head' of this commit chain
     *
     * @param commitBlock the original commit block
     */
    function getCurrentBlock(uint256 commitBlock) public view returns (uint256) {
        uint256 forwardTo = forwards[commitBlock];
        return (forwardTo == 0 ? commitBlock : forwardTo);
    }

}