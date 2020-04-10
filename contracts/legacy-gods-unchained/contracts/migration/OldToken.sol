pragma solidity 0.6.6;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract OldToken is IERC721 {

    function getCard(uint id) public view returns (uint16, uint16);
    function totalSupply() public view returns (uint);

}