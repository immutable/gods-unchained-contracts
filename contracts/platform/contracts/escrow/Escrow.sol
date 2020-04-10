pragma solidity 0.6.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./IEscrow.sol";
import "../token/BatchTransfer.sol";
import "../token/ListTransfer.sol";

contract Escrow is IEscrow, Ownable {

    // Emitted when a new escrow vault is created
    event Escrowed(uint256 indexed id, Vault vault);
    // Emitted when the assets in an escrow vault are released
    event Released(uint256 indexed id, address to);

    using SafeMath for uint256;

    // Mutex on escrow vault creation
    bool public mutexLocked;
    // Whether batch transfers are enabled for this asset
    mapping(address => bool) public batchTransferEnabled;
    // Whether list transfers are enabled for this asset
    mapping(address => bool) public listTransferEnabled;
    // All Escrow vaults stored in this contract
    Vault[] public vaults;

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
    ) public override returns (uint256) {

        require(!mutexLocked, "IM:Escrow: mutex must be unlocked");
        require(_vault.asset != address(0), "IM:Escrow: must be a non-null asset");
        require(_vault.releaser != address(0), "IM:Escrow: must have a releaser");

        uint256 preBalance = 0;

        if (_vault.balance > 0) {
            preBalance = IERC20(_vault.asset).balanceOf(address(this));
        } else if (_vault.tokenIDs.length > 0) {
            require(!_areAnyInListEscrowed(_vault), "IM:Escrow: list must not be already escrowed");
        } else if (_vault.highTokenID.sub(_vault.lowTokenID) > 0) {
            require(!_areAnyInBatchEscrowed(_vault), "IM:Escrow: batch must not be already escrowed");
        } else {
            require(false, "IM:Escrow: invalid vault");
        }

        mutexLocked = true;
        // solium-disable-next-line security/no-low-level-calls
        _callbackTo.call(_callbackData);
        mutexLocked = false;

        if (_vault.balance > 0) {
            uint256 balanceDelta = IERC20(_vault.asset).balanceOf(address(this)).sub(preBalance);
            require(balanceDelta == _vault.balance, "IM:Escrow: must have transferred the tokens");
        } else if (_vault.tokenIDs.length > 0) {
            require(_areAllInListEscrowed(_vault), "IM:Escrow: list must now be owned by escrow contract");
        } else if (_vault.highTokenID.sub(_vault.lowTokenID) > 0) {
            require(_areAllInBatchEscrowed(_vault), "IM:Escrow: batch must not be owned by escrow contract");
        }

        return _escrow(_vault);
    }

    /**
     * @dev Create a new escrow vault
     *
     * @param _vault the escrow vault to be created
     * @param _from the address from which to pull the tokens
     */
    function escrow(Vault memory _vault, address _from) public override returns (uint256) {
        require(!mutexLocked, "IM:Escrow: mutex must be unlocked");
        require(_vault.asset != address(0), "IM:Escrow: must be a non-null asset");
        require(_vault.releaser != address(0), "IM:Escrow: must have a releaser");

        if (_vault.balance > 0) {
            IERC20(_vault.asset).transferFrom(_from, address(this), _vault.balance);
        } else if (_vault.tokenIDs.length > 0) {
            _transferList(_vault, _from, address(this));
        } else if (_vault.highTokenID.sub(_vault.lowTokenID) > 0) {
            _transferBatch(_vault, _from, address(this));
        } else {
            require(false, "IM:Escrow: invalid vault type");
        }

        return _escrow(_vault);
    }

    /**
     * @dev Release assets from an escrow account
     *
     * @param _id the id of the escrow vault
     * @param _to the address to which assets should be released
     */
    function release(uint256 _id, address _to) public override {
        Vault memory vault = vaults[_id];
        require(vault.releaser == msg.sender, "IM:Escrow: must be the releaser");

        if (vault.balance > 0) {
            IERC20(vault.asset).transfer(_to, vault.balance);
        } else if (vault.tokenIDs.length > 0) {
            _transferList(vault, address(this), _to);
        } else {
            _transferBatch(vault, address(this), _to);
        }

        emit Released(_id, _to);
        delete vaults[_id];
    }

    /**
     * @dev Set whether a particular contract has batch transfers available
     *
     * @param _asset the address of the asset contract
     * @param _enabled whether this asset can use batch transfers
     */
    function setBatchTransferEnabled(address _asset, bool _enabled) external onlyOwner {
        batchTransferEnabled[_asset] = _enabled;
    }

    /**
     * @dev Set whether a particular contract has list transfers available
     *
     * @param _asset the address of the asset contract
     * @param _enabled whether this asset can use list transfers
     */
    function setListTransferEnabled(address _asset, bool _enabled) external onlyOwner {
        listTransferEnabled[_asset] = _enabled;
    }

    function _escrow(Vault memory _vault) internal returns (uint256) {
        vaults.push(_vault);
        uint256 id = vaults.length - 1;
        emit Escrowed(id, _vault);
        return id;
    }

    function _transferList(Vault memory _vault, address _from, address _to) internal {
        if (listTransferEnabled[_vault.asset]) {
            ListTransfer(_vault.asset).transferAllFrom(_from, _to, _vault.tokenIDs);
        } else {
            for (uint i = 0; i < _vault.tokenIDs.length; i++) {
                IERC721(_vault.asset).transferFrom(_from, _to, _vault.tokenIDs[i]);
            }
        }
    }

    function _transferBatch(Vault memory _vault, address _from, address _to) internal {
        if (batchTransferEnabled[_vault.asset]) {
            BatchTransfer(_vault.asset).transferBatch(_from, _to, _vault.lowTokenID, _vault.highTokenID);
        } else {
            for (uint i = _vault.lowTokenID; i < _vault.highTokenID; i++) {
                IERC721(_vault.asset).transferFrom(_from, _to, i);
            }
        }
    }

    function _areAnyInListEscrowed(Vault memory _vault) internal returns (bool) {
        for (uint i = 0; i < _vault.tokenIDs.length; i++) {
            if (_existsAndEscrowed(address(_vault.asset), _vault.tokenIDs[i])) {
                return true;
            }
        }
        return false;
    }

    function _areAllInListEscrowed(Vault memory _vault) internal view returns (bool) {
        for (uint i = 0; i < _vault.tokenIDs.length; i++) {
            if (IERC721(_vault.asset).ownerOf(_vault.tokenIDs[i]) != address(this)) {
                return false;
            }
        }
        return true;
    }

    function _areAnyInBatchEscrowed(Vault memory _vault) internal returns (bool) {
        for (uint i = _vault.lowTokenID; i < _vault.highTokenID; i++) {
            if (_existsAndEscrowed(_vault.asset, i)) {
                return true;
            }
        }
        return false;
    }

    function _areAllInBatchEscrowed(Vault memory _vault) internal view returns (bool) {
        for (uint i = _vault.lowTokenID; i < _vault.highTokenID; i++) {
            if (IERC721(_vault.asset).ownerOf(i) != address(this)) {
                return false;
            }
        }
        return true;
    }

    function _existsAndEscrowed(address _asset, uint256 _tokenID) internal returns (bool) {
        bytes memory data = abi.encodeWithSignature("ownerOf(uint256)", _tokenID);
        // solium-disable-next-line security/no-low-level-calls
        (bool success, bytes memory response) = _asset.call(data);
        if (success) {
            address owner;
            // solium-disable-next-line security/no-inline-assembly
            assembly { owner := mload(add(response, 20)) }
            if (owner == address(this)) {
                return true;
            }
        }
        return false;
    }

}