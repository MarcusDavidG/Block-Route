// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IBlockRoute.sol";

library BlockRouteLib {
    // Custom errors
    error InvalidTemperature();
    error InvalidHumidity();
    error UnauthorizedRole();
    error DisputeAlreadyExists();
    error InvalidDisputeStatus();
    error AlreadyVoted();
    error QualityCheckFailed();
    error ShipmentNotFound();
    error InvalidTransition();
    error InvalidParticipant();

    // Constants
    // Temperature is stored as Celsius * 100 to handle decimals (e.g., -20.5°C = -2050)
    uint256 constant MIN_SAFE_TEMPERATURE = 0; // Stored as unsigned, actual value determined by isBelowZero flag
    uint256 constant MAX_SAFE_TEMPERATURE = 4000; // 40.00°C
    uint256 constant MIN_SAFE_HUMIDITY = 20;     // 20%
    uint256 constant MAX_SAFE_HUMIDITY = 90;     // 90%
    uint256 constant MINIMUM_VOTES_FOR_RESOLUTION = 3;
    uint256 constant DISPUTE_RESOLUTION_TIMEOUT = 7 days;

    // Structs for complex operations
    struct QualityMetrics {
        uint256 temperature;
        bool isBelowZero;     // Flag to handle negative temperatures
        uint256 humidity;
        uint256 lastChecked;
        bool isWithinLimits;
    }

    struct DisputeResolutionDetails {
        uint256 votesRequired;
        uint256 positiveVotes;
        uint256 negativeVotes;
        uint256 deadline;
        bool canBeResolved;
    }

    // Function to validate temperature and humidity conditions
    function validateEnvironmentalConditions(
        QualityMetrics memory metrics,
        bool isTemperatureSensitive,
        bool isHumiditySensitive
    ) internal pure returns (bool) {
        if (isTemperatureSensitive) {
            // Handle negative temperatures using the isBelowZero flag
            if (metrics.isBelowZero) {
                // For temperatures below zero, we check if it's within -20°C to 0°C
                if (metrics.temperature > 2000) { // -20°C = 2000 (20.00)
                    revert InvalidTemperature();
                }
            } else {
                // For temperatures above zero, we check if it's within 0°C to 40°C
                if (metrics.temperature > MAX_SAFE_TEMPERATURE) {
                    revert InvalidTemperature();
                }
            }
        }

        if (isHumiditySensitive) {
            if (metrics.humidity < MIN_SAFE_HUMIDITY || metrics.humidity > MAX_SAFE_HUMIDITY) {
                revert InvalidHumidity();
            }
        }

        return true;
    }

    // Function to validate state transitions
    function validateStatusTransition(
        IBlockRoute.ShipmentStatus currentStatus,
        IBlockRoute.ShipmentStatus newStatus
    ) internal pure returns (bool) {
        if (currentStatus == IBlockRoute.ShipmentStatus.Created) {
            return newStatus == IBlockRoute.ShipmentStatus.QualityChecked ||
                   newStatus == IBlockRoute.ShipmentStatus.Cancelled;
        }
        
        if (currentStatus == IBlockRoute.ShipmentStatus.QualityChecked) {
            return newStatus == IBlockRoute.ShipmentStatus.InTransit ||
                   newStatus == IBlockRoute.ShipmentStatus.Rejected;
        }
        
        if (currentStatus == IBlockRoute.ShipmentStatus.InTransit) {
            return newStatus == IBlockRoute.ShipmentStatus.Delivered ||
                   newStatus == IBlockRoute.ShipmentStatus.Delayed ||
                   newStatus == IBlockRoute.ShipmentStatus.Disputed;
        }
        
        if (currentStatus == IBlockRoute.ShipmentStatus.Delayed) {
            return newStatus == IBlockRoute.ShipmentStatus.InTransit ||
                   newStatus == IBlockRoute.ShipmentStatus.Disputed;
        }
        
        if (currentStatus == IBlockRoute.ShipmentStatus.Disputed) {
            return newStatus == IBlockRoute.ShipmentStatus.ResolvingDispute;
        }
        
        if (currentStatus == IBlockRoute.ShipmentStatus.ResolvingDispute) {
            return newStatus == IBlockRoute.ShipmentStatus.InTransit ||
                   newStatus == IBlockRoute.ShipmentStatus.Cancelled ||
                   newStatus == IBlockRoute.ShipmentStatus.Delivered;
        }

        return false;
    }

    // Function to check if an address has required role
    function hasRole(
        IBlockRoute.Role requiredRole,
        IBlockRoute.Role actualRole
    ) internal pure returns (bool) {
        if (requiredRole == IBlockRoute.Role.None) {
            return true;
        }
        return requiredRole == actualRole;
    }

    // Function to calculate dispute resolution status
    function calculateDisputeResolution(
        DisputeResolutionDetails memory details
    ) internal pure returns (IBlockRoute.DisputeStatus) {
        if (!details.canBeResolved) {
            return IBlockRoute.DisputeStatus.UnderReview;
        }

        uint256 totalVotes = details.positiveVotes + details.negativeVotes;
        if (totalVotes < details.votesRequired) {
            return IBlockRoute.DisputeStatus.UnderReview;
        }

        return details.positiveVotes > details.negativeVotes
            ? IBlockRoute.DisputeStatus.Resolved
            : IBlockRoute.DisputeStatus.Rejected;
    }

    // Function to validate quality check requirements
    function validateQualityRequirements(
        QualityMetrics memory metrics,
        bool isTemperatureSensitive,
        bool isHumiditySensitive,
        uint256 lastQualityCheck
    ) internal view returns (bool) {
        // Require quality checks at least every 24 hours for sensitive shipments
        if (isTemperatureSensitive || isHumiditySensitive) {
            if (block.timestamp - lastQualityCheck > 24 hours) {
                return false;
            }
        }

        return validateEnvironmentalConditions(metrics, isTemperatureSensitive, isHumiditySensitive);
    }

    // Function to generate a unique ID for various entities
    function generateId(
        address creator,
        uint256 timestamp,
        bytes memory extraData
    ) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(creator, timestamp, extraData)));
    }

    // Function to validate document hash
    function validateDocument(
        bytes32 storedHash,
        bytes32 providedHash
    ) internal pure returns (bool) {
        return storedHash == providedHash;
    }
}
