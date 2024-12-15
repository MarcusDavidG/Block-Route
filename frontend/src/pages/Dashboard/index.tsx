import { useBlockRoute } from '../../hooks/useBlockRoute'
import { Link } from 'react-router-dom'
import { WalletButton } from '../../components/shared/ConnectWallet'

export default function Dashboard() {
  const { address } = useBlockRoute()

  // Mock data - will be replaced with blockchain data
  const mockStats = {
    total: 40689,
    active: 40689,
    completed: 40689,
    delayed: 10293
  }

  if (!address) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please connect your wallet to view your dashboard
          </p>
          <WalletButton />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      {/* Shipment Status Section */}
      <section className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Shipment Status */}
        <div className="lg:col-span-2 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-orange-400 mb-4">My shipment current Status</h2>
          <div className="flex items-center justify-between mb-4">
            <div className="w-full flex justify-center items-center">
              <div className="text-sm text-orange-400">✓ Left warehouse</div>
              <div className="mx-4 border-b-4 border-orange-400 flex-grow"></div>
              <div className="text-sm">Shipment name</div>
              <div className="mx-4 border-b border-gray-600 flex-grow"></div>
              <div className="text-sm text-gray-500">Destination</div>
            </div>
          </div>
          <div className="flex gap-4">
            <Link 
              to="/create" 
              className="flex-grow bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-center"
            >
              Create shipment
            </Link>
            <Link 
              to="/track" 
              className="flex-grow bg-orange-500 px-4 py-2 rounded hover:bg-orange-600 text-white text-center"
            >
              Track shipment
            </Link>
          </div>
        </div>

        {/* History */}
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-orange-400 mb-4">History</h2>
          <ul className="text-sm space-y-2">
            {Array(8).fill('Delivered').map((item, index) => (
              <li key={index} className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{item}</span>
                <span>• Delivered</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-orange-400">Total</h3>
          <p className="text-4xl font-bold">{mockStats.total.toLocaleString()}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-orange-400">Active</h3>
          <p className="text-4xl font-bold">{mockStats.active.toLocaleString()}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-orange-400">Completed</h3>
          <p className="text-4xl font-bold">{mockStats.completed.toLocaleString()}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-orange-400">Delayed</h3>
          <p className="text-4xl font-bold">{mockStats.delayed.toLocaleString()}</p>
        </div>
      </section>

      {/* Shipment Details Chart Section */}
      <section className="p-8">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-orange-400 mb-4">Shipment Details</h2>
          {/* Placeholder for chart */}
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
            <span>Chart Placeholder (Will be implemented with Chart.js)</span>
          </div>
        </div>
      </section>
    </div>
  )
}
