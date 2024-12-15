// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IBlockRoute.sol";
import "./libraries/BlockRouteLib.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BlockRoute is IBlockRoute, AccessControl, Pausable, ReentrancyGuard {
    using BlockRouteLib for *;

    // Role identifiers
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant QUALITY_INSPECTOR_ROLE = keccak256("QUALITY_INSPECTOR_ROLE");
    bytes32 public constant DISPUTE_RESOLVER_ROLE = keccak256("DISPUTE_RESOLVER_ROLE");

    // State variables
    uint256 private _shipmentCounter;
    uint256 private _qualityCheckCounter;
    uint256 private _disputeCounter;

    // Mappings
    mapping(uint256 => Shipment) private _shipments;
    mapping(uint256 => QualityCheck[]) private _qualityChecks;
    mapping(uint256 => Dispute) private _disputes;
    mapping(uint256 => Location[]) private _transitPoints;
    mapping(address => uint256[]) private _userShipments;
    mapping(uint256 => mapping(address => bool)) private _disputeVotes;
    mapping(uint256 => BlockRouteLib.QualityMetrics) private _qualityMetrics;

    // Constructor
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // Modifiers
    modifier onlyShipmentParticipant(uint256 shipmentId) {
        require(
            _shipments[shipmentId].participantRoles[msg.sender] != Role.None,
            "Not a shipment participant"
        );
        _;
    }

    modifier validShipment(uint256 shipmentId) {
        require(shipmentId > 0 && shipmentId <= _shipmentCounter, "Invalid shipment ID");
        _;
    }

    // Implementation of core functions
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
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(bytes(productName).length > 0, "Product name required");
        require(supplier != address(0) && carrier != address(0) && receiver != address(0), "Invalid addresses");
        require(estimatedDeliveryDate > block.timestamp, "Invalid delivery date");

        _shipmentCounter++;
        uint256 shipmentId = _shipmentCounter;

        Shipment storage shipment = _shipments[shipmentId];
        shipment.id = shipmentId;
        shipment.productName = productName;
        shipment.description = description;
        shipment.manufacturer = msg.sender;
        shipment.supplier = supplier;
        shipment.carrier = carrier;
        shipment.receiver = receiver;
        shipment.origin = origin;
        shipment.destination = destination;
        shipment.estimatedDeliveryDate = estimatedDeliveryDate;
        shipment.status = ShipmentStatus.Created;
        shipment.createdAt = block.timestamp;
        shipment.updatedAt = block.timestamp;
        shipment.isTemperatureSensitive = isTemperatureSensitive;
        shipment.isHumiditySensitive = isHumiditySensitive;
        shipment.documentsHash = documentsHash;

        // Assign roles
        shipment.participantRoles[msg.sender] = Role.Manufacturer;
        shipment.participantRoles[supplier] = Role.Supplier;
        shipment.participantRoles[carrier] = Role.Carrier;
        shipment.participantRoles[receiver] = Role.Receiver;

        // Add to user's shipments
        _userShipments[msg.sender].push(shipmentId);
        _userShipments[supplier].push(shipmentId);
        _userShipments[carrier].push(shipmentId);
        _userShipments[receiver].push(shipmentId);

        emit ShipmentCreated(shipmentId, productName, msg.sender, estimatedDeliveryDate);
        emit RoleAssigned(msg.sender, Role.Manufacturer, shipmentId);
        emit RoleAssigned(supplier, Role.Supplier, shipmentId);
        emit RoleAssigned(carrier, Role.Carrier, shipmentId);
        emit RoleAssigned(receiver, Role.Receiver, shipmentId);

        return shipmentId;
    }

    function updateShipmentStatus(
        uint256 shipmentId,
        ShipmentStatus status,
        string memory notes
    ) external whenNotPaused nonReentrant validShipment(shipmentId) onlyShipmentParticipant(shipmentId) {
        Shipment storage shipment = _shipments[shipmentId];
        require(BlockRouteLib.validateStatusTransition(shipment.status, status), "Invalid status transition");

        shipment.status = status;
        shipment.updatedAt = block.timestamp;

        emit ShipmentStatusUpdated(shipmentId, status, notes);
    }

    function performQualityCheck(
        uint256 shipmentId,
        bool passed,
        string memory notes,
        bytes32 documentHash
    ) external whenNotPaused nonReentrant validShipment(shipmentId) returns (uint256) {
        require(hasRole(QUALITY_INSPECTOR_ROLE, msg.sender), "Not a quality inspector");

        _qualityCheckCounter++;
        uint256 checkId = _qualityCheckCounter;

        QualityCheck memory check = QualityCheck({
            checkId: checkId,
            timestamp: block.timestamp,
            inspector: msg.sender,
            passed: passed,
            notes: notes,
            documentHash: documentHash
        });

        _qualityChecks[shipmentId].push(check);

        if (passed) {
            _shipments[shipmentId].status = ShipmentStatus.QualityChecked;
        } else {
            _shipments[shipmentId].status = ShipmentStatus.Rejected;
        }

        emit QualityCheckPerformed(shipmentId, checkId, passed, msg.sender);
        return checkId;
    }

    function updateTemperatureAndHumidity(
        uint256 shipmentId,
        uint256 temperature,
        uint256 humidity
    ) external whenNotPaused nonReentrant validShipment(shipmentId) onlyShipmentParticipant(shipmentId) {
        Shipment storage shipment = _shipments[shipmentId];
        require(
            shipment.isTemperatureSensitive || shipment.isHumiditySensitive,
            "Shipment not sensitive to environmental conditions"
        );

        BlockRouteLib.QualityMetrics storage metrics = _qualityMetrics[shipmentId];
        metrics.temperature = temperature;
        metrics.humidity = humidity;
        metrics.lastChecked = block.timestamp;

        if (shipment.isTemperatureSensitive) {
            emit TemperatureAlert(shipmentId, temperature, block.timestamp);
        }
        if (shipment.isHumiditySensitive) {
            emit HumidityAlert(shipmentId, humidity, block.timestamp);
        }

        // Update shipment status if conditions are not met
        if (!BlockRouteLib.validateQualityRequirements(
            metrics,
            shipment.isTemperatureSensitive,
            shipment.isHumiditySensitive,
            metrics.lastChecked
        )) {
            shipment.status = ShipmentStatus.Disputed;
            emit ShipmentStatusUpdated(
                shipmentId,
                ShipmentStatus.Disputed,
                "Environmental conditions out of range"
            );
        }
    }

    function raiseDispute(
        uint256 shipmentId,
        string memory reason
    ) external whenNotPaused nonReentrant validShipment(shipmentId) onlyShipmentParticipant(shipmentId) returns (uint256) {
        Shipment storage shipment = _shipments[shipmentId];
        require(shipment.disputeId == 0, "Dispute already exists");

        _disputeCounter++;
        uint256 disputeId = _disputeCounter;

        Dispute storage dispute = _disputes[disputeId];
        dispute.disputeId = disputeId;
        dispute.initiator = msg.sender;
        dispute.reason = reason;
        dispute.status = DisputeStatus.Raised;
        dispute.timestamp = block.timestamp;

        shipment.disputeId = disputeId;
        shipment.status = ShipmentStatus.Disputed;

        emit DisputeRaised(shipmentId, disputeId, msg.sender, reason);
        return disputeId;
    }

    function voteOnDispute(
        uint256 disputeId,
        bool support
    ) external whenNotPaused nonReentrant {
        require(hasRole(DISPUTE_RESOLVER_ROLE, msg.sender), "Not a dispute resolver");
        require(!_disputeVotes[disputeId][msg.sender], "Already voted");

        Dispute storage dispute = _disputes[disputeId];
        require(dispute.status == DisputeStatus.Raised, "Invalid dispute status");

        _disputeVotes[disputeId][msg.sender] = true;
        dispute.votesCount++;

        if (support) {
            dispute.status = DisputeStatus.UnderReview;
        }
    }

    function resolveDispute(
        uint256 disputeId,
        string memory resolution
    ) external whenNotPaused nonReentrant {
        require(hasRole(DISPUTE_RESOLVER_ROLE, msg.sender), "Not a dispute resolver");

        Dispute storage dispute = _disputes[disputeId];
        require(
            dispute.status == DisputeStatus.UnderReview,
            "Dispute not under review"
        );

        dispute.resolution = resolution;
        dispute.status = DisputeStatus.Resolved;

        emit DisputeResolved(disputeId, resolution);
    }

    // View functions implementation
    function getShipment(uint256 shipmentId) external view validShipment(shipmentId) returns (
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
    ) {
        Shipment storage shipment = _shipments[shipmentId];
        return (
            shipment.id,
            shipment.productName,
            shipment.description,
            shipment.manufacturer,
            shipment.supplier,
            shipment.carrier,
            shipment.receiver,
            shipment.origin,
            shipment.destination,
            shipment.estimatedDeliveryDate,
            shipment.status
        );
    }

    function getShipmentQualityChecks(uint256 shipmentId) external view validShipment(shipmentId) returns (QualityCheck[] memory) {
        return _qualityChecks[shipmentId];
    }

    function getDispute(uint256 disputeId) external view returns (
        address initiator,
        string memory reason,
        DisputeStatus status,
        uint256 timestamp,
        string memory resolution,
        uint256 votesCount
    ) {
        Dispute storage dispute = _disputes[disputeId];
        return (
            dispute.initiator,
            dispute.reason,
            dispute.status,
            dispute.timestamp,
            dispute.resolution,
            dispute.votesCount
        );
    }

    function getParticipantRole(uint256 shipmentId, address participant) external view validShipment(shipmentId) returns (Role) {
        return _shipments[shipmentId].participantRoles[participant];
    }

    function getTransitHistory(uint256 shipmentId) external view validShipment(shipmentId) returns (Location[] memory) {
        return _transitPoints[shipmentId];
    }

    function getTotalShipments() external view returns (uint256) {
        return _shipmentCounter;
    }

    // Admin functions
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function assignQualityInspectorRole(address account) external onlyRole(ADMIN_ROLE) {
        grantRole(QUALITY_INSPECTOR_ROLE, account);
    }

    function assignDisputeResolverRole(address account) external onlyRole(ADMIN_ROLE) {
        grantRole(DISPUTE_RESOLVER_ROLE, account);
    }

    // Missing functions from IBlockRoute
    function assignRole(
        uint256 shipmentId,
        address account,
        Role role
    ) external whenNotPaused nonReentrant validShipment(shipmentId) {
        require(hasRole(ADMIN_ROLE, msg.sender), "Only admin can assign roles");
        require(account != address(0), "Invalid address");
        require(role != Role.None, "Invalid role");

        Shipment storage shipment = _shipments[shipmentId];
        require(shipment.participantRoles[account] == Role.None, "Role already assigned");

        shipment.participantRoles[account] = role;
        _userShipments[account].push(shipmentId);

        emit RoleAssigned(account, role, shipmentId);
    }

    function revokeRole(
        uint256 shipmentId,
        address account
    ) external whenNotPaused nonReentrant validShipment(shipmentId) {
        require(hasRole(ADMIN_ROLE, msg.sender), "Only admin can revoke roles");
        require(account != address(0), "Invalid address");

        Shipment storage shipment = _shipments[shipmentId];
        require(shipment.participantRoles[account] != Role.None, "No role assigned");

        // Store the role before removing it (for the event)
        Role previousRole = shipment.participantRoles[account];
        
        // Remove role
        shipment.participantRoles[account] = Role.None;

        // Remove shipment from user's list
        uint256[] storage userShipments = _userShipments[account];
        for (uint256 i = 0; i < userShipments.length; i++) {
            if (userShipments[i] == shipmentId) {
                // Replace with the last element and pop
                userShipments[i] = userShipments[userShipments.length - 1];
                userShipments.pop();
                break;
            }
        }

        emit RoleAssigned(account, Role.None, shipmentId);
    }
}
