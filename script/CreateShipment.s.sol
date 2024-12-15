// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {BlockRoute} from "../src/BlockRoute.sol";
import {IBlockRoute} from "../src/interfaces/IBlockRoute.sol";

contract CreateShipmentScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address contractAddress = 0xA4E64aabcae48a5f4C45d84dD2493B9Fb3f81D84;
        
        vm.startBroadcast(deployerPrivateKey);

        BlockRoute blockRoute = BlockRoute(contractAddress);

        // Create origin location
        IBlockRoute.Location memory origin = IBlockRoute.Location({
            latitude: "40.7128",
            longitude: "-74.0060",
            name: "New York",
            timestamp: block.timestamp,
            updatedBy: vm.addr(deployerPrivateKey)
        });

        // Create destination location
        IBlockRoute.Location memory destination = IBlockRoute.Location({
            latitude: "34.0522",
            longitude: "-118.2437",
            name: "Los Angeles",
            timestamp: block.timestamp,
            updatedBy: vm.addr(deployerPrivateKey)
        });

        // Create shipment
        uint256 shipmentId = blockRoute.createShipment(
            "Test Product",
            "Test Description",
            vm.addr(deployerPrivateKey), // supplier
            vm.addr(deployerPrivateKey), // carrier
            vm.addr(deployerPrivateKey), // receiver
            origin,
            destination,
            block.timestamp + 7 days,
            true, // isTemperatureSensitive
            false, // isHumiditySensitive
            keccak256("test-documents")
        );

        console2.log("Shipment created with ID:", shipmentId);

        vm.stopBroadcast();
    }
}
