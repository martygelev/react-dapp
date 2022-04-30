//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Token {
    string public name = "MG Token";
    string public symbol = "MGT";
    uint public totalSupply = 1000000;
    address public owner;

    mapping(address => uint) balances;
    // like const balances = { address: uint }

    constructor() {
        //balance of the person who deploy this contract
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    function transfer(address to, uint amount) external {
        require(balances[msg.sender]>= amount, "Not enough tokens");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
    
    function balanceOf(address account) external view returns (uint) {
        return balances[account];
    }
}