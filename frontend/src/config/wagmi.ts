import { createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Custom Lisk Sepolia chain configuration
const liskSepolia = {
  ...sepolia,
  id: 4202,
  name: 'Lisk Sepolia',
  network: 'lisk-sepolia',
  nativeCurrency: {
    name: 'LSK',
    symbol: 'LSK',
    decimals: 18,
  },
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
      name: 'Lisk Blockscout',
      url: 'https://sepolia-blockscout.lisk.com',
    },
  },
} as const

// Contract addresses
export const BLOCKROUTE_ADDRESS = '0xA4E64aabcae48a5f4C45d84dD2493B9Fb3f81D84' as const

// Wagmi config
export const config = createConfig({
  chains: [liskSepolia],
  connectors: [
    injected()
  ],
  transports: {
    [liskSepolia.id]: http(),
  },
})
