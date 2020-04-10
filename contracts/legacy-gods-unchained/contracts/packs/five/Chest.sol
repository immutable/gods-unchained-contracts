pragma solidity 0.6.6;

import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./IProcessor.sol";
import "./IPack.sol";
import "./Pack.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract Chest is Ownable, ERC20Detailed, ERC20Burnable {

    using SafeMath for uint;

    uint256 public cap;
    IProcessor public processor;
    IPack public pack;
    Pack.Type public packType;
    uint public price;
    bool public tradeable;
    uint256 public sold;

    event ChestsPurchased(address user, uint count, address referrer, uint paymentID);

    constructor(
        IPack _pack, Pack.Type _pt,
        uint _price, IProcessor _processor, uint _cap,
        string memory name, string memory sym
    ) public ERC20Detailed(name, sym, 0) {
        price = _price;
        cap = _cap;
        pack = _pack;
        packType = _pt;
        processor = _processor;
    }

    function purchase(uint count, address referrer) public payable {
        return purchaseFor(msg.sender, count, referrer);
    }

    function purchaseFor(address user, uint count, address referrer) public payable {

        _mint(user, count);

        uint paymentID = processor.processPayment.value(msg.value)(msg.sender, price, count, referrer);
        emit ChestsPurchased(user, count, referrer, paymentID);
    }

    function open(uint value) public payable returns (uint) {
        return openFor(msg.sender, value);
    }

    // can only open uint16 at a time
    function openFor(address user, uint value) public payable returns (uint) {

        require(value > 0, "must open at least one chest");
        // can only be done by those with authority to burn
        // I would expect burnFrom to work in both cases but doesn't work with Zeppelin implementation
        if (user == msg.sender) {
            burn(value);
        } else {
            burnFrom(user, value);
        }

        require(address(pack) != address(0), "pack must be set");
   
        return pack.openChest(packType, user, value);
    }

    function makeTradeable() public onlyOwner {
        tradeable = true;
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(tradeable, "not currently tradeable");
        return super.transfer(to, value);
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(tradeable, "not currently tradeable");
        return super.transferFrom(from, to, value);
    }

    function _mint(address account, uint256 value) internal {
        sold = sold.add(value);
        if (cap > 0) {
            require(sold <= cap, "not enough space in cap");
        }
        super._mint(account, value);
    }

}