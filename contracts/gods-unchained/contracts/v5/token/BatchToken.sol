pragma solidity 0.5.11;

import "@openzeppelin/contracts-v5/math/SafeMath.sol";
import "@openzeppelin/contracts-v5/token/ERC721/ERC721Metadata.sol";

contract BatchToken is ERC721Metadata {

    using SafeMath for uint256;

    struct Batch {
        uint48 userID;
        uint16 size;
    }

    mapping(uint48 => address) public userIDToAddress;
    mapping(address => uint48) public addressToUserID;

    uint256 public batchSize;
    uint256 public nextBatch;
    uint256 public tokenCount;

    uint48[] internal ownerIDs;
    uint48[] internal approvedIDs;

    mapping(uint => Batch) public batches;

    uint48 internal userCount = 1;

    mapping(address => uint) internal _balances;

    uint256 internal constant MAX_LENGTH = uint(2**256 - 1);

    constructor(
        uint256 _batchSize,
        string memory name,
        string memory symbol
    )
        public
        ERC721Metadata(name, symbol)
    {
        batchSize = _batchSize;
        ownerIDs.length = MAX_LENGTH;
        approvedIDs.length = MAX_LENGTH;
    }

    function _getUserID(address to)
        internal
        returns (uint48)
    {
        if (to == address(0)) {
            return 0;
        }
        uint48 uID = addressToUserID[to];
        if (uID == 0) {
            require(
                userCount + 1 > userCount,
                "BT: must not overflow"
            );
            uID = userCount++;
            userIDToAddress[uID] = to;
            addressToUserID[to] = uID;
        }
        return uID;
    }

    function _batchMint(
        address to,
        uint16 size
    )
        internal
        returns (uint)
    {
        require(
            to != address(0),
            "BT: must not be null"
        );

        require(
            size > 0 && size <= batchSize,
            "BT: size must be within limits"
        );

        uint256 start = nextBatch;
        uint48 uID = _getUserID(to);
        batches[start] = Batch({
            userID: uID,
            size: size
        });
        uint256 end = start.add(size);
        for (uint256 i = start; i < end; i++) {
            emit Transfer(address(0), to, i);
        }
        nextBatch = nextBatch.add(batchSize);
        _balances[to] = _balances[to].add(size);
        tokenCount = tokenCount.add(size);
        return start;
    }

    function getBatchStart(uint256 tokenId) public view returns (uint) {
        return tokenId.div(batchSize).mul(batchSize);
    }

    function getBatch(uint256 index) public view returns (uint48 userID, uint16 size) {
        return (batches[index].userID, batches[index].size);
    }

    // Overridden ERC721 functions
    // @OZ: please stop making variables/functions private

    function ownerOf(uint256 tokenId)
        public
        view
        returns (address)
    {
        uint48 uID = ownerIDs[tokenId];
        if (uID == 0) {
            uint256 start = getBatchStart(tokenId);
            Batch memory b = batches[start];

            require(
                start + b.size > tokenId,
                "BT: token does not exist"
            );

            uID = b.userID;
            require(
                uID != 0,
                "BT: bad batch owner"
            );
        }
        return userIDToAddress[uID];
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    )
        public
    {
        require(
            ownerOf(tokenId) == from,
            "BT: transfer of token that is not own"
        );

        require(
            to != address(0),
            "BT: transfer to the zero address"
        );

        require(
            _isApprovedOrOwner(msg.sender, tokenId),
            "BT: caller is not owner nor approved"
        );

        _cancelApproval(tokenId);
        _balances[from] = _balances[from].sub(1);
        _balances[to] = _balances[to].add(1);
        ownerIDs[tokenId] = _getUserID(to);
        emit Transfer(from, to, tokenId);
    }

    function burn(uint256 tokenId) public {
        require(
            _isApprovedOrOwner(msg.sender, tokenId),
            "BT: caller is not owner nor approved"
        );

        _cancelApproval(tokenId);
        address owner = ownerOf(tokenId);
        _balances[owner] = _balances[owner].sub(1);
        ownerIDs[tokenId] = 0;
        tokenCount = tokenCount.sub(1);
        emit Transfer(owner, address(0), tokenId);
    }

    function _cancelApproval(uint256 tokenId) internal {
        if (approvedIDs[tokenId] != 0) {
            approvedIDs[tokenId] = 0;
        }
    }

    function approve(address to, uint256 tokenId) public {
        address owner = ownerOf(tokenId);

        require(
            to != owner,
            "BT: approval to current owner"
        );

        require(
            msg.sender == owner || isApprovedForAll(owner, msg.sender),
            "BT: approve caller is not owner nor approved for all"
        );

        approvedIDs[tokenId] = _getUserID(to);
        emit Approval(owner, to, tokenId);
    }

    function _exists(uint256 tokenId)
        internal
        view
        returns (bool)
    {
        return ownerOf(tokenId) != address(0);
    }

    function getApproved(uint256 tokenId)
        public
        view
        returns (address)
    {
        require(
            _exists(tokenId),
            "BT: approved query for nonexistent token"
        );

        return userIDToAddress[approvedIDs[tokenId]];
    }

    function totalSupply()
        public
        view
        returns (uint)
    {
        return tokenCount;
    }

    function balanceOf(address _owner)
        public
        view
        returns (uint256)
    {
        return _balances[_owner];
    }

}