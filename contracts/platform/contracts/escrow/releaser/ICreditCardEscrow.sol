pragma solidity 0.6.6;
pragma experimental ABIEncoderV2;

import "../IEscrow.sol";

abstract contract ICreditCardEscrow {

    /**
     * @dev Release all assets from an escrow account
     *
     * @param _id The ID of the escrow account to be released
     */
    function release(uint _id) public virtual;

    /**
     * @dev Request that a custodial escrow account's assets be marked for release
     *
     * @param _id The ID of the escrow account to be marked
     * @param _to The account to which to release the assets
     */
    function requestRelease(uint _id, address _to) public virtual;

    /**
     * @dev Cancel a release request
     *
     * @param _id The ID of the escrow account to be unmarked
     */
    function cancelRelease(uint _id) public virtual;

    /**
     * @dev Request that an escrow account's assets be marked for destruction
     *
     * @param _id The ID of the escrow account to be marked
     */
    function requestDestruction(uint _id) public virtual;

    /**
     * @dev Revoke a destruction request
     *
     * @param _id The ID of the escrow account to be unmarked
     */
    function cancelDestruction(uint _id) public virtual;

    /**
     * @dev Destroy all assets in an escrow account
     *
     * @param _id The ID of the escrow account to be destroyed
     */
    function destroy(uint _id) public virtual;

    /**
     * @dev Create a new escrow account
     *
     * @param _vault The vault details of this escrow
     * @param _callbackTo The address on which to callback
     * @param _callbackData The data to pass to the callback function
     * @param _duration The duration of the escrow
     */
    function escrow(
        IEscrow.Vault memory _vault,
        address _callbackTo,
        bytes memory _callbackData,
        uint256 _duration
    ) public virtual returns (uint);

    function getProtocol() public virtual view returns (IEscrow);
}