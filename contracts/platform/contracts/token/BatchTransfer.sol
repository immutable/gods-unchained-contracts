pragma solidity 0.6.6;

interface BatchTransfer {

    function transferBatch(
        address from,
        address to,
        uint256 start,
        uint256 end
    ) external;

    function safeTransferBatch(
        address from,
        address to,
        uint256 start,
        uint256 end
    ) external;

}