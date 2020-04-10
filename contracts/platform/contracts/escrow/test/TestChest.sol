pragma solidity 0.6.6;
pragma experimental ABIEncoderV2;

import "../IEscrow.sol";
import "./TestERC20Token.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TestChest {

    IEscrow escrow;
    TestERC20Token asset;

    constructor(IEscrow _escrow, TestERC20Token _asset) public {
        escrow = _escrow;
        asset = _asset;
    }

    function purchase(uint256 count) public {

        IEscrow.Vault memory vault = IEscrow.Vault({
            player: msg.sender,
            releaser: msg.sender,
            asset: address(asset),
            balance: count,
            lowTokenID: 0,
            highTokenID: 0,
            tokenIDs: new uint256[](0)
        });

        bytes memory data = abi.encodeWithSignature("escrowHook(uint256)", count);

        escrow.callbackEscrow(vault, address(this), data);
    }

    function escrowHook(uint256 count) public {
        require(msg.sender == address(escrow), "must be the escrow contract");
        asset.mint(address(escrow), count);
    }

}