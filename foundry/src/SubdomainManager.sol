//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { IERC1155 } from "../lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol";
import { IERC1155Receiver } from "../lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155Receiver.sol";
import { IERC165 } from "../lib/openzeppelin-contracts/contracts/utils/introspection/IERC165.sol";

contract SubdomainManager is IERC1155Receiver {

  address namewrapper = 0x060f1546642E67c485D56248201feA2f9AB1803C;

  error NotOwner();

  mapping(uint256 => address) public ownerOf;
  mapping(uint256 => string) public nameOf;

  function getName(uint256 _tokenId) public view returns (string) {
    return nameOf[_tokenId];
  }
  
  function depositENS(uint256 _tokenId) public {
    ownerOf[_tokenId] = msg.sender;
    (bool success, bytes memory data) = namewrapper.call(
      abi.encodeWithSignature(
        "safeTransferFrom(address,address,uint256,uint256,bytes)",
        msg.sender,
        address(this),
        _tokenId,
        1,
        ""
      )
    );
    require(success, "deposit failed");
  }

  function withdrawENS(uint256 _tokenId) public {
    if(ownerOf[_tokenId] != msg.sender) revert NotOwner();
    (bool success, bytes memory data) = namewrapper.call(
      abi.encodeWithSignature(
        "safeTransferFrom(address,address,uint256,uint256,bytes)",
        address(this),
        msg.sender,
        _tokenId,
        1,
        ""
      )
    );
    require(success, "deposit failed");
  }


  function mintSubdomain(bytes32 _parentNode, string memory _label) public {
    (bool success, bytes memory data) = namewrapper.call(
      abi.encodeWithSignature(
        "setSubnodeOwner(bytes32,string,address,uint32,uint64)",
        _parentNode,
        _label,
        msg.sender,
        0,
        1716641088
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