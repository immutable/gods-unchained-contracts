pragma solidity 0.6.6;

import "./CardPackFour.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract PresalePackFour is CardPackFour, Ownable {

    address payable public vault;

    Purchase[] public purchases;

    function getPurchaseCount() public view returns (uint) {
        return purchases.length;
    }

    struct Purchase {
        uint16 current;
        uint16 count;
        address user;
        uint randomness;
        uint64 commit;
    }

    event PacksPurchased(uint indexed id, address indexed user, uint16 count);
    event PackOpened(uint indexed id, uint16 startIndex, address indexed user, uint[] cardIDs);
    event RandomnessReceived(uint indexed id, address indexed user, uint16 count, uint randomness);
    event Recommit(uint indexed id);

    constructor(MigrationInterface _core, address payable _vault) public payable CardPackFour(_core) {
        vault = _vault;
    }

    function basePrice() public returns (uint);
    function getCardDetails(uint16 packIndex, uint8 cardIndex, uint result) public view returns (uint16 proto, uint16 purity);
    
    function packSize() public view returns (uint8) {
        return 5;
    }

    uint16 public perClaim = 15;

    function setPacksPerClaim(uint16 _perClaim) public onlyOwner {
        perClaim = _perClaim;
    }

    function packsPerClaim() public view returns (uint16) {
        return perClaim;
    }

    // start in bytes, length in bytes
    function extract(uint num, uint length, uint start) internal pure returns (uint) {
        return (((1 << (length * 8)) - 1) & (num >> ((start * 8) - 1)));
    }

    function purchaseFor(address user, uint16 packCount, address payable referrer) public payable {
        _purchase(user, packCount, referrer);
    }

    function purchase(uint16 packCount, address payable referrer) public payable {
        _purchase(msg.sender, packCount, referrer);
    }

    function _purchase(address user, uint16 packCount, address payable referrer) internal {
        require(packCount > 0);
        require(referrer != user);

        uint price = calculatePrice(basePrice(), packCount);

        require(msg.value >= price);

        Purchase memory p = Purchase({
            user: user,
            count: packCount,
            commit: uint64(block.number),
            randomness: 0,
            current: 0
        });

        uint id = purchases.push(p) - 1;

        emit PacksPurchased(id, user, packCount);

        if (referrer != address(0)) {
            uint commission = price / 10;
            referrer.transfer(commission);
            price -= commission;
            emit Referral(referrer, commission, user);
        }
        
        address(vault).transfer(price);
    }

    // can recommit
    // this gives you more chances
    // if no-one else sends the callback (should never happen)
    // still only get a random extra chance
    function recommit(uint id) public {

        Purchase storage p = purchases[id];

        require(p.randomness == 0);

        require(block.number >= p.commit + 256);

        p.commit = uint64(block.number);

        emit Recommit(id);
    }

    // can be called by anybody
    // can miners withhold blocks --> not really
    // giving up block reward for extra chance --> still really low
    function callback(uint id) public {

        Purchase storage p = purchases[id];

        require(p.randomness == 0);

        // must be within last 256 blocks, otherwise recommit
        require(block.number - 256 < p.commit);

        // can't callback on the original block
        require(uint64(block.number) != p.commit);

        bytes32 bhash = blockhash(p.commit);
        // will get the same on every block
        // only use properties which can't be altered by the user
        uint random = uint(keccak256(abi.encodePacked(bhash, p.user, address(this), p.count)));

        require(uint(bhash) != 0);

        p.randomness = random;

        emit RandomnessReceived(id, p.user, p.count, p.randomness);
    }

    function claim(uint id) public {
        
        Purchase storage p = purchases[id];

        require(canClaim);

        uint16 proto;
        uint16 purity;
        uint16 count = p.count;
        uint result = p.randomness;
        uint8 size = packSize();

        address user = p.user;
        uint16 current = p.current;

        require(result != 0); // have to wait for the callback
        // require(user == msg.sender); // not needed
        require(count > 0);

        uint[] memory ids = new uint[](size);

        uint16 end = current + packsPerClaim() > count ? count : current + packsPerClaim();

        require(end > current);

        for (uint16 i = current; i < end; i++) {
            for (uint8 j = 0; j < size; j++) {
                (proto, purity) = getCardDetails(i, j, result);
                ids[j] = migration.createCard(user, proto, purity);
            }
            emit PackOpened(id, (i * size), user, ids);
        }
        p.current += (end - current);
    }

    function predictPacks(uint id) external view returns (uint16[] memory protos, uint16[] memory purities) {

        Purchase memory p = purchases[id];

        uint16 proto;
        uint16 purity;
        uint16 count = p.count;
        uint result = p.randomness;
        uint8 size = packSize();

        purities = new uint16[](size * count);
        protos = new uint16[](size * count);

        for (uint16 i = 0; i < count; i++) {
            for (uint8 j = 0; j < size; j++) {
                (proto, purity) = getCardDetails(i, j, result);
                purities[(i * size) + j] = purity;
                protos[(i * size) + j] = proto;
            }
        }
        return (protos, purities);
    }

    function calculatePrice(uint base, uint16 packCount) public view returns (uint) {
        // roughly 6k blocks per day
        uint difference = block.number - creationBlock;
        uint numDays = difference / 6000;
        if (20 > numDays) {
            return (base - (((20 - numDays) * base) / 100)) * packCount;
        }
        return base * packCount;
    }

    function _getCommonPlusRarity(uint32 rand) internal pure returns (CardProto.Rarity) {
        if (rand == 999999) {
            return CardProto.Rarity.Mythic;
        } else if (rand >= 998345) {
            return CardProto.Rarity.Legendary;
        } else if (rand >= 986765) {
            return CardProto.Rarity.Epic;
        } else if (rand >= 924890) {
            return CardProto.Rarity.Rare;
        } else {
            return CardProto.Rarity.Common;
        }
    }

    function _getRarePlusRarity(uint32 rand) internal pure returns (CardProto.Rarity) {
        if (rand == 999999) {
            return CardProto.Rarity.Mythic;
        } else if (rand >= 981615) {
            return CardProto.Rarity.Legendary;
        } else if (rand >= 852940) {
            return CardProto.Rarity.Epic;
        } else {
            return CardProto.Rarity.Rare;
        }
    }

    function _getEpicPlusRarity(uint32 rand) internal pure returns (CardProto.Rarity) {
        if (rand == 999999) {
            return CardProto.Rarity.Mythic;
        } else if (rand >= 981615) {
            return CardProto.Rarity.Legendary;
        } else {
            return CardProto.Rarity.Epic;
        }
    }

    function _getLegendaryPlusRarity(uint32 rand) internal pure returns (CardProto.Rarity) {
        if (rand == 999999) {
            return CardProto.Rarity.Mythic;
        } else {
            return CardProto.Rarity.Legendary;
        }
    }

    bool public canClaim = true;

    function setCanClaim(bool _claim) public onlyOwner {
        canClaim = _claim;
    }

    function getComponents(
        uint16 i, uint8 j, uint rand
    ) internal pure returns (
        uint random, uint32 rarityRandom, uint16 purityOne, uint16 purityTwo, uint16 protoRandom
    ) {
        random = uint(keccak256(abi.encodePacked(i, rand, j)));
        rarityRandom = uint32(extract(random, 4, 10) % 1000000);
        purityOne = uint16(extract(random, 2, 4) % 1000);
        purityTwo = uint16(extract(random, 2, 6) % 1000);
        protoRandom = uint16(extract(random, 2, 8) % (2**16-1));
        return (random, rarityRandom, purityOne, purityTwo, protoRandom);
    }

    // function withdraw() public onlyOwner {
    //     owner.transfer(address(this).balance);
    // }

}