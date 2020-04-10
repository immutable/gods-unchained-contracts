pragma solidity ^0.6.6;



import "@0x/contracts-exchange-libs/contracts/src/LibOrder.sol";

import "../Wallet.sol";

import "./BaseModule.sol";
import "./MetaTxEnabled.sol";

// solium-disable max-line-length
// solium-disable security/no-inline-assembly

contract PurchaseModule is BaseModule, MetaTxEnabled {

    address public forwarderAddress;

    event AttemptedPurchases();

    constructor(address _forwarderAddress) public {
        forwarderAddress = _forwarderAddress;
    }

    /**
     * @dev Function to fill multiple orders at once via the wallet
     * @param _wallet is the wallet to execute the call against (and you're the owner of)
     * @param _orders is an array of 0x v2 orders to fill
     * @param _takerAssetFillAmounts is the price of the orders
     * @param _signatures is an array of signatures of the maker
     */
    function fillOrders(
        Wallet _wallet,
        LibOrder.Order[] memory _orders,
        uint256[] memory _takerAssetFillAmounts,
        bytes[] memory _signatures
    )
        public
        onlyWalletOwner(_wallet)
    {

        uint256 valueToSend = 0;
        for (uint256 i = 0; i < _takerAssetFillAmounts.length; i++) {
            valueToSend += _takerAssetFillAmounts[i];
        }

        _wallet.executeValue(
            forwarderAddress,
            abi.encodeWithSignature(
                "fillOrders((address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bytes,bytes)[],uint256[],bytes[])",
                _orders,
                _takerAssetFillAmounts,
                _signatures
            ),
            valueToSend
        );

        emit AttemptedPurchases();

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

    function validateSignatures(
        Wallet _wallet,
        bytes memory,
        uint,
        bytes memory _sigs,
        uint,
        uint,
        bytes32 _signHash
    ) 
        public 
        view 
        returns (bool)
    {
        address signer = recoverSigner(_signHash, _sigs, 0);
        return _wallet.owner() == signer;
    }

}