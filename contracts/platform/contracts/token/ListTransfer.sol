pragma solidity 0.6.6;

interface ListTransfer {

    function safeTransferAllFrom(
        address from,
        address to,
        uint256[] calldata tokenIDs
    ) external;

    function transferAllFrom(
        address from,
        address to,
        uint256[] calldata tokenIDs
    ) external;

}