'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { FloodGeoJSON } from '@/types/flood';
import LocationSearch from './LocationSearch';

interface FloodMapProps {
  className?: string;
}

export default function FloodMap({ className }: FloodMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<FloodGeoJSON | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map centered on Cebu, Philippines
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      },
      center: [123.9, 10.3], // Cebu, Philippines
      zoom: 10
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Function to add flood data to map
    const addFloodDataToMap = (data: FloodGeoJSON) => {
      if (!map.current) return;

      // Check if map is loaded
      if (!map.current.loaded()) {
        map.current.once('load', () => addFloodDataToMap(data));
        return;
      }

      // Add the GeoJSON source
      if (map.current.getSource('flood-hazard')) {
        (map.current.getSource('flood-hazard') as maplibregl.GeoJSONSource).setData(data);
      } else {
        map.current.addSource('flood-hazard', {
          type: 'geojson',
          data: data
        });

        // Debug: Log first feature to inspect structure
        if (data.features && data.features.length > 0) {
          const sampleFeature = data.features[0];
          console.log('=== Client-side GeoJSON Debug ===');
          console.log('Sample feature:', sampleFeature);
          console.log('Properties:', sampleFeature.properties);
          console.log('Geometry type:', sampleFeature.geometry.type);
          
          // Check geometry closure
          if (sampleFeature.geometry.type === 'Polygon' && sampleFeature.geometry.coordinates[0]) {
            const ring = sampleFeature.geometry.coordinates[0];
            const isClosed = ring.length > 0 && 
              ring[0][0] === ring[ring.length - 1][0] && 
              ring[0][1] === ring[ring.length - 1][1];
            console.log('Polygon ring closed:', isClosed, 'Ring length:', ring.length);
          }
          
          // Check DEPTH_M property
          console.log('DEPTH_M exists:', 'DEPTH_M' in sampleFeature.properties);
          console.log('DEPTH_M value:', sampleFeature.properties.DEPTH_M);
          console.log('DEPTH_M type:', typeof sampleFeature.properties.DEPTH_M);
          console.log('================================');
        }

        // Add fill layer for flood zones
        // Use fill-outline-color for better rendering
        // Note: $type returns 'Polygon' for both Polygon and MultiPolygon, so no filter needed
        map.current.addLayer({
          id: 'flood-hazard-fill',
          type: 'fill',
          source: 'flood-hazard',
          paint: {
            'fill-color': [
              'case',
              ['has', 'DEPTH_M'],
              [
                'interpolate',
                ['linear'],
                ['to-number', ['get', 'DEPTH_M']],
                0, '#e3f2fd',      // 0m - Very Low
                0.5, '#90caf9',    // 0-0.5m - Low
                1, '#42a5f5',      // 0.5-1m - Moderate
                2, '#1e88e5',      // 1-2m - High
                5, '#1565c0'       // 2-5m - Very High
              ],
              '#42a5f5' // Default blue color if DEPTH_M doesn't exist
            ],
            'fill-opacity': 0.6,
            'fill-outline-color': '#0d47a1'
          }
        });

        // Add click handler for popups
        map.current.on('click', 'flood-hazard-fill', (e) => {
          if (!map.current || !e.features || e.features.length === 0) return;

          const feature = e.features[0];
          const properties = feature.properties || {};

          // Create popup content
          const popupContent = Object.entries(properties)
            .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
            .join('<br/>');

          new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(popupContent || 'No data available')
            .addTo(map.current);
        });

        // Change cursor on hover
        map.current.on('mouseenter', 'flood-hazard-fill', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = 'pointer';
          }
        });

        map.current.on('mouseleave', 'flood-hazard-fill', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = '';
          }
        });
      }

      setLoading(false);
    };

    // Fetch flood data
    const fetchFloodData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/cebu-flood-data');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch flood data: ${response.statusText}`);
        }

        const data: FloodGeoJSON = await response.json();
        setGeoJsonData(data);
        addFloodDataToMap(data);
      } catch (err: any) {
        console.error('Error fetching flood data:', err);
        setError(err.message || 'Failed to load flood data');
        setLoading(false);
      }
    };

    fetchFloodData();

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-full ${className || ''}`}>
      <div ref={mapContainer} className="w-full h-full" />
      <LocationSearch map={map.current} />
      {loading && (
        <div className="absolute top-20 left-4 bg-white px-4 py-2 rounded shadow-lg">
          <p className="text-sm">Loading flood hazard data...</p>
        </div>
      )}
      {error && (
        <div className="absolute top-20 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow-lg">
          <p className="text-sm font-semibold">Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
