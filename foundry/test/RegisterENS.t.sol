//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../lib/forge-std/src/Test.sol";

contract RegisterENSTest is Test {
  
  address controller;

  function setUp() public {
    controller = 0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5;
    vm.deal(address(this), 10 ether);
  }

  function testGeeb() public {
    (bool success, bytes memory data) = controller.call(
      abi.encodeWithSignature(
        "available(string)", 
        "geeb"
      )
    );
    require(success, "call failed");
    console.logBytes(data);
  }

  function testNextweek() public {
    (bool success, bytes memory data) = controller.call(
      abi.encodeWithSignature(
        "available(string)", 
        "nextweek"
      )
    );
    require(success, "call failed");
    console.logBytes(data);
  }

  function testMakeCommitment() public {
    (bool success, bytes memory data) = controller.call(
      abi.encodeWithSignature(
        "makeCommitment(string,address,bytes32)", 
        "nextweek", 
        0xEa91085B4E4fbD4Ca5f336ee5d8bFb4eB7ab3D70,
        0x7375706572736563726574000000000000000000000000000000000000000000
      )
    );
    require(success, "call failed");
    console.logBytes(data);
  }

  function testCommit() public {
    (bool success, bytes memory data) = controller.call(
      abi.encodeWithSignature(
        "commit(bytes32)",
        0x78dae8b240ad513c14079711e4938034747a192793227d5724b268b08d65108e
      )
    );
    require(success, "call failed");
    console.log("good job :)");
  }

  function testRegisterWithConfig() public {
    (bool success, bytes memory data) = controller.call(
      abi.encodeWithSignature(
        "registerWithConfig(string,address,uint,bytes32,address,address)",
        "nextweek",
        0xEa91085B4E4fbD4Ca5f336ee5d8bFb4eB7ab3D70,
        0x0000000000000000000000000000000000000000000000000000000001e18558,
        0x7375706572736563726574000000000000000000000000000000000000000000,
        address(0),
        address(0)
      )
    );
    require(success, "call failed");
    console.log('yay :)');
  }
}