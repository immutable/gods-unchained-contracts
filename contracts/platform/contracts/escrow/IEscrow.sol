pragma solidity 0.6.6;
pragma experimental ABIEncoderV2;

abstract contract IEscrow {

    struct Vault {
        address player;
        address releaser;
        address asset;
        uint256 balance;
        uint256 lowTokenID;
        uint256 highTokenID;
        uint256[] tokenIDs;
    }

    /**
     * @dev Create an escrow account where assets will be pushed into escrow by another contract
     *
     * @param _vault the details of the new escrow vault
     * @param _callbackTo the address to use for the callback transaction
     * @param _callbackData the data to pass to the callback transaction
     */
    function callbackEscrow(
        Vault memory _vault,
        address _callbackTo,
        bytes memory _callbackData
    ) public virtual returns (uint256);

    /**
     * @dev Create a new escrow vault
     *
     * @param _vault the escrow vault to be created
     * @param _from the address from which to pull the tokens
     */
    function escrow(Vault memory _vault, address _from) public virtual returns (uint256);

    /**
     * @dev Release assets from an escrow account
     *
     * @param _id the id of the escrow vault
     * @param _to the address to which assets should be released
     */
    function release(uint256 _id, address _to) public virtual;

}