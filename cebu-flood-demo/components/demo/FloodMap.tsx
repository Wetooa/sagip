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
  const [censusData, setCensusData] = useState<FloodGeoJSON | null>(null);

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
        (map.current.getSource('flood-hazard') as maplibregl.GeoJSONSource).setData(data as any);
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

    // Function to add census data to map
    const addCensusDataToMap = (data: FloodGeoJSON) => {
      if (!map.current) return;

      // Check if map is loaded
      if (!map.current.loaded()) {
        map.current.once('load', () => addCensusDataToMap(data));
        return;
      }

      // Add the GeoJSON source
      if (map.current.getSource('census-data')) {
        (map.current.getSource('census-data') as maplibregl.GeoJSONSource).setData(data as any);
      } else {
        map.current.addSource('census-data', {
          type: 'geojson',
          data: data as any,
          generateId: true  // Ensure features have IDs for feature state
        });

        // Add fill layer for census data with hover state support
        map.current.addLayer({
          id: 'census-fill',
          type: 'fill',
          source: 'census-data',
          paint: {
            'fill-color': [
              'case',
              // Check hover state first
              ['boolean', ['feature-state', 'hover'], false],
              [
                'case',
                ['==', ['get', 'risk_status'], 1],
                '#ff6f00',  // Brighter orange when hovering (risk_status = 1)
                '#66bb6a'   // Brighter green when hovering (risk_status = 0)
              ],
              // Default colors when not hovering
              [
                'case',
                ['==', ['get', 'risk_status'], 1],
                '#ff9800',  // Orange/red for risk_status = 1
                '#4caf50'   // Green for risk_status = 0
              ]
            ],
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.7,  // More opaque when hovering
              0.4   // Default opacity
            ],
            'fill-outline-color': [
              'case',
              // Check hover state first
              ['boolean', ['feature-state', 'hover'], false],
              [
                'case',
                ['==', ['get', 'risk_status'], 1],
                '#bf360c',  // Darker orange outline when hovering
                '#1b5e20'   // Darker green outline when hovering
              ],
              // Default outline colors
              [
                'case',
                ['==', ['get', 'risk_status'], 1],
                '#e65100',  // Darker orange for outline
                '#2e7d32'   // Darker green for outline
              ]
            ]
          }
        });

        // Add click handler for popups
        map.current.on('click', 'census-fill', (e) => {
          if (!map.current || !e.features || e.features.length === 0) return;

          const feature = e.features[0];
          const properties = feature.properties || {};

          // Format popup content with census properties
          const popupContent = `
            <div style="font-family: sans-serif;">
              <strong>Census Data</strong><br/>
              <strong>Total Population:</strong> ${properties.total_pop?.toFixed(2) || 'N/A'}<br/>
              <strong>Elderly Count:</strong> ${properties.elderly_count?.toFixed(2) || 'N/A'}<br/>
              <strong>Stories:</strong> ${properties.stories || 'N/A'}<br/>
              <strong>Risk Status:</strong> ${properties.risk_status === 1 ? 'At Risk' : 'No Risk'}
            </div>
          `;

          new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(popupContent)
            .addTo(map.current);
        });

        // Track currently hovered feature
        let hoveredFeatureId: number | string | null = null;

        // Change cursor and highlight feature on hover
        map.current.on('mouseenter', 'census-fill', (e) => {
          if (map.current && e.features && e.features.length > 0) {
            map.current.getCanvas().style.cursor = 'pointer';
            
            // Reset previously hovered feature
            if (hoveredFeatureId !== null) {
              try {
                map.current.setFeatureState(
                  { source: 'census-data', id: hoveredFeatureId },
                  { hover: false }
                );
              } catch (err) {
                // Feature might have been removed or ID changed, ignore
                console.debug('Could not reset hover state:', err);
              }
            }
            
            // Set hover state for current feature
            const feature = e.features[0];
            // Use feature.id if available, otherwise try to use a unique property or index
            hoveredFeatureId = feature.id !== undefined && feature.id !== null 
              ? feature.id 
              : feature.properties?.id || null;
            
            if (hoveredFeatureId !== null) {
              try {
                map.current.setFeatureState(
                  { source: 'census-data', id: hoveredFeatureId },
                  { hover: true }
                );
              } catch (err) {
                // If setFeatureState fails, the feature might not have a valid ID
                // In that case, we'll just change the cursor but not the color
                console.debug('Could not set hover state, feature may not have ID:', err);
              }
            }
          }
        });

        map.current.on('mouseleave', 'census-fill', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = '';
            
            // Reset hover state
            if (hoveredFeatureId !== null) {
              map.current.setFeatureState(
                { source: 'census-data', id: hoveredFeatureId },
                { hover: false }
              );
              hoveredFeatureId = null;
            }
          }
        });
      }
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

    // Fetch census data
    const fetchCensusData = async () => {
      try {
        const response = await fetch('/api/census-data');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch census data: ${response.statusText}`);
        }

        const data: FloodGeoJSON = await response.json();
        setCensusData(data);
        addCensusDataToMap(data);
      } catch (err: any) {
        console.error('Error fetching census data:', err);
        // Don't set error state for census data, just log it
        // This allows the flood data to still display if census fails
      }
    };

    fetchFloodData();
    fetchCensusData();

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
