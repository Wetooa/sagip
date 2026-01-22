"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Users,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
} from "lucide-react";

// Philippine center coordinates
const PHILIPPINES_CENTER: [number, number] = [122.0, 12.5];
const DEFAULT_ZOOM = 5.5;

// Risk zones based on geographic regions with names
const RISK_ZONES = {
  critical: [
    { center: [120.9842, 14.5995], radius: 0.4, name: "Metro Manila" },
    { center: [120.58, 16.41], radius: 0.25, name: "Dagupan" },
    { center: [121.0, 14.6], radius: 0.3, name: "Marikina Valley" },
  ],
  danger: [
    { center: [123.8854, 10.3157], radius: 0.35, name: "Cebu City" },
    { center: [125.5, 7.07], radius: 0.3, name: "Davao" },
    { center: [121.05, 14.28], radius: 0.25, name: "Laguna Lake" },
    { center: [120.6, 15.0], radius: 0.2, name: "Pampanga" },
  ],
  warning: [
    { center: [120.97, 14.07], radius: 0.3, name: "Cavite" },
    { center: [124.23, 8.48], radius: 0.25, name: "Tacloban" },
    { center: [121.62, 16.48], radius: 0.2, name: "Baguio" },
    { center: [122.56, 10.69], radius: 0.25, name: "Iloilo" },
  ],
  safe: [
    { center: [118.74, 9.78], radius: 0.35, name: "Palawan" },
    { center: [126.08, 9.3], radius: 0.3, name: "Surigao" },
    { center: [119.77, 15.48], radius: 0.25, name: "Subic" },
    { center: [123.3, 13.14], radius: 0.25, name: "Legazpi" },
  ],
};

interface Person {
  id: string;
  name: string;
  location: [number, number];
  zone: "safe" | "warning" | "danger" | "critical";
  lastUpdate: string;
  status: "online" | "offline";
}

interface RollCallProps {
  peopleCount: number;
}

export default function RollCall({ peopleCount }: RollCallProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [people, setPeople] = useState<Person[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [zoneStats, setZoneStats] = useState({
    safe: 0,
    warning: 0,
    danger: 0,
    critical: 0,
  });

  // Determine zone based on location
  const getZoneFromLocation = (
    lng: number,
    lat: number,
  ): "safe" | "warning" | "danger" | "critical" => {
    for (const [zone, areas] of Object.entries(RISK_ZONES)) {
      for (const area of areas) {
        const distance = Math.sqrt(
          Math.pow(lng - area.center[0], 2) + Math.pow(lat - area.center[1], 2),
        );
        if (distance <= area.radius) {
          return zone as "safe" | "warning" | "danger" | "critical";
        }
      }
    }
    // Default to safe if not in any zone
    return "safe";
  };

  useEffect(() => {
    // Generate mock data for people - concentrated in risk zones
    const generatePeople = () => {
      const newPeople: Person[] = [];
      const stats = { safe: 0, warning: 0, danger: 0, critical: 0 };

      // Distribution: 40% critical, 25% danger, 20% warning, 15% safe
      const distribution = {
        critical: Math.floor(peopleCount * 0.4),
        danger: Math.floor(peopleCount * 0.25),
        warning: Math.floor(peopleCount * 0.2),
        safe: Math.floor(peopleCount * 0.15),
      };

      let personId = 0;

      // Generate people in each zone
      for (const [zone, count] of Object.entries(distribution)) {
        const zoneAreas = RISK_ZONES[zone as keyof typeof RISK_ZONES];

        for (let i = 0; i < count; i++) {
          // Pick a random area in this zone
          const area = zoneAreas[Math.floor(Math.random() * zoneAreas.length)];

          // Generate random point within the zone radius (using polar coordinates for uniform distribution)
          const angle = Math.random() * 2 * Math.PI;
          const r = Math.sqrt(Math.random()) * area.radius; // sqrt for uniform distribution
          const lng = area.center[0] + r * Math.cos(angle);
          const lat = area.center[1] + r * Math.sin(angle);

          stats[zone as keyof typeof stats]++;

          newPeople.push({
            id: `person-${personId++}`,
            name: `Resident ${personId}`,
            location: [lng, lat],
            zone: zone as "safe" | "warning" | "danger" | "critical",
            lastUpdate: new Date(
              Date.now() - Math.random() * 600000,
            ).toISOString(),
            status: Math.random() > 0.1 ? "online" : "offline",
          });
        }
      }

      setPeople(newPeople);
      setZoneStats(stats);
    };

    generatePeople();
  }, [peopleCount]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Cleanup existing map if it exists
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: PHILIPPINES_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    });

    // Trigger resize after a short delay to ensure container is ready
    setTimeout(() => {
      map.current?.resize();
    }, 100);

    map.current.on("load", () => {
      if (!map.current) return;

      // Resize map to fit container
      map.current.resize();

      // Add zone radius circles
      const zoneColors = {
        critical: "#ef4444",
        danger: "#f97316",
        warning: "#eab308",
        safe: "#22c55e",
      };

      // Create GeoJSON for zone circles
      const zoneFeatures: any[] = [];

      for (const [zone, areas] of Object.entries(RISK_ZONES)) {
        for (const area of areas) {
          // Create a circle polygon (approximated with 64 points)
          const points = 64;
          const coordinates: number[][] = [];

          for (let i = 0; i <= points; i++) {
            const angle = (i / points) * 2 * Math.PI;
            coordinates.push([
              area.center[0] + area.radius * Math.cos(angle),
              area.center[1] + area.radius * Math.sin(angle),
            ]);
          }

          zoneFeatures.push({
            type: "Feature",
            properties: {
              zone,
              name: area.name,
              color: zoneColors[zone as keyof typeof zoneColors],
            },
            geometry: {
              type: "Polygon",
              coordinates: [coordinates],
            },
          });
        }
      }

      // Add zone circles source
      map.current.addSource("zone-circles", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: zoneFeatures,
        },
      });

      // Add fill layer for zones
      map.current.addLayer({
        id: "zone-fill",
        type: "fill",
        source: "zone-circles",
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": 0.2,
        },
      });

      // Add zone labels
      map.current.addLayer({
        id: "zone-labels",
        type: "symbol",
        source: "zone-circles",
        layout: {
          "text-field": ["get", "name"],
          "text-size": 11,
          "text-anchor": "center",
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": ["get", "color"],
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.5,
        },
      });

      setIsMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update map markers when people or filter changes
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    // Remove existing source and layer if they exist
    if (map.current.getLayer("people-layer")) {
      map.current.removeLayer("people-layer");
    }
    if (map.current.getSource("people-data")) {
      map.current.removeSource("people-data");
    }

    // Filter people by selected zone
    const filteredPeople =
      selectedZone === "all"
        ? people
        : people.filter((p) => p.zone === selectedZone);

    // Create GeoJSON data
    const geojsonData = {
      type: "FeatureCollection" as const,
      features: filteredPeople.map((person) => ({
        type: "Feature" as const,
        properties: {
          zone: person.zone,
          status: person.status,
          name: person.name,
        },
        geometry: {
          type: "Point" as const,
          coordinates: person.location,
        },
      })),
    };

    // Add source
    map.current.addSource("people-data", {
      type: "geojson",
      data: geojsonData,
    });

    // Add layer
    map.current.addLayer({
      id: "people-layer",
      type: "circle",
      source: "people-data",
      paint: {
        "circle-radius": ["case", ["==", ["get", "status"], "online"], 5, 3],
        "circle-color": [
          "match",
          ["get", "zone"],
          "safe",
          "#22c55e",
          "warning",
          "#eab308",
          "danger",
          "#f97316",
          "critical",
          "#ef4444",
          "#94a3b8",
        ],
        "circle-opacity": 0.8,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#ffffff",
        "circle-stroke-opacity": 0.5,
      },
    });
  }, [people, selectedZone, isMapLoaded]);

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case "safe":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "danger":
        return "text-orange-500";
      case "critical":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getZoneBgColor = (zone: string) => {
    switch (zone) {
      case "safe":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "danger":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 p-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border-b border-white/10">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-white mb-4">
          <Users className="w-5 h-5 text-[#6B1515]" />
          Roll Call - Population Tracking
        </h2>

        {/* Zone Stats */}
        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={() => setSelectedZone("all")}
            className={`p-2.5 rounded-lg border transition-all ${
              selectedZone === "all"
                ? "bg-white/10 border-white/30"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="text-xl font-bold text-white">{peopleCount}</div>
            <div className="text-[10px] text-gray-400">Total</div>
          </button>
          <button
            onClick={() => setSelectedZone("critical")}
            className={`p-2.5 rounded-lg border transition-all ${
              selectedZone === "critical"
                ? "bg-red-500/20 border-red-500/50"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="text-xl font-bold text-red-500">
              {zoneStats.critical}
            </div>
            <div className="text-[10px] text-gray-400">Critical</div>
          </button>
          <button
            onClick={() => setSelectedZone("danger")}
            className={`p-2.5 rounded-lg border transition-all ${
              selectedZone === "danger"
                ? "bg-orange-500/20 border-orange-500/50"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="text-xl font-bold text-orange-500">
              {zoneStats.danger}
            </div>
            <div className="text-[10px] text-gray-400">Danger</div>
          </button>
          <button
            onClick={() => setSelectedZone("warning")}
            className={`p-2.5 rounded-lg border transition-all ${
              selectedZone === "warning"
                ? "bg-yellow-500/20 border-yellow-500/50"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="text-xl font-bold text-yellow-500">
              {zoneStats.warning}
            </div>
            <div className="text-[10px] text-gray-400">Warning</div>
          </button>
          <button
            onClick={() => setSelectedZone("safe")}
            className={`p-2.5 rounded-lg border transition-all ${
              selectedZone === "safe"
                ? "bg-green-500/20 border-green-500/50"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="text-xl font-bold text-green-500">
              {zoneStats.safe}
            </div>
            <div className="text-[10px] text-gray-400">Safe</div>
          </button>
        </div>
      </div>

      {/* Philippine Map with Scatter Plot */}
      <div className="flex-1 p-4 min-h-[400px]">
        <div className="h-full w-full min-h-[350px] bg-[#0f172a]/50 rounded-lg border border-white/10 relative">
          <div
            ref={mapContainer}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
            }}
          />

          {/* Legend */}
          <div className="absolute top-4 right-4 bg-gradient-to-br from-[#1e293b]/90 to-[#0f172a]/90 backdrop-blur-xl rounded-lg border border-white/20 p-3 space-y-2 shadow-lg">
            <div className="text-xs font-semibold text-white mb-2">
              Risk Zones
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-300">Safe Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-300">Warning Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-gray-300">Danger Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-300">Critical Zone</span>
            </div>
            <div className="border-t border-white/10 my-2"></div>
            <div className="text-xs text-gray-400">Size: Online vs Offline</div>
          </div>

          {/* Info */}
          <div className="absolute bottom-4 left-4 bg-gradient-to-br from-[#1e293b]/90 to-[#0f172a]/90 backdrop-blur-xl rounded-lg border border-white/20 p-3 shadow-lg">
            <div className="text-xs text-gray-400">
              {selectedZone === "all"
                ? "Showing all zones"
                : `Filtered: ${selectedZone} zone`}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Philippines-wide coverage
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {zoneStats.critical > 0 && (
        <div className="p-4 bg-red-500/10 border-t border-red-500/30">
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">
              {zoneStats.critical} people in critical zones - Immediate action
              required
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
