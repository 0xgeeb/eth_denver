//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol";
import "openzeppelin-contracts/contracts/token/ERC1155/IERC1155Receiver.sol";
import "openzeppelin-contracts/contracts/utils/introspection/IERC165.sol";
import "ens-contracts/wrapper/NameWrapper.sol";

contract SubdomainManager is IERC1155Receiver {
    NameWrapper nameWrapperContract;
    uint256 public internalId = 0;

    error NotOwner();
    error NotAllowedToTransfer();
    error PriceNotMet();
    error TransferFailed();

    constructor(address nameWrapperAddress) {
        nameWrapperContract = NameWrapper(nameWrapperAddress);
    }

    struct DomainCheck {
        uint256 internalId;
        address owner;
        uint256 price;
    }

    struct DomainInfo {
        string name;
        uint256 nameWrapperTokenId;
        bool inThisContract;
        uint256 price;
    }

    mapping(uint256 => DomainCheck) public tokenIdToDomainCheck;
    DomainInfo[] public domainsInfoArray;

    function depositENS(
        uint256 _tokenId,
        string calldata _name,
        uint256 _price
    ) public {
        tokenIdToDomainCheck[_tokenId] = DomainCheck(
            internalId,
            msg.sender,
            _price
        );
        domainsInfoArray.push(DomainInfo(_name, _tokenId, true, _price));
        internalId++;
        nameWrapperContract.safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId,
            1,
            ""
        );
    }

    function withdrawENS(uint256 _tokenId) public {
        if (tokenIdToDomainCheck[_tokenId].owner != msg.sender)
            revert NotOwner();
        uint256 _internalId = tokenIdToDomainCheck[_tokenId].internalId;
        domainsInfoArray[_internalId].inThisContract = false;
        nameWrapperContract.safeTransferFrom(
            address(this),
            msg.sender,
            _tokenId,
            1,
            ""
        );
    }

    function mintSubdomain(
        uint256 _tokenId,
        bytes32 _parentNode,
        string memory _label
    ) public payable {
        DomainCheck memory check = tokenIdToDomainCheck[_tokenId];
        if (msg.value < check.price) {
            revert PriceNotMet();
        }
        bytes32 subdomainNode = nameWrapperContract.setSubnodeOwner(
            _parentNode,
            _label,
            msg.sender,
            0,
            1716641088
        );
        (bool success, ) = (check.owner).call{value: msg.value}("");
        if (!success) {
            revert TransferFailed();
        }
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
