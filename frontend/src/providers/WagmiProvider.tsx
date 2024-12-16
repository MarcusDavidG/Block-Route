import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

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
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 1,
    },
  },
  testnet: true,
} as const

// Configure chains and providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [liskSepolia],
  [publicProvider()]
)

// Create wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ 
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
    new MetaMaskConnector({ 
      chains,
      options: {
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})

// Create react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 30_000,
    },
  },
})

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  )
}
