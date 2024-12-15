import { useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { useBlockRoute } from '../../hooks/useBlockRoute'
import { MAPBOX_ACCESS_TOKEN, defaultMapConfig, addRouteLayer, createMarkerElement } from '../../config/mapbox'
import { MapLoading, MapError, MapNoData } from '../../components/shared/MapLoading'
import { WalletButton } from '../../components/shared/ConnectWallet'

// Set Mapbox access token
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

interface ShipmentLocation {
  coordinates: [number, number]
  name: string
  timestamp: string
}

export default function TrackShipment() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const { address } = useBlockRoute()
  const [shipmentId, setShipmentId] = useState('')
  const [isTracking, setIsTracking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock shipment data - will be replaced with blockchain data
  const mockShipmentData = {
    id: '123456',
    origin: {
      coordinates: [-97.7419, 30.2672],
      name: '2972 Westheimer',
      timestamp: '2024-01-15 08:00 AM'
    } as ShipmentLocation,
    current: {
      coordinates: [-97.7031, 30.2813],
      name: 'In Transit',
      timestamp: '2024-01-15 02:30 PM'
    } as ShipmentLocation,
    destination: {
      coordinates: [-97.6754, 30.2964],
      name: '8502 Preston',
      timestamp: '2024-01-15 05:00 PM'
    } as ShipmentLocation,
    status: 'In Transit',
    estimatedArrival: '2024-01-15 05:00 PM'
  }

  const initializeMap = async () => {
    if (!mapContainerRef.current) return

    try {
      setIsLoading(true)
      setError(null)

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        ...defaultMapConfig,
        center: mockShipmentData.current.coordinates,
      })

      mapRef.current = map

      // Wait for map to load
      await new Promise((resolve) => map.on('load', resolve))

      // Add route line
      const coordinates = [
        mockShipmentData.origin.coordinates,
        mockShipmentData.current.coordinates,
        mockShipmentData.destination.coordinates,
      ]
      
      addRouteLayer(map, coordinates)

      // Add markers
      new mapboxgl.Marker({ element: createMarkerElement('start') })
        .setLngLat(mockShipmentData.origin.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-bold">Origin</h3>
            <p>${mockShipmentData.origin.name}</p>
            <p class="text-sm text-gray-500">${mockShipmentData.origin.timestamp}</p>
          </div>
        `))
        .addTo(map)

      new mapboxgl.Marker({ element: createMarkerElement('current') })
        .setLngLat(mockShipmentData.current.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-bold">Current Location</h3>
            <p>${mockShipmentData.current.name}</p>
            <p class="text-sm text-gray-500">${mockShipmentData.current.timestamp}</p>
          </div>
        `))
        .addTo(map)

      new mapboxgl.Marker({ element: createMarkerElement('end') })
        .setLngLat(mockShipmentData.destination.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-bold">Destination</h3>
            <p>${mockShipmentData.destination.name}</p>
            <p class="text-sm text-gray-500">ETA: ${mockShipmentData.estimatedArrival}</p>
          </div>
        `))
        .addTo(map)

      // Fit map to show all markers
      const bounds = new mapboxgl.LngLatBounds()
        .extend(mockShipmentData.origin.coordinates)
        .extend(mockShipmentData.current.coordinates)
        .extend(mockShipmentData.destination.coordinates)

      map.fitBounds(bounds, { padding: 50 })
      setIsLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load map')
      setIsLoading(false)
    }
  }

  const handleTrackShipment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsTracking(true)
    // Here we would fetch the shipment data from the blockchain
    // For now, we'll just initialize the map with mock data
    await initializeMap()
  }

  const handleReset = () => {
    setIsTracking(false)
    setError(null)
    if (mapRef.current) {
      mapRef.current.remove()
    }
  }

  if (!address) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please connect your wallet to track shipments
          </p>
          <WalletButton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {!isTracking ? (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
              <h1 className="text-2xl font-bold text-orange-400 mb-6 text-center">
                Track Your Shipment
              </h1>
              <form onSubmit={handleTrackShipment} className="space-y-6">
                <div>
                  <label htmlFor="shipmentId" className="block text-sm font-medium mb-2">
                    Shipment ID
                  </label>
                  <input
                    type="text"
                    id="shipmentId"
                    value={shipmentId}
                    onChange={(e) => setShipmentId(e.target.value)}
                    className="w-full p-3 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 
                             text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your shipment ID"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white p-3 rounded font-bold 
                           hover:bg-orange-600 transition-colors"
                >
                  Track Shipment
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen flex flex-col">
          {/* Shipment Info Bar */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">Shipment #{mockShipmentData.id}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status: {mockShipmentData.status}</p>
              </div>
              <button
                onClick={handleReset}
                className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600"
              >
                Track Another
              </button>
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-grow relative">
            <div ref={mapContainerRef} className="absolute inset-0" />
            {isLoading && <MapLoading />}
            {error && <MapError message={error} />}
            {!isLoading && !error && !mockShipmentData && <MapNoData />}
          </div>
        </div>
      )}
    </div>
  )
}
