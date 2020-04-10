pragma solidity 0.5.11;

import "./GenericAsset.sol";

contract GenesisBoard is GenericAsset {

    mapping (uint256 => uint8) public levelToBoard;

    event GenesisBoardMinted(
        uint256 tokenId,
        address owner,
        uint8 level
    );

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
     * @dev Mint multiple boards
     *
     * @param _to The owners to receive the assets
     * @param _level The level of each board
     */
    function mintMultiple(
        address[] memory _to,
        uint8[] memory _level
    )
        public
        onlyMinters(msg.sender)
    {
        for (uint i = 0; i < _to.length; i++) {
            mint(_to[i], _level[i]);
        }
    }

    /**
     * @dev Mint a single board
     *
     * @param _to The owner to receive the asset
     * @param _level The level of the board to mint
     */
    function mint(
        address _to,
        uint8 _level
    )
        public
        onlyMinters(msg.sender)
        returns (uint256 tokenId)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(_to, newItemId);
        levelToBoard[newItemId] = _level;

        emit GenesisBoardMinted(newItemId, _to, _level);

        return newItemId;
    }

    /**
     * @dev Return the level of the board
     * 
     * @param _tokenId The token to query against
     */
    function getBoardLevel(
        uint256 _tokenId
    )
        public
        view
        returns (uint8)
    {
        return levelToBoard[_tokenId];
    }
}