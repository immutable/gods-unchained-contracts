pragma solidity ^0.5.11;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/drafts/Counters.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

import "../util/String.sol";

contract GenericAsset is ERC721Full, Ownable {

    bool public isTradable;

    Counters.Counter public _tokenIds;

    mapping (address => bool) public approvedMinters;

    string public constant baseURI = "https://api.immutable.com/asset/";

    constructor(
        string memory _name,
        string memory _ticker
    )
        ERC721Full(_name, _ticker) 
        public 
    {
        setMinterStatus(msg.sender, true);
    }

    event MinterStatusChanged(
        address minter,
        bool status
    );

    event TradabilityStatusChanged(
        bool status
    );

    modifier onlyMinters(address _minter) {
        require(
            approvedMinters[_minter] == true,
            "Generic Asset: not an approved minter"
        );
        _;
    }

    /**
     * @dev Set the status of a minter
     *
     * @param _minter Address of the minter
     * @param _status Boolean whether they can or cannot mint assets
     */
    function setMinterStatus(
        address _minter,
        bool _status
    ) 
        public
        onlyOwner
    {
        approvedMinters[_minter] = _status;

        emit MinterStatusChanged(_minter, _status);
    }

    /**
     * @dev Set trading to be enabled or disabled.
     *
     * @param _status Pass true or false to enable/disable trading
     */
    function setTradabilityStatus(
        bool _status
    )  
        public
        onlyOwner
    {
        isTradable = _status;

        emit TradabilityStatusChanged(_status);
    }

    /**
     * @dev Transfer cards to another address. Trading must be unlocked to transfer.
     * Can be called by the owner or an approved spender.
     * 
     * @param from The owner of the card
     * @param to The recipient of the card to send to
     * @param tokenId The id of the card you'd like to transfer
     */
    function _transferFrom(
        address from,
        address to,
        uint256 tokenId
    )
        internal

    {
        require(
            isTradable == true,
            "Generic Asset: not yet tradable"
        );

        super._transferFrom(from, to, tokenId);
    }

    /**
     * @dev Get the URI scheme of the token
     *
     * @param _tokenId is the ID of the token to get the URI for
     */
    function tokenURI(
        uint256 _tokenId
    ) 
        external 
        view 
        returns (string memory) 
    {
        return string(abi.encodePacked(
            baseURI,
            String.fromAddress(address(this)),
            "/",
            String.fromUint(_tokenId)
        ));
    }

    function totalSupply() 
        public 
        view 
        returns (uint256) 
    {
        return _tokenIds.current();
    }
}