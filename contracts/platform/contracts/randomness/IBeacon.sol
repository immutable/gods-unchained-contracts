pragma solidity 0.6.6;

abstract contract IBeacon {

    function commit(uint256 _offset) public virtual returns (uint256);
    function recommit(uint256 _commitBlock, uint256 _offset) public virtual;
    function randomness(uint256 _commitBlock) public virtual returns (bytes32);
    function callback(uint256 _commitBlock) public virtual;

}