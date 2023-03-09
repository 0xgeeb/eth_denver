//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol";
import "openzeppelin-contracts/contracts/token/ERC1155/IERC1155Receiver.sol";
import "openzeppelin-contracts/contracts/utils/introspection/IERC165.sol";
import "ens-contracts/wrapper/NameWrapper.sol";

contract SubdomainManager is IERC1155Receiver {
    NameWrapper nameWrapperContract;

    error NotOwner();

    constructor(address nameWrapperAddress) {
        nameWrapperContract = NameWrapper(nameWrapperAddress);
    }

    struct Domain {
        uint256 nameWrapperTokenId;
        address owner;
        bool inThisContract;
    }

    mapping(uint256 => Domain) public nameWrapperTokenIdToDomain;
    Domain[] public domainsArray;

    function depositENS(uint256 _tokenId) public {
        nameWrapperTokenIdToDomain[_tokenId] = Domain(
            _tokenId,
            msg.sender,
            true
        );
        internalId++;
        domainsArray.push(Domain(_tokenId, msg.sender, true));
        nameWrapperContract.safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId,
            1,
            ""
        );
    }

    function withdrawENS(uint256 _tokenId) public {
        if (nameWrapperTokenIdToDomain[_tokenId].owner != msg.sender)
            revert NotOwner();
        nameWrapperTokenIdToDomain[_tokenId].inThisContract = false;
        nameWrapperContract.safeTransferFrom(
            address(this),
            msg.sender,
            _tokenId,
            1,
            ""
        );
    }

    function mintSubdomain(bytes32 _parentNode, string memory _label) public {
        nameWrapperContract.setSubnodeOwner(
            _parentNode,
            _label,
            msg.sender,
            0,
            1716641088
        );
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

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return interfaceId == type(IERC165).interfaceId;
    }
}
