pragma solidity 0.5.11;

// solium-disable security/no-inline-assembly

pragma experimental ABIEncoderV2;

import "@0x/contracts-exchange-libs/contracts/src/LibFillResults.sol";
import "@0x/contracts-exchange-libs/contracts/src/LibOrder.sol";

import "@openzeppelin/contracts-v5/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-v5/token/ERC721/IERC721.sol";

import "./interfaces/IExchange.sol";
import "./interfaces/IEtherToken.sol";

/**
 * @title Immutable's 0x Forwarder Contract,
 * @notice Simplifies buying a card by wrapping, setting approvals and
 * filling multiple orders in one transaction. Failed orders do not throw.
 * @author Immutable
 */
contract Forwarder {

    address public ZERO_EX_EXCHANGE;
    address public ZERO_EX_TOKEN_PROXY;

    address payable public ETHER_TOKEN;

    constructor(
        address zeroExExchange,
        address zeroExProxy,
        address payable etherToken
    )
        public
    {
        ZERO_EX_EXCHANGE = zeroExExchange;
        ZERO_EX_TOKEN_PROXY = zeroExProxy;
        ETHER_TOKEN = etherToken;

        // Set allowance once rather than every call to save gas
        IEtherToken(ETHER_TOKEN).approve(ZERO_EX_TOKEN_PROXY, (2**256)-1);
    }

    /**
     * @dev Fill multiple 0x orders without having to wrap and approve wETH.
     * Failing to fill any orders will throw silently. This is done to ensure
     * two people filling multiple orders don't lose filling their other orders.
     *
     * @param orders The orders you'd like to fill
     * @param takerAssetFillAmounts The fill amounts you'd like to execute on
     * @param signatures The maker signatures for the specified orders
     */
    function fillOrders(
        LibOrder.Order[] memory orders,
        uint256[] memory takerAssetFillAmounts,
        bytes[] memory signatures
    )
        public
        payable
    {
        // Instantiate implementations of interfaces
        IEtherToken token = IEtherToken(ETHER_TOKEN);
        IExchange v2Exchange = IExchange(ZERO_EX_EXCHANGE);

        token.deposit.value(msg.value)();

        // We're filling each order individually because some might be filled by the time
        // the transaction settles on-chain
        for (uint i = 0; i < orders.length; i++) {
            LibFillResults.FillResults memory result = v2Exchange.fillOrderNoThrow(
                orders[i],
                takerAssetFillAmounts[i],
                signatures[i]
            );

            // Some 0x inline assembly magic to avoid passing tokenIDs as an argument
            (address cardToken, uint256 tokenId) = abi.decode(
                sliceDestructive(
                    orders[i].makerAssetData,
                    4,
                    orders[i].makerAssetData.length
                ),
                (address, uint256)
            );

            // If the result = requested amount, transfer to user's wallet
            if (result.takerAssetFilledAmount == takerAssetFillAmounts[i]) {
                IERC721(cardToken).transferFrom(address(this), msg.sender, tokenId);
            }
        }

        uint remainingBalance = token.balanceOf(address(this));
        token.withdraw(remainingBalance);

        // Transfer all remaining funds back to user
        address(msg.sender).transfer(remainingBalance);

        // Ensure the contract never holds any ETH
        require(
            address(this).balance == 0,
            "Forwarder: must have zero ETH at the end"
        );

    }

    function ()
        external
        payable
    {
        require(
            msg.sender == address(ETHER_TOKEN),
            "Forwarder: will not accept ETH from only ether token address"
        );
    }

    function sliceDestructive(
        bytes memory b,
        uint256 from,
        uint256 to
    )
        internal
        pure
        returns (bytes memory result)
    {
        // Create a new bytes structure around [from, to) in-place.
        assembly {
            result := add(b, from)
            mstore(result, sub(to, from))
        }
        return result;
    }

}