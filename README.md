# BlockRoute - Decentralized Supply Chain Management

BlockRoute is a decentralized application (dApp) built on the Lisk blockchain that enables transparent and efficient supply chain management. It allows users to create, track, and manage shipments with features like quality checks, temperature monitoring, and dispute resolution.

## Repository Structure

The repository contains both the smart contracts and frontend code in a monorepo structure:

```
Block-Route/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── config/        # Configuration files
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── providers/     # Context providers
│   │   └── styles/        # CSS and styling files
│   └── public/            # Static assets
├── src/                   # Smart contract source files
│   ├── interfaces/        # Contract interfaces
│   └── libraries/         # Solidity libraries
├── script/                # Deployment scripts
└── test/                  # Contract test files
```

## Features

- **Shipment Creation**: Create new shipments with detailed information including:
  - Product details
  - Origin and destination locations
  - Temperature and humidity sensitivity settings
  - Estimated delivery dates
  - Document attachments (IPFS integration)

- **Real-time Tracking**: Monitor shipments with:
  - Current status updates
  - Location tracking
  - Temperature and humidity monitoring
  - Transit history

- **Quality Control**:
  - Quality inspection records
  - Pass/fail status tracking
  - Inspector notes and documentation
  - Temperature and humidity alerts

- **Dispute Resolution**:
  - Raise and track disputes
  - Multi-party voting system
  - Resolution documentation
  - Status tracking

## Technology Stack

- **Frontend**:
  - React + TypeScript
  - Vite
  - TailwindCSS
  - Wagmi (Ethereum interactions)
  - React Router (Navigation)

- **Smart Contracts**:
  - Solidity
  - Foundry (Development framework)
  - OpenZeppelin (Security standards)

- **Blockchain**:
  - Network: Lisk Sepolia Testnet
  - RPC URL: https://rpc.sepolia-api.lisk.com
  - Explorer: https://sepolia-blockscout.lisk.com

## Getting Started

### Prerequisites

- Node.js v18+
- Git
- MetaMask or compatible Web3 wallet

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MarcusDavidG/Block-Route.git
   cd Block-Route
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```env
   VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Smart Contract Development

1. Install Foundry:
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. Install dependencies:
   ```bash
   forge install
   ```

3. Run tests:
   ```bash
   forge test
   ```

4. Deploy contracts:
   ```bash
   forge script script/CreateShipment.s.sol --rpc-url https://rpc.sepolia-api.lisk.com --broadcast
   ```

## Usage

1. Connect your Web3 wallet to the Lisk Sepolia testnet
2. Navigate to the Create Shipment page to create a new shipment
3. Fill in the required details:
   - Product name and description
   - Origin and destination locations
   - Delivery dates
   - Temperature/humidity sensitivity settings
4. Submit the transaction and wait for confirmation
5. Track your shipment on the Dashboard
6. Update shipment status and handle disputes as needed

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## Security

- All smart contracts are thoroughly tested and follow best practices
- OpenZeppelin contracts are used for standard implementations
- Regular security audits are performed
- Bug bounty program is available for responsible disclosure

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- GitHub: [@MarcusDavidG](https://github.com/MarcusDavidG)
- Project Link: [https://github.com/MarcusDavidG/Block-Route](https://github.com/MarcusDavidG/Block-Route)
