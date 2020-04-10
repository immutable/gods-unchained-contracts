pragma solidity 0.5.11;

import "./GenericAsset.sol";

contract RaffleItem is GenericAsset {

    constructor(
        string memory _name,
        string memory _ticker
    )
        GenericAsset(_name, _ticker) 
        public 
    {
        setMinterStatus(msg.sender, true);
    }

    /**
     * @dev Mint multiple items
     *
     * @param _to The owners to receive the assets
     */
    function mintMultiple(
        address[] memory _to
    )
        public
        onlyMinters(msg.sender)
    {
        for (uint i = 0; i < _to.length; i++) {
            mint(_to[i]);
        }
    }

    /**
     * @dev Mint a single item
     *
     * @param _to The owner to receive the asset
     */
    function mint(
        address _to
    )
        public
        onlyMinters(msg.sender)
        returns (uint256 tokenId)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(_to, newItemId);

        return newItemId;
    }
}