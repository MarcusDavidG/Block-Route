// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IBlockRoute {
    // Enums
    enum ShipmentStatus { 
        Created,        // Initial state
        QualityChecked, // Passed quality inspection
        InTransit,      // Being transported
        Delayed,        // Experiencing delays
        Disputed,       // Under dispute
        ResolvingDispute, // Dispute being resolved
        Delivered,      // Successfully delivered
        Rejected,       // Failed quality check or rejected delivery
        Cancelled      // Cancelled shipment
    }

    enum Role {
        None,
        Manufacturer,   // Creates products
        Supplier,      // Supplies raw materials
        Distributor,   // Handles distribution
        QualityInspector, // Performs quality checks
        Carrier,       // Transports goods
        Receiver       // Receives shipments
    }

    enum DisputeStatus {
        None,
        Raised,
        UnderReview,
        Resolved,
        Rejected
    }

    // Structs
    struct Location {
        string latitude;
        string longitude;
        string name;
        uint256 timestamp;
        address updatedBy;
    }

    struct QualityCheck {
        uint256 checkId;
        uint256 timestamp;
        address inspector;
        bool passed;
        string notes;
        bytes32 documentHash; // IPFS hash of quality report
    }

    struct Dispute {
        uint256 disputeId;
        address initiator;
        string reason;
        DisputeStatus status;
        uint256 timestamp;
        string resolution;
        mapping(address => bool) votes;
        uint256 votesCount;
    }

    struct Shipment {
        uint256 id;
        string productName;
        string description;
        address manufacturer;
        address supplier;
        address carrier;
        address receiver;
        Location origin;
        Location destination;
        Location[] transitPoints;
        uint256 estimatedDeliveryDate;
        ShipmentStatus status;
        uint256 createdAt;
        uint256 updatedAt;
        uint256 temperature; // For temperature-sensitive goods
        uint256 humidity;    // For humidity-sensitive goods
        bytes32 documentsHash; // IPFS hash of associated documents
        bool isTemperatureSensitive;
        bool isHumiditySensitive;
        uint256 qualityCheckId;
        uint256 disputeId;
        uint256 insuranceId;
        mapping(address => Role) participantRoles;
    }

    // Events
    event ShipmentCreated(
        uint256 indexed shipmentId,
        string productName,
        address indexed manufacturer,
        uint256 estimatedDeliveryDate
    );

    event ShipmentStatusUpdated(
        uint256 indexed shipmentId,
        ShipmentStatus status,
        string notes
    );

    event QualityCheckPerformed(
        uint256 indexed shipmentId,
        uint256 indexed checkId,
        bool passed,
        address inspector
    );

    event DisputeRaised(
        uint256 indexed shipmentId,
        uint256 indexed disputeId,
        address initiator,
        string reason
    );

    event DisputeResolved(
        uint256 indexed disputeId,
        string resolution
    );

    event TemperatureAlert(
        uint256 indexed shipmentId,
        uint256 temperature,
        uint256 timestamp
    );

    event HumidityAlert(
        uint256 indexed shipmentId,
        uint256 humidity,
        uint256 timestamp
    );

    event RoleAssigned(
        address indexed account,
        Role role,
        uint256 indexed shipmentId
    );

    // Core Functions
    function createShipment(
        string memory productName,
        string memory description,
        address supplier,
        address carrier,
        address receiver,
        Location memory origin,
        Location memory destination,
        uint256 estimatedDeliveryDate,
        bool isTemperatureSensitive,
        bool isHumiditySensitive,
        bytes32 documentsHash
    ) external returns (uint256);

    function updateShipmentStatus(
        uint256 shipmentId,
        ShipmentStatus status,
        string memory notes
    ) external;

    // Quality Control Functions
    function performQualityCheck(
        uint256 shipmentId,
        bool passed,
        string memory notes,
        bytes32 documentHash
    ) external returns (uint256 checkId);

    function updateTemperatureAndHumidity(
        uint256 shipmentId,
        uint256 temperature,
        uint256 humidity
    ) external;

    // Dispute Resolution Functions
    function raiseDispute(
        uint256 shipmentId,
        string memory reason
    ) external returns (uint256 disputeId);

    function voteOnDispute(
        uint256 disputeId,
        bool support
    ) external;

    function resolveDispute(
        uint256 disputeId,
        string memory resolution
    ) external;

    // Role Management Functions
    function assignRole(
        uint256 shipmentId,
        address account,
        Role role
    ) external;

    function revokeRole(
        uint256 shipmentId,
        address account
    ) external;

    // View Functions
    function getShipment(uint256 shipmentId) external view returns (
        uint256 id,
        string memory productName,
        string memory description,
        address manufacturer,
        address supplier,
        address carrier,
        address receiver,
        Location memory origin,
        Location memory destination,
        uint256 estimatedDeliveryDate,
        ShipmentStatus status
    );
    
    function getShipmentQualityChecks(uint256 shipmentId) external view returns (QualityCheck[] memory);
    
    function getDispute(uint256 disputeId) external view returns (
        address initiator,
        string memory reason,
        DisputeStatus status,
        uint256 timestamp,
        string memory resolution,
        uint256 votesCount
    );
    
    function getParticipantRole(uint256 shipmentId, address participant) external view returns (Role);
    
    function getTransitHistory(uint256 shipmentId) external view returns (Location[] memory);
    
    function getTotalShipments() external view returns (uint256);
}
