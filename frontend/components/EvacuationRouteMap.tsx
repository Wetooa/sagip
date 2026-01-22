"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { EvacuationCenterRoute } from "@/lib/api/routing";
import { X } from "lucide-react";
import {
  getEvacuationCenterIcon,
  getEvacuationCenterIconColor,
} from "@/lib/utils/evacuation-icons";

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

      // Get icon color based on type
      const iconColor = getEvacuationCenterIconColor(center.evacuation_center.type);
      const centerType = center.evacuation_center.type || "Unknown";
      const normalizedType = centerType.toLowerCase().trim();

      // Get SVG path for icon type (using Lucide icon paths)
      let iconPath = "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"; // Default MapPin
      switch (normalizedType) {
        case "campus":
          // School icon
          iconPath = "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20";
          break;
        case "sports center":
          // Activity/Dumbbell icon
          iconPath = "M22 12h-4l-3 9L9 3l-3 9H2";
          break;
        case "shelter":
          // Home icon
          iconPath = "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z";
          break;
        case "church":
          // ChurchCross icon (simplified)
          iconPath = "M18 22h-3a2 2 0 0 1-2-2v-6l-5-5V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6l-5 5v6a2 2 0 0 1-2 2h-3";
          break;
        case "barangay hall":
          // Building2 icon
          iconPath = "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z M6 12h12 M10 6h4 M10 10h4 M10 14h4 M10 18h4";
          break;
        case "hospital":
          // Hospital icon
          iconPath = "M12 6v12 M17 12H7 M3 12h18 M3 6h18v12H3z";
          break;
        case "field":
          // Trees icon
          iconPath = "M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z M7 16v0 M13 7v.2A3 3 0 0 0 14.1 13v0H18v0h0a3 3 0 0 0 1-5.8V7a3 3 0 0 0-6 0Z M15 13v0 M12 22v-6";
          break;
      }

      // Create custom HTML marker with icon
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "28px";
      el.style.height = "28px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = "white";
      el.style.border = `2px solid ${iconColor}`;
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
      el.style.cursor = "pointer";

      // Create icon SVG
      const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      iconSvg.setAttribute("width", "16");
      iconSvg.setAttribute("height", "16");
      iconSvg.setAttribute("viewBox", "0 0 24 24");
      iconSvg.setAttribute("fill", "none");
      iconSvg.setAttribute("stroke", iconColor);
      iconSvg.setAttribute("stroke-width", "2");
      iconSvg.setAttribute("stroke-linecap", "round");
      iconSvg.setAttribute("stroke-linejoin", "round");

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", iconPath);
      iconSvg.appendChild(path);
      el.appendChild(iconSvg);

      // Add evacuation center marker with custom icon
      const centerMarker = new maplibregl.Marker({ element: el })
        .setLngLat(endCoord)
        .setPopup(
          new maplibregl.Popup().setHTML(`
            <div class="p-2">
              <strong>${center.evacuation_center.name || `Evacuation Center #${center.rank}`}</strong>
              <p class="text-xs mt-1">Type: ${centerType}</p>
              <p class="text-xs">Rank: #${center.rank}</p>
              <div class="mt-2 pt-2 border-t border-gray-200">
                <p class="text-xs font-semibold text-blue-600">ETA: ${Math.round((center.route_duration_seconds || 0) / 60)} min</p>
                <p class="text-xs text-gray-600">Distance: ${((center.route_distance_meters || 0) / 1000).toFixed(1)} km</p>
              </div>
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
