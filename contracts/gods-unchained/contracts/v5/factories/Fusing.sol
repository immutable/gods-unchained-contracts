pragma solidity 0.5.11;

import "@openzeppelin/contracts-v5/ownership/Ownable.sol";

import "../interfaces/ICards.sol";

contract Fusing is Ownable {

    ICards public cards;

    mapping (address => bool) approvedMinters;

    event MinterAdded(
        address indexed minter
    );

    event MinterRemoved(
        address indexed minter
    );

    event CardFused(
        address owner,
        address tokenAddress,
        uint[] references,
        uint indexed tokenId,
        uint indexed lowestReference
    );

    /**
     * @dev Check if the address is a valid minter
     *
     * @param _minter is the address to check against
     */
    modifier onlyMinter(address _minter) {
        require(
            approvedMinters[_minter] == true,
            "Fusing: invalid minter"
        );
        _;
    }

    constructor(ICards _cards) public {
        cards = ICards(_cards);
    }

    /**
     * @dev Add a minter to the list of addresses that can fuse cards
     *
     * @param _minter is the address of the minter to add
     */
    function addMinter(
        address _minter
    )
        public
        onlyOwner
    {
        approvedMinters[_minter] = true;

        emit MinterAdded(_minter);
    }

    /**
     * @dev Remove a minter to the list of addresses that can fuse cards
     *
     * @param _minter is the address of the minter to remove
     */
    function removeMinter(
        address _minter
    )
        public
        onlyOwner
    {
        approvedMinters[_minter] = false;
        delete approvedMinters[_minter];

        emit MinterRemoved(_minter);
    }

    /**
     * @dev Combine multiple cards that live off-chain to be on-chain.
     *
     * @param _proto is the proto number for the new card
     * @param _quality is the output quality for the new card
     * @param _to is the address to give the new card to
     * @param _references is a list of card id references off-chain to be burned
     */
    function fuse(
        uint16 _proto,
        uint8 _quality,
        address _to,
        uint[] memory _references
    )
        public
        onlyMinter(msg.sender)
        returns (uint tokenId)
    {

        require(
            _to != address(0),
            "Fusing: to address cannot be 0"
        );

        require(
            _references.length > 0,
            "Fusing must have more than one reference"
        );

        tokenId = cards.mintCard(_to, _proto, _quality);

        uint lowestReference = _references[0];
        for (uint i = 0; i < _references.length; i++) {
            if (_references[i] < lowestReference) {
                lowestReference = _references[i];
            }
        }

        emit CardFused(_to, address(cards), _references, tokenId, lowestReference);
    }

    /**
     * @dev Check if there is an approved minter
     *
     * @param _minter The address of the minter to check against
     */
    function isApprovedMinter(
        address _minter
    )
        public
        returns
        (bool)
    {
        return approvedMinters[_minter];
    }

}