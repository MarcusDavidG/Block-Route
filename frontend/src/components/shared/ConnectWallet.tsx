import { useAccount, useConnect, useDisconnect } from 'wagmi'

interface ConnectWalletProps {
  className?: string
  fullScreen?: boolean
}

export function ConnectWallet({ className = '', fullScreen = false }: ConnectWalletProps) {
  const { address, isConnecting } = useAccount()
  const { connect, connectors, error } = useConnect()
  const { disconnect } = useDisconnect()

  const handleConnect = async (connectorId: string) => {
    const connector = connectors.find(c => c.id === connectorId)
    if (connector) {
      connect({ connector })
    }
  }

  const content = (
    <div className="text-center p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-orange-400 mb-4">Wallet Connection</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error.message}
        </div>
      )}

      {address ? (
        <div>
          <p className="text-gray-400 mb-2">Connected with:</p>
          <p className="font-mono text-sm text-gray-400 mb-4">
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </p>
          <button 
            onClick={() => disconnect()}
            className={`bg-orange-500 px-6 py-3 rounded text-white font-bold 
                     hover:bg-orange-600 transition-colors ${className}`}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-400 mb-6">
            Please connect your wallet to continue
          </p>
          <div className="space-y-3">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => handleConnect(connector.id)}
                disabled={!connector.ready || isConnecting}
                className={`w-full bg-orange-500 px-6 py-3 rounded text-white font-bold 
                         hover:bg-orange-600 disabled:bg-gray-400 transition-colors ${className}`}
              >
                {isConnecting
                  ? 'Connecting...'
                  : `Connect with ${connector.name}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  return content
}

export function WalletButton() {
  const { address, isConnecting } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const handleClick = () => {
    if (address) {
      disconnect()
    } else {
      // Default to first available connector (usually injected/MetaMask)
      const connector = connectors[0]
      if (connector) {
        connect({ connector })
      }
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting}
      className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600 
                disabled:bg-gray-400 transition-colors"
    >
      {isConnecting
        ? 'Connecting...'
        : address
          ? `${address.slice(0, 6)}...${address.slice(-4)}`
          : 'Connect Wallet'
      }
    </button>
  )
}
