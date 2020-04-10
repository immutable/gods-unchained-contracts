pragma solidity 0.5.11;

import "./GenericAsset.sol";

contract HydraTrinket is GenericAsset {

    mapping (uint256 => uint8) public headsToHydra;

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
     * @dev Mint multiple hydras
     *
     * @param _to The owners to receive the assets
     * @param _heads The number of heads for each hydra
     */
    function mintMultiple(
        address[] memory _to,
        uint8[] memory _heads
    )
        public
        onlyMinters(msg.sender)
    {
        for (uint i = 0; i < _to.length; i++) {
            mint(_to[i], _heads[i]);
        }
    }

    /**
     * @dev Mint a single hydra
     *
     * @param _to The owner to receive the asset
     * @param _heads The number of heads for the hydra
     */
    function mint(
        address _to,
        uint8 _heads
    )
        public
        onlyMinters(msg.sender)
        returns (uint256 tokenId)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(_to, newItemId);
        headsToHydra[newItemId] = _heads;

        return newItemId;
    }

    /**
     * @dev Return the number of hydra heads
     * 
     * @param _tokenId The token to query against
     */
    function getHeadsOfHydra(
        uint256 _tokenId
    )
        public
        view
        returns (uint8)
    {
        return headsToHydra[_tokenId];
    }
}