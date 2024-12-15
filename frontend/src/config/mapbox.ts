import type { Map, AnyLayer } from 'mapbox-gl';

// Replace with your actual Mapbox access token
export const MAPBOX_ACCESS_TOKEN = 'YOUR_MAPBOX_ACCESS_TOKEN';

export const defaultMapConfig = {
  style: 'mapbox://styles/mapbox/dark-v11', // Dark theme for our dark mode design
  zoom: 11,
  pitch: 45, // Add some 3D perspective
  bearing: 0,
  antialias: true
};

export const getRouteLayer = (): AnyLayer => ({
  id: 'route',
  type: 'line',
  source: 'route',
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    'line-color': '#f97316',
    'line-width': 6,
    'line-opacity': 0.8
  }
});

export const addRouteLayer = (map: Map, coordinates: [number, number][]) => {
  // Add the route source
  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates
      }
    }
  });

  // Add the route layer
  map.addLayer(getRouteLayer());
};

export const createMarkerElement = (type: 'start' | 'current' | 'end') => {
  const element = document.createElement('div');
  element.className = 'marker';
  
  // Customize marker based on type
  switch (type) {
    case 'start':
      element.innerHTML = `
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      `;
      break;
    case 'current':
      element.innerHTML = `
        <div class="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white pulse">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </div>
      `;
      break;
    case 'end':
      element.innerHTML = `
        <div class="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </div>
      `;
      break;
  }
  
  return element;
};
