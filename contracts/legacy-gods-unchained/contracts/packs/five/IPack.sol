pragma solidity 0.6.6;

import "./Pack.sol";

interface IPack {

    function openChest(Pack.Type packType, address user, uint count) external returns (uint);

}