import { useState } from 'react'
import { useBlockRoute } from '../../hooks/useBlockRoute'
import { WalletButton } from '../../components/shared/ConnectWallet'

export default function CreateShipment() {
  const { address } = useBlockRoute()
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    shippedFrom: '',
    destination: '',
    deliveredOn: '',
    arrivesOn: '',
    isTemperatureSensitive: false,
    isHumiditySensitive: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Will be implemented with blockchain integration
    console.log('Form submitted:', formData)
  }

  if (!address) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please connect your wallet to create a shipment
          </p>
          <WalletButton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Create a new Shipment
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Product Name
              </label>
              <input 
                type="text" 
                id="productName" 
                value={formData.productName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea 
                id="description" 
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter description"
                rows={3}
                required
              />
            </div>

            <div>
              <label htmlFor="shippedFrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Shipped From
              </label>
              <input 
                type="text" 
                id="shippedFrom" 
                value={formData.shippedFrom}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter shipping origin"
                required
              />
            </div>

            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Destination
              </label>
              <input 
                type="text" 
                id="destination" 
                value={formData.destination}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter destination"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="deliveredOn" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Delivered On
                </label>
                <input 
                  type="date" 
                  id="deliveredOn" 
                  value={formData.deliveredOn}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="arrivesOn" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Arrives On
                </label>
                <input 
                  type="date" 
                  id="arrivesOn" 
                  value={formData.arrivesOn}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isTemperatureSensitive"
                  checked={formData.isTemperatureSensitive}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="isTemperatureSensitive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Temperature Sensitive
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isHumiditySensitive"
                  checked={formData.isHumiditySensitive}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="isHumiditySensitive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Humidity Sensitive
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-orange-500 text-white p-3 rounded font-bold 
                       hover:bg-orange-600 transition-colors"
            >
              Create Shipment
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
