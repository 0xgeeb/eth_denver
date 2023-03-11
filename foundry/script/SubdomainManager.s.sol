// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/SubdomainManager.sol";

contract MyScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PK");
        vm.startBroadcast(deployerPrivateKey);

        SubdomainManager subdomainManager = new SubdomainManager(
            0x060f1546642E67c485D56248201feA2f9AB1803C
        );

        vm.stopBroadcast();
    }
}
