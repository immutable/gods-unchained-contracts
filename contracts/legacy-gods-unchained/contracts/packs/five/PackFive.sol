pragma solidity 0.6.6;

import "./IProcessor.sol";
import "./Pack.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./RarityProvider.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "../../utils/SafeMath64.sol";

contract PackFive is Ownable, RarityProvider {

    using SafeMath for uint;
    using SafeMath64 for uint64;

    // fired after user purchases count packs, producing purchase with id
    event PacksPurchased(uint indexed paymentID, uint indexed id, Pack.Type indexed packType, address user, uint count, uint64 lockup);
    // fired after the callback transaction is successful, replaces RandomnessReceived
    event CallbackMade(uint indexed id, address indexed user, uint count, uint randomness);
    // fired after a recommit for a purchase
    event Recommit(uint indexed id, Pack.Type indexed packType, address indexed user, uint count, uint64 lockup);
    // fired after a card is activated, replaces PacksOpened
    event CardActivated(uint indexed purchaseID, uint cardIndex, uint indexed cardID, uint16 proto, uint16 purity);
    // fired after a chest is opened
    event ChestsOpened(uint indexed id, Pack.Type indexed packType, address indexed user, uint count, uint packCount);
    // fired after a purchase is recorded (either buying packs directly or indirectly)
    // callback sentinels should watch this event
    event PurchaseRecorded(uint indexed id, Pack.Type indexed packType, address indexed user, uint count, uint64 lockup);
    // fired after a purchase is revoked
    event PurchaseRevoked(uint indexed paymentID, address indexed revoker);
    // fired when a new pack is added
    event PackAdded(Pack.Type indexed packType, uint price, address chest);

    struct Purchase {
        uint count;
        uint randomness;
        uint[] state;
        Pack.Type packType;
        uint64 commit;
        uint64 lockup;
        bool revoked;
        address user;
    }

    struct PackInstance {
        uint price;
        uint chestSize;
        address token;
    }

    Purchase[] public purchases;
    IProcessor public processor;
    
    mapping(uint => PackInstance) public packs;
    mapping(address => bool) public canLockup;
    mapping(address => bool) public canRevoke;
    uint public commitLag = 0;
    // TODO: check this fits under mainnet gas limit
    uint16 public activationLimit = 40;
    // override switch in case of contract upgrade etc
    bool public canActivate = false;
    // maximum lockup length in blocks
    uint64 public maxLockup = 600000;

    constructor(ICards _cards, IProcessor _processor) public RarityProvider(_cards) {
        processor = _processor;
    }

    // == Admin Functions ==
    function setCanLockup(address user, bool can) public onlyOwner {
        canLockup[user] = can;
    }

    function setCanRevoke(address user, bool can) public onlyOwner {
        canRevoke[user] = can;
    }

    function setCommitLag(uint lag) public onlyOwner {
        require(commitLag < 100, "can't have a commit lag of >100 blocks");
        commitLag = lag;
    }

    function setActivationLimit(uint16 _limit) public onlyOwner {
        activationLimit = _limit;
    }

    function setMaxLockup(uint64 _max) public onlyOwner {
        maxLockup = _max;
    }

    function setPack(
        Pack.Type packType, uint price, address chest, uint chestSize
    ) public onlyOwner {

        PackInstance memory p = getPack(packType);
        require(p.token == address(0) && p.price == 0, "pack instance already set");

        require(price > 0, "price cannot be zero");
        require(price % 100 == 0, "price must be a multiple of 100 wei");
        require(address(processor) != address(0), "processor must be set");

        packs[uint(packType)] = PackInstance({
            token: chest,
            price: price,
            chestSize: chestSize
        });

        emit PackAdded(packType, price, chest);
    }

    function setActivate(bool can) public onlyOwner {
        canActivate = can;
    }

    function canActivatePurchase(uint id) public view returns (bool) {
        if (!canActivate) {
            return false;
        }
        Purchase memory p = purchases[id];
        if (p.lockup > 0) {
            if (inLockupPeriod(p)) {
                return false;
            }
            return !p.revoked;
        }
        return true;
    }

    function revoke(uint id) public {
        require(canRevoke[msg.sender], "sender not approved to revoke");
        Purchase storage p = purchases[id];
        require(!p.revoked, "must not be revoked already");
        require(p.lockup > 0, "must have lockup set");
        require(inLockupPeriod(p), "must be in lockup period");
        p.revoked = true;
        emit PurchaseRevoked(id, msg.sender);
    }

    // == User Functions ==

    function purchase(Pack.Type packType, uint16 count, address referrer) public payable returns (uint) {
        return purchaseFor(packType, msg.sender, count, referrer, 0);
    }

    function purchaseFor(Pack.Type packType, address user, uint16 count, address referrer, uint64 lockup) public payable returns (uint) {

        PackInstance memory pack = getPack(packType);

        uint purchaseID = _recordPurchase(packType, user, count, lockup);
    
        uint paymentID = processor.processPayment.value(msg.value)(msg.sender, pack.price, count, referrer);
        
        emit PacksPurchased(paymentID, purchaseID, packType, user, count, lockup);

        return purchaseID;
    }

    function activateMultiple(uint[] memory pIDs, uint[] memory cardIndices)
        public 
        returns (uint[] memory ids, uint16[] memory protos, uint16[] memory purities) 
    {
        uint len = pIDs.length;
        require(len > 0, "can't activate no cards");
        require(len <= activationLimit, "can't activate more than the activation limit");
        require(len == cardIndices.length, "must have the same length");
        ids = new uint[](len);
        protos = new uint16[](len);
        purities = new uint16[](len);
        for (uint i = 0; i < len; i++) {
            (ids[i], protos[i], purities[i]) = activate(pIDs[i], cardIndices[i]);
        }
        return (ids, protos, purities);
    }

    function activate(uint purchaseID, uint cardIndex) 
        public 
        returns (uint id, uint16 proto, uint16 purity) 
    {
        
        require(canActivatePurchase(purchaseID), "can't activate purchase");
        Purchase storage p = purchases[purchaseID];
        
        require(p.randomness != 0, "must have been a callback");
        uint cardCount = uint(p.count).mul(5);
        require(cardIndex < cardCount, "not a valid card index");
        uint bit = getStateBit(purchaseID, cardIndex);
        // can only activate each card once
        require(bit == 0, "card has already been activated");
        uint x = cardIndex.div(256);
        uint pos = cardIndex % 256;
        // mark the card as activated by flipping the relevant bit
        p.state[x] ^= uint(1) << pos;
        // create the card
        (proto, purity) = getCardDetails(p.packType, cardIndex, p.randomness);
        id = cards.createCard(p.user, proto, purity);
        emit CardActivated(purchaseID, cardIndex, id, proto, purity);
        return (id, proto, purity);
    }

    // 'open' a number of chest tokens
    function openChest(Pack.Type packType, address user, uint count) public returns (uint) {
        
        PackInstance memory pack = getPack(packType);

        require(msg.sender == pack.token, "can only open from the actual token packs");

        uint packCount = count.mul(pack.chestSize);
        
        uint id = _recordPurchase(packType, user, packCount, 0);

        emit ChestsOpened(id, packType, user, count, packCount);

        return id;
    }

    function _recordPurchase(Pack.Type packType, address user, uint count, uint64 lockup) internal returns (uint) {

        if (lockup != 0) {
            require(lockup < maxLockup, "lockup must be lower than maximum");
            require(canLockup[msg.sender], "only some people can lockup cards");
        }
        
        Purchase memory p = Purchase({
            user: user,
            count: count,
            commit: getCommitBlock(),
            randomness: 0,
            packType: packType,
            state: new uint256[](getStateSize(count)),
            lockup: lockup,
            revoked: false
        });

        uint id = purchases.push(p).sub(1);

        emit PurchaseRecorded(id, packType, user, count, lockup);
        return id;
    }

    // can be called by anybody
    function callback(uint id) public {

        Purchase storage p = purchases[id];

        require(p.randomness == 0, "randomness already set");

        require(uint64(block.number) > p.commit, "cannot callback before commit");

        // must be within last 256 blocks, otherwise recommit
        require(p.commit.add(uint64(256)) >= block.number, "must recommit");

        bytes32 bhash = blockhash(p.commit);

        require(uint(bhash) != 0, "blockhash must not be zero");

        // only use properties which can't be altered by the user
        // id and factory are determined before the reveal
        // 'last' determined param must be random
        p.randomness = uint(keccak256(abi.encodePacked(id, bhash, address(this))));

        emit CallbackMade(id, p.user, p.count, p.randomness);
    }

    // can recommit
    // this gives you more chances
    // if no-one else sends the callback (should never happen)
    // still only get a random extra chance
    function recommit(uint id) public {
        Purchase storage p = purchases[id];
        require(p.randomness == 0, "randomness already set");
        require(block.number >= p.commit.add(uint64(256)), "no need to recommit");
        p.commit = getCommitBlock();
        emit Recommit(id, p.packType, p.user, p.count, p.lockup);
    }

    // == View Functions ==

    function getCommitBlock() internal view returns (uint64) {
        return uint64(block.number.add(commitLag));
    }

    function getStateSize(uint count) public pure returns (uint) {
        return count.mul(5).sub(1).div(256).add(1);
    }

    function getPurchaseState(uint purchaseID) public view returns (uint[] memory state) {
        require(purchases.length > purchaseID, "invalid purchase id");
        Purchase memory p = purchases[purchaseID];
        return p.state;
    }
    
    function getPackDetails(Pack.Type packType) public view returns (address token, uint price) {
        PackInstance memory p = getPack(packType);
        return (p.token, p.price);
    }

    function getPack(Pack.Type packType) internal view returns (PackInstance memory) {
        return packs[uint(packType)];
    }

    function getPrice(Pack.Type packType) public view returns (uint) {
        PackInstance memory p = getPack(packType);
        require(p.price != 0, "price is not yet set");
        return p.price;
    }

    function getChestSize(Pack.Type packType) public view returns (uint) {
        PackInstance memory p = getPack(packType);
        require(p.chestSize != 0, "chest size is not yet set");
        return p.chestSize;
    }

    function isActivated(uint purchaseID, uint cardIndex) public view returns (bool) {
        return getStateBit(purchaseID, cardIndex) != 0;
    }

    function getStateBit(uint purchaseID, uint cardIndex) public view returns (uint) {
        Purchase memory p = purchases[purchaseID];
        uint x = cardIndex.div(256);
        uint slot = p.state[x];
        uint pos = cardIndex % 256;
        uint bit = (slot >> pos) & uint(1);
        return bit;
    }

    function predictPacks(uint id) external view returns (uint16[] memory protos, uint16[] memory purities) {

        Purchase memory p = purchases[id];

        require(p.randomness != 0, "randomness not yet set");

        uint result = p.randomness;

        uint cardCount = uint(p.count).mul(5);

        purities = new uint16[](cardCount);
        protos = new uint16[](cardCount);

        for (uint i = 0; i < cardCount; i++) {
            (protos[i], purities[i]) = getCardDetails(p.packType, i, result);
        }

        return (protos, purities);
    }
 
    function inLockupPeriod(Purchase memory p) internal view returns (bool) {
        return p.commit.add(p.lockup) >= block.number;
    }

}