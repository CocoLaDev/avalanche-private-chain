// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import "../src/ESGI_diplomes.sol";

contract DeployESGIDiplomes is Script {
    function run() external {
        // demarre la diffusion des transactions
        vm.startBroadcast();

        // le deployeur du contrat sera l'admin du contrat
        ESGI_diplomes nft = new ESGI_diplomes();
        console.log("ESGI_diplomes deployed at:", address(nft));

        vm.stopBroadcast();
    }
}
