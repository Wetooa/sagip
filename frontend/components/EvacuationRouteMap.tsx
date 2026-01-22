"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { EvacuationCenterRoute } from "@/lib/api/routing";
import { X } from "lucide-react";

interface EvacuationRouteMapProps {
  userLocation: { latitude: number; longitude: number };
  centers: EvacuationCenterRoute[];
  onClose?: () => void;
}

const ROUTE_COLORS = [
  { color: "#3b82f6", name: "Blue" }, // 1st - Blue
  { color: "#10b981", name: "Green" }, // 2nd - Green
  { color: "#f97316", name: "Orange" }, // 3rd - Orange
];

export function EvacuationRouteMap({
  userLocation,
  centers,
  onClose,
}: EvacuationRouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm-layer",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center: [userLocation.longitude, userLocation.latitude],
      zoom: 13,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [userLocation]);

  // Add user location marker
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing user marker
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add user location marker
    const userMarker = new maplibregl.Marker({
      color: "#ef4444",
      scale: 1.2,
    })
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .setPopup(
        new maplibregl.Popup().setHTML(`
          <div class="p-2">
            <strong>Your Location</strong>
          </div>
        `)
      )
      .addTo(map.current);

    markersRef.current.push(userMarker);

    // Add evacuation center markers and routes
    centers.forEach((center, index) => {
      const route = center.route?.routes?.[0];
      if (!route || !route.geometry) return;

      // Extract evacuation center coordinates from route geometry
      // OSRM returns coordinates as [lon, lat] arrays
      const routeCoords = route.geometry.coordinates;
      if (!routeCoords || routeCoords.length === 0) return;
      const endCoord = routeCoords[routeCoords.length - 1] as [number, number];

      // Add evacuation center marker
      const centerMarker = new maplibregl.Marker({
        color: ROUTE_COLORS[index]?.color || "#6b7280",
      })
        .setLngLat(endCoord)
        .setPopup(
          new maplibregl.Popup().setHTML(`
            <div class="p-2">
              <strong>${center.evacuation_center.name || `Evacuation Center #${center.rank}`}</strong>
              <p class="text-xs mt-1">Rank: #${center.rank}</p>
              <p class="text-xs">Distance: ${(center.route_distance_meters || 0) / 1000} km</p>
              <p class="text-xs">Duration: ${Math.round((center.route_duration_seconds || 0) / 60)} min</p>
            </div>
          `)
        )
        .addTo(map.current!);

      markersRef.current.push(centerMarker);

      // Add route line
      const routeId = `route-${center.rank}`;
      const sourceId = `route-source-${center.rank}`;

      if (map.current!.getSource(sourceId)) {
        (map.current!.getSource(sourceId) as maplibregl.GeoJSONSource).setData({
          type: "Feature",
          geometry: route.geometry,
          properties: {
            rank: center.rank,
          },
        });
      } else {
        map.current!.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: route.geometry,
            properties: {
              rank: center.rank,
            },
          },
        });

        map.current!.addLayer({
          id: routeId,
          type: "line",
          source: sourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": ROUTE_COLORS[index]?.color || "#6b7280",
            "line-width": 4,
            "line-opacity": 0.8,
          },
        });
      }
    });

    // Fit map to show all routes
    if (centers.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      bounds.extend([userLocation.longitude, userLocation.latitude]);

      centers.forEach((center) => {
        const route = center.route?.routes?.[0];
        if (route && route.geometry && route.geometry.coordinates) {
          route.geometry.coordinates.forEach((coord: [number, number]) => {
            bounds.extend(coord);
          });
        }
      });

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      });
    }
  }, [mapLoaded, centers, userLocation]);

  return (
    <div className="relative w-full h-full">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
        >
          <X className="w-5 h-5 text-gray-800" />
        </button>
      )}
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10">
        <div className="text-xs font-semibold mb-2">Route Legend</div>
        <div className="space-y-1">
          {centers.map((center, index) => (
            <div key={center.rank} className="flex items-center gap-2 text-xs">
              <div
                className="w-4 h-1 rounded"
                style={{ backgroundColor: ROUTE_COLORS[index]?.color || "#6b7280" }}
              />
              <span>
                #{center.rank}: {center.evacuation_center.name || `Center ${center.rank}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
