pragma solidity 0.6.6;
pragma experimental ABIEncoderV2;

abstract contract IPay {

    enum Currency {
        ETH,
        USDCents,
        Token
    }

    struct Order {
        address user;
        bytes32 sku;
        uint256 quantity;
        Currency currency;
        uint256 totalPrice;
    }

    struct Payment {
        Currency currency;
        uint256 value;
        uint256 nonce;
        bytes32 r;
        bytes32 s;
        uint8 v;
        uint256 escrowFor;
    }

    struct Limit {
        uint256 periodEnd;
        uint256 limit;
        uint256 processed;
    }

    function process(Order memory order, Payment memory payment) public virtual payable returns (uint);

}