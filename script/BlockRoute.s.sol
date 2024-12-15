// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {BlockRoute} from "../src/BlockRoute.sol";

contract BlockRouteScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address qualityInspector = vm.envAddress("QUALITY_INSPECTOR");
        address disputeResolver = vm.envAddress("DISPUTE_RESOLVER");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy the contract
        BlockRoute blockRoute = new BlockRoute();
        console2.log("BlockRoute deployed to:", address(blockRoute));

        // Assign roles
        blockRoute.assignQualityInspectorRole(qualityInspector);
        console2.log("Quality Inspector role assigned to:", qualityInspector);

        blockRoute.assignDisputeResolverRole(disputeResolver);
        console2.log("Dispute Resolver role assigned to:", disputeResolver);

        vm.stopBroadcast();
    }
}

contract BlockRouteTestnetScript is Script {
    function setUp() public {}

    function run() public {
        // For testnet deployment, we'll use a test quality inspector and dispute resolver
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Generate deterministic addresses for testing
        address qualityInspector = vm.addr(uint256(keccak256("quality_inspector")));
        address disputeResolver = vm.addr(uint256(keccak256("dispute_resolver")));

        vm.startBroadcast(deployerPrivateKey);

        // Deploy the contract
        BlockRoute blockRoute = new BlockRoute();
        console2.log("BlockRoute deployed to:", address(blockRoute));

        // Assign roles
        blockRoute.assignQualityInspectorRole(qualityInspector);
        console2.log("Quality Inspector role assigned to:", qualityInspector);
        console2.log("Quality Inspector address:", qualityInspector);

        blockRoute.assignDisputeResolverRole(disputeResolver);
        console2.log("Dispute Resolver role assigned to:", disputeResolver);
        console2.log("Dispute Resolver address:", disputeResolver);

        vm.stopBroadcast();
    }
}
