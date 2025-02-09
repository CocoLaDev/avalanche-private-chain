// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import "../src/ESGI_diplomes.sol";

contract DeployESGIDiplomes is Script {
    function run() external {
        // Inicia la transmisión (broadcast) para enviar transacciones
        vm.startBroadcast();

        // Despliega el contrato sin argumentos. La cuenta que despliegue (msg.sender)
        // se convertirá en admin y tendrá los roles.
        ESGI_diplomes nft = new ESGI_diplomes();
        console.log("ESGI_diplomes deployed at:", address(nft));

        vm.stopBroadcast();
    }
}
