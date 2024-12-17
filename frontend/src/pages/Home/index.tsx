import { Link } from 'react-router-dom'
import { useBlockRoute } from '../../hooks/useBlockRoute'
import { WalletButton } from '../../components/shared/ConnectWallet'
import Roadfreight from '../../assets/Roadfreight.jpg'
import Groundshipping from '../../assets/Groundshipping.jpg'
import Railfreight from '../../assets/Railfreight.jpg'
import Seafreight from '../../assets/Seafreight.jpg'

export function Home() {
  const { address } = useBlockRoute()

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      {/* Hero Section */}
      <section className="text-center p-8 relative">
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        <h1 className="text-4xl md:text-6xl font-bold text-orange-400 relative z-10">
          Revolutionize Supply Chain Tracking with BlockRoute
        </h1>
        <p className="text-gray-300 mt-4 max-w-3xl mx-auto relative z-10">
          Experience real-time transparency, trust, and efficiency with blockchain-powered 
          shipment tracking. From manufacturing to delivery, every step is immutably 
          recorded for accountability and peace of mind.
        </p>
        {!address ? (
          <div className="mt-6 relative z-10">
            <WalletButton />
          </div>
        ) : (
          <div className="flex gap-4 justify-center mt-6 relative z-10">
            <Link 
              to="/create" 
              className="bg-orange-500 px-6 py-3 rounded text-lg hover:bg-orange-600 text-white"
            >
              Create Shipment
            </Link>
            <Link 
              to="/track" 
              className="bg-gray-700 px-6 py-3 rounded text-lg hover:bg-gray-600 text-white"
            >
              Track Shipment
            </Link>
          </div>
        )}
      </section>

      {/* Image Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8">
        <div className="aspect-video bg-gray-800 rounded overflow-hidden">
          <img 
            src={Roadfreight}
            alt="Road Freight" 
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </div>
        <div className="aspect-video bg-gray-800 rounded overflow-hidden">
          <img 
            src={Groundshipping} 
            alt="Ground Shipping" 
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </div>
        <div className="aspect-video bg-gray-800 rounded overflow-hidden">
          <img 
            src={Railfreight}
            alt="Railway Freight" 
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </div>
        <div className="aspect-video bg-gray-800 rounded overflow-hidden">
          <img 
            src={Seafreight} 
            alt="Sea Freight" 
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-gray-800 p-8 text-center">
        <h2 className="text-3xl font-bold text-orange-400 mb-4">
          If You Transport It, We'll Track It!
        </h2>
        <p className="text-gray-400 mb-8">
          Discover how BlockRoute revolutionizes supply chain tracking with cutting-edge 
          features designed for transparency, accuracy, and efficiency.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4 bg-gray-700 rounded">
            <h3 className="text-xl font-bold">Real-Time Updates</h3>
            <p className="text-gray-400 mt-2">
              Stay informed with live tracking of your shipments, ensuring every movement is monitored.
            </p>
          </div>
          <div className="p-4 bg-gray-700 rounded">
            <h3 className="text-xl font-bold">Immutable Records</h3>
            <p className="text-gray-400 mt-2">
              Each step in the process is securely logged on the blockchain, providing a tamper-proof record.
            </p>
          </div>
          <div className="p-4 bg-gray-700 rounded">
            <h3 className="text-xl font-bold">Transparency for All</h3>
            <p className="text-gray-400 mt-2">
              Stay informed with live tracking of your shipments, ensuring every movement is monitored.
            </p>
          </div>
          <div className="p-4 bg-gray-700 rounded">
            <h3 className="text-xl font-bold">Proof of Authenticity</h3>
            <p className="text-gray-400 mt-2">
              Resolve disputes quickly with accurate and verifiable data, backed by blockchain technology.
            </p>
          </div>
        </div>
      </section>

      {/* Route Options Section */}
      <section className="p-8">
        <h2 className="text-center text-3xl font-bold text-orange-400 mb-4">
          Route of your Package!
        </h2>
        <p className="text-center text-gray-400 mb-8">
          Track every step of your shipment's journey with BlockRoute, offering a seamless 
          and transparent view of your package's route from start to finish.
        </p>
        
      </section>
    </div>
  )
}
