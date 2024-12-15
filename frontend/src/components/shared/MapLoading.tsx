interface MapLoadingProps {
  message?: string;
}

export function MapLoading({ message = 'Loading map...' }: MapLoadingProps) {
  return (
    <div className="map-loading">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
        <span className="text-white">{message}</span>
      </div>
    </div>
  );
}

export function MapError({ message = 'Error loading map' }: MapLoadingProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="text-center p-4">
        <div className="text-red-500 mb-2">
          <svg 
            className="w-8 h-8 mx-auto" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        <p className="text-white">{message}</p>
      </div>
    </div>
  );
}

export function MapNoData() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="text-center p-4">
        <div className="text-gray-400 mb-2">
          <svg 
            className="w-8 h-8 mx-auto" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <p className="text-white">No shipment data available</p>
      </div>
    </div>
  );
}
