pragma solidity 0.6.6;
pragma experimental ABIEncoderV2;

import "../IEscrow.sol";
import "./TestERC721Token.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract TestBatchPack {

    struct Purchase {
        uint256 count;
    }

    Purchase[] public purchases;
    IEscrow escrow;
    TestERC721Token asset;

    constructor(IEscrow _escrow, TestERC721Token _asset) public {
        escrow = _escrow;
        asset = _asset;
    }

    function purchase(uint256 count) public {

        // predict what the token IDs will be
        uint256 low = asset.totalSupply();
        uint256 high = low + count;

        IEscrow.Vault memory vault = IEscrow.Vault({
            player: msg.sender,
            releaser: msg.sender,
            asset: address(asset),
            balance: 0,
            lowTokenID: low,
            highTokenID: high,
            tokenIDs: new uint256[](0)
        });

        purchases.push(Purchase({
            count: count
        }));

        uint256 id = purchases.length - 1;

        bytes memory data = abi.encodeWithSignature("escrowHook(uint256)", id);

        escrow.callbackEscrow(vault, address(this), data);
    }

    function escrowHook(uint256 purchaseID) public {
        require(msg.sender == address(escrow), "must be the escrow contract");
        Purchase memory p = purchases[purchaseID];
        asset.mint(address(escrow), p.count);
        delete purchases[purchaseID];
    }

}