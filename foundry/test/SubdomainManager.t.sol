//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../lib/forge-std/src/Test.sol";
import {IERC1155} from "../lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol";
import {IERC1155Receiver} from "../lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IERC165} from "../lib/openzeppelin-contracts/contracts/utils/introspection/IERC165.sol";
import {SubdomainManager} from "../src/SubdomainManager.sol";
import "ens-contracts/wrapper/NameWrapper.sol";
import "forge-std/console.sol";

contract SubdomainManagerTest is Test, IERC1155Receiver {
    SubdomainManager subdomainmanager;
    NameWrapper namewrapper;
    address geeb = 0xEa91085B4E4fbD4Ca5f336ee5d8bFb4eB7ab3D70;
    uint256 pastTokenId =
        18861383517019070493726740039982108386862825210404015496306937247900719443968;
    bytes32 pastParentNode =
        0x29b32a2d849c9eeb1a994890d62a3444dee3c70228508959a2c1bc6a7764f000;

    struct DomainCheck {
        uint256 internalId;
        address owner;
    }

    struct DomainInfo {
        string name;
        uint256 nameWrapperTokenId;
        bool inThisContract;
    }

    function setUp() public {
        subdomainmanager = new SubdomainManager(
            0x060f1546642E67c485D56248201feA2f9AB1803C
        );
        namewrapper = NameWrapper(0x060f1546642E67c485D56248201feA2f9AB1803C);
    }

    function testDeposit() public {
        address testAddy = namewrapper.ownerOf(pastTokenId);
        assertEq(testAddy, geeb);
        vm.prank(geeb);
        namewrapper.safeTransferFrom(geeb, address(this), pastTokenId, 1, "");
        namewrapper.ownerOf(pastTokenId);
        namewrapper.setApprovalForAll(address(subdomainmanager), true);
        subdomainmanager.depositENS(pastTokenId, "Hi");
        (uint256 internalId, address owner) = subdomainmanager
            .tokenIdToDomainCheck(pastTokenId);
        assertEq(internalId, 0);
        assertEq(owner, address(this));
        (
            string memory name,
            uint256 nameWrapperTokenId,
            bool inThisContract
        ) = subdomainmanager.domainsInfoArray(0);
        assertEq(name, "Hi");
        assertEq(nameWrapperTokenId, pastTokenId);
        assertEq(inThisContract, true);
        address testAddy2 = namewrapper.ownerOf(pastTokenId);
        assertEq(testAddy2, address(subdomainmanager));
    }

    function testWithdraw() public {
        testDeposit();
        subdomainmanager.withdrawENS(pastTokenId);
        (, , bool inThisContract) = subdomainmanager.domainsInfoArray(0);
        assertEq(inThisContract, false);
        address testAddy2 = namewrapper.ownerOf(pastTokenId);
        assertEq(testAddy2, address(this));
    }

    function testMint() public {
        testDeposit();
        vm.prank(geeb);
        subdomainmanager.mintSubdomain(pastParentNode, "thefinaltest");
        (address testAddy, , ) = namewrapper.getData(pastTokenId);
        assertEq(testAddy, address(subdomainmanager));
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }
}
