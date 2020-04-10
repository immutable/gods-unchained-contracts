pragma solidity 0.5.11;

contract InscribableToken {

    mapping(bytes32 => bytes32) public properties;

    event ClassPropertySet(
        bytes32 indexed key,
        bytes32 value
    );

    event TokenPropertySet(
        uint indexed id,
        bytes32 indexed key,
        bytes32 value
    );

    function _setProperty(
        uint _id,
        bytes32 _key,
        bytes32 _value
    )
        internal
    {
        properties[getTokenKey(_id, _key)] = _value;
        emit TokenPropertySet(_id, _key, _value);
    }

    function getProperty(
        uint _id,
        bytes32 _key
    )
        public
        view
        returns (bytes32 _value)
    {
        return properties[getTokenKey(_id, _key)];
    }

    function _setClassProperty(
        bytes32 _key,
        bytes32 _value
    )
        internal
    {
        emit ClassPropertySet(_key, _value);
        properties[getClassKey(_key)] = _value;
    }

    function getTokenKey(
        uint _tokenId,
        bytes32 _key
    )
        public
        pure
        returns (bytes32)
    {
        // one prefix to prevent collisions
        return keccak256(abi.encodePacked(uint(1), _tokenId, _key));
    }

    function getClassKey(bytes32 _key)
        public
        pure
        returns (bytes32)
    {
        // zero prefix to prevent collisions
        return keccak256(abi.encodePacked(uint(0), _key));
    }

    function getClassProperty(bytes32 _key)
        public
        view
        returns (bytes32)
    {
        return properties[getClassKey(_key)];
    }

}

