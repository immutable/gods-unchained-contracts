pragma solidity 0.5.11;

import "@openzeppelin/contracts-v5/token/ERC20/IERC20.sol";

contract IEtherToken is IERC20 {
    function deposit() external payable;
    function withdraw(uint256 _amount) external;
    function withdrawTo(address _to, uint256 _amount) external;
}