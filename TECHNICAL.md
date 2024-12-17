# BlockRoute Technical Documentation

## Smart Contract Architecture

### Core Contract: BlockRoute.sol

The main contract implements the IBlockRoute interface and manages the entire supply chain system.

#### Data Structures

1. **Shipment**
```solidity
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
    uint256 temperature;
    uint256 humidity;
    bytes32 documentsHash;
    bool isTemperatureSensitive;
    bool isHumiditySensitive;
    uint256 qualityCheckId;
    uint256 disputeId;
    uint256 insuranceId;
    mapping(address => Role) participantRoles;
}
```

2. **Location**
```solidity
struct Location {
    string latitude;
    string longitude;
    string name;
    uint256 timestamp;
    address updatedBy;
}
```

3. **QualityCheck**
```solidity
struct QualityCheck {
    uint256 checkId;
    uint256 timestamp;
    address inspector;
    bool passed;
    string notes;
    bytes32 documentHash;
}
```

#### State Management

The contract maintains several key state variables:
- Shipment mapping and counter
- Quality check records
- Dispute tracking
- Role assignments
- Environmental data history

#### Access Control

Role-based access control is implemented for different operations:
- Manufacturer: Can create shipments
- Supplier: Can update shipment details
- Carrier: Can update location and environmental data
- Quality Inspector: Can perform quality checks
- Receiver: Can confirm delivery and raise disputes

## Frontend Integration

### Web3 Integration (useBlockRoute.ts)

The `useBlockRoute` hook provides a clean interface for interacting with the smart contract:

```typescript
export function useBlockRoute() {
  // Contract read operations
  const useShipment = (shipmentId: bigint) => {
    return useContractRead({
      address: BLOCKROUTE_ADDRESS,
      abi: BLOCKROUTE_ABI,
      functionName: 'getShipment',
      args: [shipmentId],
      select: (data) => ({
        id: data[0],
        productName: data[1],
        // ... other fields
      })
    })
  }

  // Contract write operations
  const useCreateShipment = (args?: CreateShipmentArgs) => {
    const { config, error: prepareError } = usePrepareContractWrite({
      address: BLOCKROUTE_ADDRESS,
      abi: BLOCKROUTE_ABI,
      functionName: 'createShipment',
      enabled: Boolean(address && args),
      args
    })
    
    return useContractWrite(config)
  }
}
```

### Blockchain Network Configuration

The dApp is configured to work with the Lisk Sepolia testnet:

```typescript
export const liskSepolia = {
  id: 4202,
  name: 'Lisk Sepolia',
  network: 'lisk-sepolia',
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia-api.lisk.com'],
    },
    public: {
      http: ['https://rpc.sepolia-api.lisk.com'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Lisk Explorer', 
      url: 'https://sepolia-blockscout.lisk.com' 
    },
  },
}
```

### Form Data Handling

The CreateShipment component handles complex form data with proper validation:

```typescript
interface FormData {
  productName: string
  description: string
  origin: LocationInput
  destination: LocationInput
  deliveredOn: string
  arrivesOn: string
  isTemperatureSensitive: boolean
  isHumiditySensitive: boolean
}

const getContractArgs = (): CreateShipmentArgs => {
  return [
    formData.productName,
    formData.description,
    address,
    address,
    address,
    {
      latitude: formData.origin.latitude,
      longitude: formData.origin.longitude,
      name: formData.origin.name,
      timestamp: BigInt(new Date(formData.deliveredOn).getTime() / 1000),
      updatedBy: address
    },
    // ... other args
  ]
}
```

## Testing Strategy

### Smart Contract Tests

1. **Unit Tests**
```solidity
function testCreateShipment() public {
    string memory productName = "Test Product";
    string memory description = "Test Description";
    // ... setup test data
    
    uint256 shipmentId = blockRoute.createShipment(
        productName,
        description,
        supplier,
        carrier,
        receiver,
        origin,
        destination,
        estimatedDeliveryDate,
        isTemperatureSensitive,
        isHumiditySensitive,
        documentsHash
    );
    
    // Assert shipment was created correctly
    (uint256 id, string memory name, /* other fields */) = 
        blockRoute.getShipment(shipmentId);
    assertEq(id, shipmentId);
    assertEq(name, productName);
}
```

2. **Integration Tests**
- Test complete shipment lifecycle
- Verify role-based access control
- Check event emissions
- Test error conditions

### Frontend Testing

1. **Component Tests**
- Form validation
- Wallet connection
- Error handling
- Loading states

2. **Integration Tests**
- Contract interaction flows
- Data persistence
- Navigation
- State management

## Deployment Process

1. **Smart Contracts**
```bash
# Deploy contracts
forge script script/CreateShipment.s.sol \
    --rpc-url https://rpc.sepolia-api.lisk.com \
    --broadcast

# Verify contracts
forge verify-contract \
    --chain-id 4202 \
    --compiler-version v0.8.20 \
    $CONTRACT_ADDRESS \
    src/BlockRoute.sol:BlockRoute
```

2. **Frontend**
```bash
# Build frontend
cd frontend
npm run build

# Deploy to hosting service
npm run deploy
```

## Security Considerations

1. **Smart Contract Security**
- Role-based access control
- Input validation
- Reentrancy protection
- Gas optimization
- Event emission for transparency

2. **Frontend Security**
- Wallet connection validation
- Transaction confirmation
- Error handling
- Data validation
- Network security

## Maintenance and Upgrades

1. **Smart Contract Upgrades**
- Use proxy pattern for upgradability
- Maintain proper version control
- Document changes thoroughly
- Test extensively before deployment

2. **Frontend Updates**
- Regular dependency updates
- Performance monitoring
- User feedback integration
- Feature additions

## Performance Optimization

1. **Smart Contract**
- Gas optimization
- Efficient data structures
- Batch operations
- Event filtering

2. **Frontend**
- Code splitting
- Lazy loading
- Caching strategies
- State management optimization

## Error Handling

1. **Smart Contract**
```solidity
require(msg.sender == shipment.manufacturer, "Not authorized");
require(shipment.status != ShipmentStatus.Cancelled, "Shipment cancelled");
```

2. **Frontend**
```typescript
try {
  await write()
} catch (err) {
  console.error('Failed to create shipment:', err)
  // Handle error appropriately
}
```

## Future Improvements

1. **Technical Enhancements**
- Layer 2 scaling solutions
- Advanced analytics
- Machine learning integration
- IoT device integration

2. **Feature Additions**
- Multi-signature approvals
- Advanced dispute resolution
- Insurance integration
- Automated compliance checks
