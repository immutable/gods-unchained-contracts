pragma solidity 0.5.11;

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract ERC721Escrow is Ownable {

    // Tracker for whether batch transfers are available for a particular asset
    mapping(address => bool) public singleTxEnabled;
    // Mutex which protects escrow vault creation
    bool public mutexLocked;

    /**
     * @dev Set whether a particular contract has batch transfers available
     *
     * @param asset the address of the asset contract
     * @param enabled whether this asset can use batch transfers
     */
    function setSingleTxEnabled(address asset, bool enabled) external onlyOwner {
        singleTxEnabled[asset] = enabled;
    }

    function _transfer(uint256 vaultID, address from, address to) internal;
    function _areAssetsEscrowed(uint256 vaultID) internal view returns (bool);

    function _escrow(uint256 vaultID, address from) internal {
        require(!mutexLocked, "mutex must be unlocked");
        _transfer(vaultID, from, address(this));
    }

    function _release(uint256 vaultID, address to) internal {
        _transfer(vaultID, address(this), to);
    }

    function _callbackEscrow(uint256 vaultID, address callbackTo, bytes memory callbackData) internal {
        require(!_areAnyAssetsEscrowed(vaultID), "must own none of the tokens");
        require(!mutexLocked, "mutex must be unlocked");
        mutexLocked = true;
        // solium-disable-next-line security/no-low-level-calls
        callbackTo.call(callbackData);
        require(_areAllAssetsEscrowed(vaultID), "must now own all tokens");
        mutexLocked = false;
    }

}