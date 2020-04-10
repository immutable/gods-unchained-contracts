pragma solidity 0.6.6;
pragma experimental ABIEncoderV2;

import "../IEscrow.sol";
import "./TestERC20Token.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MaliciousChest {

    IEscrow escrow;
    TestERC20Token asset;

    constructor(IEscrow _escrow, TestERC20Token _asset) public {
        escrow = _escrow;
        asset = _asset;
    }

    function maliciousPush(uint256 count) public {

        IEscrow.Vault memory vault = _createVault(count);

        bytes memory data = abi.encodeWithSignature("pushAttackHook(uint256)", count);

        escrow.callbackEscrow(vault, address(this), data);
    }

    function maliciousPull(uint256 count) public {

        IEscrow.Vault memory vault = _createVault(count);

        bytes memory data = abi.encodeWithSignature("pullAttackHook(uint256)", count);

        escrow.callbackEscrow(vault, address(this), data);
    }

    function pushAttackHook(uint256 count) public {
        require(msg.sender == address(escrow), "must be the escrow contract");

        IEscrow.Vault memory vault = _createVault(count);

        bytes memory data = abi.encodeWithSignature("emptyHook()");

        escrow.callbackEscrow(vault, address(this), data);

        asset.mint(address(escrow), count);

    }

    function emptyHook() public view {
        require(msg.sender == address(escrow), "must be the escrow contract");
    }

    function pullAttackHook(uint256 count) public {
        require(msg.sender == address(escrow), "must be the escrow contract");

        IEscrow.Vault memory vault = _createVault(count);

        asset.mint(address(this), count);
        asset.approve(address(escrow), 2**256-1);

        escrow.escrow(vault, address(this));
    }

    function _createVault(uint256 count) internal view returns (IEscrow.Vault memory) {
        return IEscrow.Vault({
            player: msg.sender,
            releaser: msg.sender,
            asset: address(asset),
            balance: count,
            lowTokenID: 0,
            highTokenID: 0,
            tokenIDs: new uint256[](0)
        });
    }

}