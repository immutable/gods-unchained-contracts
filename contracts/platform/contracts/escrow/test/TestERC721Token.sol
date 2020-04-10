pragma solidity 0.6.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestERC721Token is ERC721 {

    function mint(address to, uint256 count) public {
        uint x = supply;
        for (uint i = 0; i < count; i++) {
            _mint(to, x + i);
        }
        supply += count;
    }

    uint256 internal supply;

    function totalSupply() public view returns (uint256) {
        return supply;
    }

}