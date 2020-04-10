pragma solidity 0.6.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestERC20Token is ERC20 {

    function mint(address to, uint256 value) public {
        _mint(to, value);
    }

}