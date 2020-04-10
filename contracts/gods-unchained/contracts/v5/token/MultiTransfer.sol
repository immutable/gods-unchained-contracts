pragma solidity 0.5.11;

import "@openzeppelin/contracts-v5/token/ERC721/IERC721.sol";

contract MultiTransfer is IERC721 {

    function transferBatch(
        address from,
        address to,
        uint256 start,
        uint256 end
    )
        public
    {
        for (uint i = start; i < end; i++) {
            transferFrom(from, to, i);
        }
    }

    function transferAllFrom(
        address from,
        address to,
        uint256[] memory tokenIDs
    )
        public
    {
        for (uint i = 0; i < tokenIDs.length; i++) {
            transferFrom(from, to, tokenIDs[i]);
        }
    }

    function safeTransferBatch(
        address from,
        address to,
        uint256 start,
        uint256 end
    )
        public
    {
        for (uint i = start; i < end; i++) {
            safeTransferFrom(from, to, i);
        }
    }

    function safeTransferAllFrom(
        address from,
        address to,
        uint256[] memory tokenIDs
    )
        public
    {
        for (uint i = 0; i < tokenIDs.length; i++) {
            safeTransferFrom(from, to, tokenIDs[i]);
        }
    }

}