//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { Script } from "../lib/forge-std/src/Script.sol";
import { SubdomainManager } from "../src/SubdomainManager.sol";

contract DeployScript is Script {

  SubdomainManager subdomainmanager;
  uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

  function run() external {
    vm.startBroadcast(deployerPrivateKey);
    subdomainmanager = new SubdomainManager();
    vm.stopBroadcast();
  }
}