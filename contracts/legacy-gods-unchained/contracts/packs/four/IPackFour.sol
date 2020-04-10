pragma solidity 0.6.6;

contract IPackFour {

    struct Purchase {
        uint16 current;
        uint16 count;
        address user;
        uint randomness;
        uint64 commit;
    }

    function purchases(uint p) public view returns (
        uint16 current,
        uint16 count,
        address user,
        uint256 randomness,
        uint64 commit
    );

    function predictPacks(uint id) public view returns (uint16[] memory protos, uint16[] memory purities);

}