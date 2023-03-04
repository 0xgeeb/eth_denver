//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../lib/forge-std/src/Test.sol";
import { IERC1155 } from "../lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol";
import { IERC1155Receiver } from "../lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155Receiver.sol";
import { IERC165 } from "../lib/openzeppelin-contracts/contracts/utils/introspection/IERC165.sol";
import { SubdomainManager } from "../src/SubdomainManager.sol";

contract SubdomainManagerTest is Test, IERC1155Receiver {

  SubdomainManager subdomainmanager;
  address geeb;
  address namewrapper;
  uint256 pastTokenId = 18861383517019070493726740039982108386862825210404015496306937247900719443968;
  bytes32 pastParentNode = 0x29b32a2d849c9eeb1a994890d62a3444dee3c70228508959a2c1bc6a7764f000;
  
  function setUp() public {
    subdomainmanager = new SubdomainManager();
    geeb = 0xEa91085B4E4fbD4Ca5f336ee5d8bFb4eB7ab3D70;
    namewrapper = 0x060f1546642E67c485D56248201feA2f9AB1803C;
  }

  function testDeposit() public {
    vm.prank(geeb);
    (bool transferSuccess, bytes memory data) = namewrapper.call(
      abi.encodeWithSignature(
        "safeTransferFrom(address,address,uint256,uint256,bytes)",
        geeb,
        address(this),
        pastTokenId,
        1,
        ""
      )
    );
    require(transferSuccess, "deposit failed");
    (bool success, bytes memory ownerData) = namewrapper.call(
      abi.encodeWithSignature(
        "ownerOf(uint256)",
        pastTokenId
      )
    );
    require(success, "deposit failed");
    console.logBytes(ownerData);
    (bool approvalSuccess, bytes memory approvalData) = namewrapper.call(
      abi.encodeWithSignature(
        "setApprovalForAll(address,bool)",
        address(subdomainmanager),
        true
      )
    );
    require(approvalSuccess, "deposit failed");
    subdomainmanager.depositENS(pastTokenId);
    (bool transfer2Success, bytes memory owner2Data) = namewrapper.call(
      abi.encodeWithSignature(
        "ownerOf(uint256)",
        pastTokenId
      )
    );
    require(transfer2Success, "deposit failed");
    console.logBytes(owner2Data);
  }

  function testWithdraw() public {
    testDeposit();
    subdomainmanager.withdrawENS(pastTokenId);
    (bool transfer2Success, bytes memory owner2Data) = namewrapper.call(
      abi.encodeWithSignature(
        "ownerOf(uint256)",
        pastTokenId
      )
    );
    require(transfer2Success, "deposit failed");
    console.logBytes(owner2Data);
  }

  function testMint() public {
    testDeposit();
    vm.prank(geeb);
    subdomainmanager.mintSubdomain(pastParentNode, "thefinaltest");
    (bool success, bytes memory data) = namewrapper.call(
      abi.encodeWithSignature(
        "getData(uint256)",
        pastTokenId
      )
    );
    require(success, "deposit failed");
  }

  function onERC1155Received(address, address, uint256, uint256, bytes memory) public virtual returns (bytes4) {
    return this.onERC1155Received.selector;
  }

  function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) public virtual returns (bytes4) {
    return this.onERC1155BatchReceived.selector;
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IERC165).interfaceId;
  }

}