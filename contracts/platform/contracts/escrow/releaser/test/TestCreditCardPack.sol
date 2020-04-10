pragma solidity 0.6.6;
pragma experimental ABIEncoderV2;

import "../ICreditCardEscrow.sol";
import "../../test/TestERC20Token.sol";
import "../../test/TestERC721Token.sol";

contract TestCreditCardPack {

    ICreditCardEscrow escrow;
    TestERC20Token erc20;
    TestERC721Token erc721;

    struct Purchase {
        uint256 count;
    }

    Purchase[] public purchases;

    constructor(ICreditCardEscrow _escrow, TestERC20Token _erc20, TestERC721Token _erc721) public {
        escrow = _escrow;
        erc20 = _erc20;
        erc721 = _erc721;
    }

    function purchaseERC20(address user, uint256 count, uint64 duration) public {

        IEscrow.Vault memory vault = IEscrow.Vault({
            player: user,
            releaser: address(escrow),
            asset: address(erc20),
            balance: count,
            lowTokenID: 0,
            highTokenID: 0,
            tokenIDs: new uint256[](0)
        });

        purchases.push(Purchase({ count: count }));

        uint256 id = purchases.length - 1;

        bytes memory data = abi.encodeWithSignature("erc20Hook(uint256)", id);

        escrow.escrow(vault, address(this), data, duration);
    }

    function purchaseERC721(address user, uint256 count, uint64 duration) public {

        // predict what the token IDs will be
        uint256 low = erc721.totalSupply();
        uint256 high = low + count;

        IEscrow.Vault memory vault = IEscrow.Vault({
            player: user,
            releaser: address(escrow),
            asset: address(erc721),
            balance: 0,
            lowTokenID: low,
            highTokenID: high,
            tokenIDs: new uint256[](0)
        });

        purchases.push(Purchase({
            count: count
        }));

        uint256 id = purchases.length - 1;

        bytes memory data = abi.encodeWithSignature("erc721Hook(uint256)", id);

        escrow.escrow(vault, address(this), data, duration);
    }

    function erc721Hook(uint256 purchaseID) public {
        address protocol = address(escrow.getProtocol());
        require(msg.sender == protocol, "must be the escrow contract");
        Purchase memory p = purchases[purchaseID];
        erc721.mint(protocol, p.count);
        delete purchases[purchaseID];
    }

    function erc20Hook(uint256 purchaseID) public {
        address protocol = address(escrow.getProtocol());
        require(msg.sender == protocol, "must be the escrow contract");
        Purchase memory p = purchases[purchaseID];
        erc20.mint(protocol, p.count);
        delete purchases[purchaseID];
    }

}