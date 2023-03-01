//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../lib/forge-std/src/Test.sol";

contract RegisterENSTest is Test {
  
  address controller;
  address geeb;

  function setUp() public {
    controller = 0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5;
    geeb = 0xEa91085B4E4fbD4Ca5f336ee5d8bFb4eB7ab3D70;
    vm.deal(address(this), 10 ether);
  }

  function testCall() public {
    string memory label = "past";
    uint256 tokenId = uint256(keccak256(bytes(label)));
    console.log(tokenId);
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

  function testNextweeknext() public {
    (bool success, bytes memory data) = controller.call(
      abi.encodeWithSignature(
        "rentPrice(string,uint)", 
        "nextweeknext",
        94670856
      )
    );
    require(success, "call failed");
    console.logBytes(data);
  }

  function testMakeCommitment() public {
    (bool success, bytes memory data) = controller.call(
      abi.encodeWithSignature(
        "makeCommitment(string,address,bytes32)", 
        "nextweeknext", 
        address(this),
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
        0x098d51aa835c3de4170087219a9aff2f3f89aa150a12278ae3a05728e68d4605
      )
    );
    require(success, "call failed");
    console.log("good job :)");
  }

  function testRegisterWithConfig() public {
    (bool success, bytes memory data) = controller.call{value: 0.5 ether}(
      abi.encodeWithSignature(
        "registerWithConfig(string,address,uint,bytes32,address,address)",
        "nextweeknext",
        address(this),
        94670856,
        0x7375706572736563726574000000000000000000000000000000000000000000,
        0x0000000000000000000000000000000000000000,
        0x0000000000000000000000000000000000000000
      )
    );
    require(success, "call failed");
    console.log('yay :)');
  }

  function testEverything() public {
    console.log(block.timestamp);
    console.log('starting commit');
    (bool success, bytes memory data) = controller.call(
      abi.encodeWithSignature(
        "commit(bytes32)",
        0x098d51aa835c3de4170087219a9aff2f3f89aa150a12278ae3a05728e68d4605
      )
    );
    require(success, "commit failed");
    vm.warp(block.timestamp + 61);
    console.log(block.timestamp);
    console.log('starting register');
    (bool success1, bytes memory data1) = controller.call{value: 0.5 ether}(
      abi.encodeWithSignature(
        "registerWithConfig(string,address,uint,bytes32,address,address)",
        "nextweeknext",
        address(this),
        94670856,
        0x7375706572736563726574000000000000000000000000000000000000000000,
        0x0000000000000000000000000000000000000000,
        0x0000000000000000000000000000000000000000
      )
    );
    require(success1, "register failed");
  }
}