pragma solidity 0.5.11;

// solium-disable security/no-inline-assembly

import "@openzeppelin/contracts-v5/math/SafeMath.sol";

library StorageWrite {

    using SafeMath for uint256;

    function _getStorageArraySlot(uint _dest, uint _index) internal view returns (uint result) {
        uint slot = _getArraySlot(_dest, _index);
        assembly { result := sload(slot) }
    }

    function _getArraySlot(uint _dest, uint _index) internal pure returns (uint slot) {
        assembly {
            let free := mload(0x40)
            mstore(free, _dest)
            slot := add(keccak256(free, 32), _index)
        }
    }

    function _setArraySlot(uint _dest, uint _index, uint _value) internal {
        uint slot = _getArraySlot(_dest, _index);
        assembly { sstore(slot, _value) }
    }

    function _loadSlots(
        uint _slot,
        uint _offset,
        uint _perSlot,
        uint _length
    )
        internal
        view
        returns (uint[] memory slots)
    {
        uint slotCount = _slotCount(_offset, _perSlot, _length);
        slots = new uint[](slotCount);
        // top and tail the slots
        uint firstPos = _pos(_offset, _perSlot); // _offset.div(_perSlot);
        slots[0] = _getStorageArraySlot(_slot, firstPos);
        if (slotCount > 1) {
            uint lastPos = _pos(_offset.add(_length), _perSlot); // .div(_perSlot);
            slots[slotCount-1] = _getStorageArraySlot(_slot, lastPos);
        }
    }

    function _pos(uint items, uint perPage) internal pure returns (uint) {
        return items / perPage;
    }

    function _slotCount(uint _offset, uint _perSlot, uint _length) internal pure returns (uint) {
        uint start = _offset / _perSlot;
        uint end = (_offset + _length) / _perSlot;
        return (end - start) + 1;
    }

    function _saveSlots(uint _slot, uint _offset, uint _size, uint[] memory _slots) internal {
        uint offset = _offset.div((256/_size));
        for (uint i = 0; i < _slots.length; i++) {
            _setArraySlot(_slot, offset + i, _slots[i]);
        }
    }

    function _write(uint[] memory _slots, uint _offset, uint _size, uint _index, uint _value) internal pure {
        uint perSlot = 256 / _size;
        uint initialOffset = _offset % perSlot;
        uint slotPosition = (initialOffset + _index) / perSlot;
        uint withinSlot = ((_index + _offset) % perSlot) * _size;
        // evil bit shifting magic
        for (uint q = 0; q < _size; q += 8) {
            _slots[slotPosition] |= ((_value >> q) & 0xFF) << (withinSlot + q);
        }
    }

    function repeatUint16(uint _slot, uint _offset, uint _length, uint16 _item) internal {
        uint[] memory slots = _loadSlots(_slot, _offset, 16, _length);
        for (uint i = 0; i < _length; i++) {
            _write(slots, _offset, 16, i, _item);
        }
        _saveSlots(_slot, _offset, 16, slots);
    }

    function uint16s(uint _slot, uint _offset, uint16[] memory _items) internal {
        uint[] memory slots = _loadSlots(_slot, _offset, 16, _items.length);
        for (uint i = 0; i < _items.length; i++) {
            _write(slots, _offset, 16, i, _items[i]);
        }
        _saveSlots(_slot, _offset, 16, slots);
    }

    function uint8s(uint _slot, uint _offset, uint8[] memory _items) internal {
        uint[] memory slots = _loadSlots(_slot, _offset, 32, _items.length);
        for (uint i = 0; i < _items.length; i++) {
            _write(slots, _offset, 8, i, _items[i]);
        }
        _saveSlots(_slot, _offset, 8, slots);
    }

}