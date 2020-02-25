pragma solidity ^0.5.11;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./IEscrow.sol";

contract Vault {

    struct Holding {
        bool fungible;
        address asset;
        address escrow;
        uint256 amount;
        uint256 ids[];
        uint256 low;
        uint256 high;
    }

    mapping (uint256 => Holding) public holdings;

    uint256 public holdingsCount;

    function getAssetOwner(
        uint256 _holdingId
    ) 
        public 
        returns (address[])
    {
        IEscrow escrow = IEscrow(holdings[_holdingId].escrow);
        return escrow.assetOwner(_holdingId);
    }

    function createHolding(
        Holding _holding
    ) 
        public
        return (uint256[])
    {
        uint256 memory newHoldings = new uint256[](_holdings.length);

        Holding memory _newHolding = _holding;
        
        require(
            hasBalance(_newHolding) == true,
            "Vault: the user has not transferred assets to Vault"
        );

        _holdings[holdingsCount] = _newHolding;
        newHoldings[i] = holdingsCount;
        holdingsCount++;
        
        return _holding;
    }

    function releaseHolding(
        address _to,
        uint256 _holdingId
    ) 
        public 
    {
        transferAllAssets(_to, holdings[_holdingId);
        delete holdings[_holdingIds;
    }

    function hasBalance(
        Holding _holding
    )
        public
    {
        if (_holding.fungible) {
            uint256[] ids = _holding.ids || getRangeIds(
                _holding.low, 
                _holding.high
            );

            for (uint256 i = 0; i < ids.length; i++) {
                if (IERC721(_holding.asset).ownerOf(ids[i]) != address(this)) {
                    return false;
                }
            }

            return true;
        }

        return IERC20(_holding.asset).balanceOf(address(this)) == _holding.amount;
    }


    function transferAllAssets(
        address _to,
        Holding _holding
    )
        private
    {
        IEscrow escrow = IEscrow(_holding.escrow);

        if (_holding.fungible) {
            uint256[] ids = _holding.ids || getRangeIds(
                _holding.low, 
                _holding.high
            );

            IERC721(_holding.asset).safeBatchTransferFrom(
                address(this), 
                _to, 
                ids
            );

            return;
        }

        IERC20(_holding.asset).transferFrom(
            address(this), 
            _to,
            _holding.amount
        );
    }

    function getRangeIds(
        uint256 low,
        uint256 high
    ) 
        internal
        returns (uint256[] memory) 
    {
        uint256 length = high - low;
        uint256[] memory ids = new uint256[](length);

        for (uint256 i = 0; i <= length; i++) {
            ids[i] = low + i;
        }

        return ids;
    }

}