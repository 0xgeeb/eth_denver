//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../lib/forge-std/src/Test.sol";

contract RegisterENSTest is Test {
  
  address controller;
  string name = "nextweek";
  bytes32 salt = 0x145fc90fc48fe3cead40b025a261dfb6006a96c43b65ab65d269777fb2d36b18;

  function setUp() public {
    controller = 0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5;
  }

  function testHello() public view {
    console.log("hello");
  }

  function testCall() public {
    (bool success, bytes memory data) = controller.call(abi.encodeWithSignature("available(string)", "asdfasdfddde"));
    require(success, "call failed");
    console.logBytes(data);
  }

  function testMakeCommitment() public {
    (bool success, bytes memory data) = controller.call(abi.encodeWithSignature("makeCommitment(string, address, bytes32)", name, address(this), salt));
    require(success, "call failed");
    console.logBytes(data);
  }
}