import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

interface ConnectWalletProps {
  className?: string
  fullScreen?: boolean
}

export function ConnectWallet({ className = '', fullScreen = false }: ConnectWalletProps) {
  const { address, isConnecting } = useAccount()
  const { connect } = useConnect({
    connector: new MetaMaskConnector()
  })
  const { disconnect } = useDisconnect()

  const handleClick = () => {
    if (address) {
      disconnect()
    } else {
      connect()
    }
  }

  const content = (
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {address ? 'Wallet Connected' : 'Connect Your Wallet'}
      </h2>
      {address && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 font-mono">
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </p>
      )}
      <button
        onClick={handleClick}
        disabled={isConnecting}
        className={`bg-orange-500 text-white px-6 py-3 rounded font-bold 
                   hover:bg-orange-600 disabled:bg-gray-400 transition-colors ${className}`}
      >
        {isConnecting ? 'Connecting...' : address ? 'Disconnect' : 'Connect Wallet'}
      </button>
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
  const { connect } = useConnect({
    connector: new MetaMaskConnector()
  })
  const { disconnect } = useDisconnect()

  const handleClick = () => {
    if (address) {
      disconnect()
    } else {
      connect()
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting}
      className="bg-orange-500 text-white px-4 py-2 rounded font-bold 
                 hover:bg-orange-600 disabled:bg-gray-400 transition-colors"
    >
      {isConnecting ? (
        'Connecting...'
      ) : address ? (
        `${address.slice(0, 6)}...${address.slice(-4)}`
      ) : (
        'Connect Wallet'
      )}
    </button>
  )
}
