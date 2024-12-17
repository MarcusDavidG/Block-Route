// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {BlockRoute} from "../src/BlockRoute.sol";
import {IBlockRoute} from "../src/interfaces/IBlockRoute.sol";

contract BlockRouteTest is Test {
    BlockRoute public blockRoute;
    address public admin;
    address public manufacturer;
    address public supplier;
    address public carrier;
    address public receiver;
    address public qualityInspector;
    address public disputeResolver;

    function setUp() public {
        // Setup accounts
        admin = makeAddr("admin");
        manufacturer = makeAddr("manufacturer");
        supplier = makeAddr("supplier");
        carrier = makeAddr("carrier");
        receiver = makeAddr("receiver");
        qualityInspector = makeAddr("qualityInspector");
        disputeResolver = makeAddr("disputeResolver");

        // Deploy contract
        vm.prank(admin);
        blockRoute = new BlockRoute();

        // Setup roles
        vm.startPrank(admin);
        blockRoute.assignQualityInspectorRole(qualityInspector);
        blockRoute.assignDisputeResolverRole(disputeResolver);
        vm.stopPrank();

        // Fund accounts
        vm.deal(manufacturer, 100 ether);
        vm.deal(supplier, 100 ether);
        vm.deal(carrier, 100 ether);
        vm.deal(receiver, 100 ether);
    }

    function test_CreateShipment() public {
        vm.startPrank(manufacturer);

        IBlockRoute.Location memory origin = IBlockRoute.Location({
            latitude: "40.7128",
            longitude: "-74.0060",
            name: "New York",
            timestamp: block.timestamp,
            updatedBy: manufacturer
        });

        IBlockRoute.Location memory destination = IBlockRoute.Location({
            latitude: "34.0522",
            longitude: "-118.2437",
            name: "Los Angeles",
            timestamp: block.timestamp,
            updatedBy: manufacturer
        });

        uint256 estimatedDeliveryDate = block.timestamp + 7 days;
        bytes32 documentsHash = keccak256("documents");

        uint256 shipmentId = blockRoute.createShipment(
            "Test Product",
            "Test Description",
            supplier,
            carrier,
            receiver,
            origin,
            destination,
            estimatedDeliveryDate,
            true, // isTemperatureSensitive
            false, // isHumiditySensitive
            documentsHash
        );

        assertEq(shipmentId, 1);
        assertEq(blockRoute.getTotalShipments(), 1);

        (
            uint256 id,
            string memory productName,
            string memory description,
            address mfr,
            address sup,
            address car,
            address rec,
            ,
            ,
            uint256 deliveryDate,
            IBlockRoute.ShipmentStatus status
        ) = blockRoute.getShipment(shipmentId);

        assertEq(id, 1);
        assertEq(productName, "Test Product");
        assertEq(description, "Test Description");
        assertEq(mfr, manufacturer);
        assertEq(sup, supplier);
        assertEq(car, carrier);
        assertEq(rec, receiver);
        assertEq(deliveryDate, estimatedDeliveryDate);
        assertEq(uint(status), uint(IBlockRoute.ShipmentStatus.Created));

        vm.stopPrank();
    }

    function test_QualityCheck() public {
        // First create a shipment
        test_CreateShipment();

        vm.startPrank(qualityInspector);
        
        uint256 checkId = blockRoute.performQualityCheck(
            1, // shipmentId
            true, // passed
            "Quality check passed",
            keccak256("quality_report")
        );

        assertEq(checkId, 1);

        (
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            IBlockRoute.ShipmentStatus status
        ) = blockRoute.getShipment(1);

        assertEq(uint(status), uint(IBlockRoute.ShipmentStatus.QualityChecked));

        vm.stopPrank();
    }

    function test_UpdateTemperatureAndHumidity() public {
        // First create a shipment and perform quality check
        test_QualityCheck();

        vm.startPrank(carrier);

        blockRoute.updateTemperatureAndHumidity(
            1, // shipmentId
            2500, // 25.00°C
            50 // 50% humidity
        );

        vm.stopPrank();
    }

    function test_RaiseAndResolveDispute() public {
        // First create a shipment and perform quality check
        test_QualityCheck();

        // Carrier raises dispute
        vm.startPrank(carrier);
        uint256 disputeId = blockRoute.raiseDispute(
            1, // shipmentId
            "Temperature control failure"
        );
        vm.stopPrank();

        assertEq(disputeId, 1);

        // Dispute resolver votes and resolves
        vm.startPrank(disputeResolver);
        blockRoute.voteOnDispute(disputeId, true);
        
        (
            address initiator,
            string memory reason,
            IBlockRoute.DisputeStatus status,
            ,
            ,
            uint256 votesCount
        ) = blockRoute.getDispute(disputeId);

        assertEq(initiator, carrier);
        assertEq(reason, "Temperature control failure");
        assertEq(uint(status), uint(IBlockRoute.DisputeStatus.UnderReview));
        assertEq(votesCount, 1);

        blockRoute.resolveDispute(
            disputeId,
            "Compensation provided to affected parties"
        );

        (
            ,
            ,
            IBlockRoute.DisputeStatus newStatus,
            ,
            string memory resolution,
            
        ) = blockRoute.getDispute(disputeId);

        assertEq(uint(newStatus), uint(IBlockRoute.DisputeStatus.Resolved));
        assertEq(resolution, "Compensation provided to affected parties");

        vm.stopPrank();
    }

    function testFail_UnauthorizedQualityCheck() public {
        // First create a shipment
        test_CreateShipment();

        // Try to perform quality check with unauthorized account
        vm.prank(manufacturer);
        blockRoute.performQualityCheck(
            1,
            true,
            "Quality check passed",
            keccak256("quality_report")
        );
    }

    function testFail_UnauthorizedDisputeResolution() public {
        // First create a shipment and raise dispute
        test_QualityCheck();
        
        vm.prank(carrier);
        uint256 disputeId = blockRoute.raiseDispute(
            1,
            "Temperature control failure"
        );

        // Try to resolve dispute with unauthorized account
        vm.prank(manufacturer);
        blockRoute.resolveDispute(
            disputeId,
            "Unauthorized resolution"
        );
    }

    function test_PauseAndUnpause() public {
        vm.startPrank(admin);
        
        blockRoute.pause();
        assertTrue(blockRoute.paused());
        
        blockRoute.unpause();
        assertFalse(blockRoute.paused());
        
        vm.stopPrank();
    }

    function testFail_CreateShipmentWhenPaused() public {
        // Pause the contract
        vm.prank(admin);
        blockRoute.pause();

        // Try to create shipment while paused
        test_CreateShipment();
    }
}
