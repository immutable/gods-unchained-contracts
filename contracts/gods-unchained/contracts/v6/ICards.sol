pragma solidity 0.6.6;

interface ICards {

    function mintCards(address user, uint16[] calldata protos, uint8[] calldata qualities) external;
    function mintCards(address user, uint16 proto, uint8 quality) external;
    function nextBatch() external view returns (uint256);

}