"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import {
  Navigation,
  Clock,
  MapPin,
  TrendingUp,
  AlertCircle,
  Truck,
} from "lucide-react";

const CEBU_CENTER: [number, number] = [123.8854, 10.3157];

interface RescueRoute {
  id: string;
  start: [number, number];
  end: [number, number];
  duration: number;
  distance: number;
  status: "active" | "planned" | "completed";
  team: string;
  priority: "critical" | "high" | "medium";
}

export default function RescueRoutes() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [routes] = useState<RescueRoute[]>([
    {
      id: "1",
      start: [123.8854, 10.3157],
      end: [123.8954, 10.3257],
      duration: 12,
      distance: 2.3,
      status: "active",
      team: "Team Alpha",
      priority: "critical",
    },
    {
      id: "2",
      start: [123.8754, 10.3057],
      end: [123.8654, 10.3157],
      duration: 8,
      distance: 1.8,
      status: "active",
      team: "Team Bravo",
      priority: "high",
    },
    {
      id: "3",
      start: [123.8954, 10.3057],
      end: [123.9054, 10.3157],
      duration: 15,
      distance: 3.1,
      status: "planned",
      team: "Team Charlie",
      priority: "medium",
    },
    {
      id: "4",
      start: [123.8654, 10.3257],
      end: [123.8754, 10.3357],
      duration: 10,
      distance: 2.0,
      status: "completed",
      team: "Team Delta",
      priority: "high",
    },
  ]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: CEBU_CENTER,
      zoom: 12,
      attributionControl: false,
    });

    map.current.on("load", () => {
      loadRoutes();
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  const loadRoutes = () => {
    if (!map.current) return;

    routes.forEach((route) => {
      const routeId = `route-${route.id}`;
      const lineColor =
        route.status === "active"
          ? "#ef4444"
          : route.status === "planned"
            ? "#3b82f6"
            : "#22c55e";

      // Add route line
      map.current!.addSource(routeId, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [route.start, route.end],
          },
        },
      });

      map.current!.addLayer({
        id: routeId,
        type: "line",
        source: routeId,
        paint: {
          "line-color": lineColor,
          "line-width": 4,
          "line-opacity": 0.8,
        },
      });

      // Add start marker
      new maplibregl.Marker({ color: "#6B1515" })
        .setLngLat(route.start)
        .addTo(map.current!);

      // Add end marker
      new maplibregl.Marker({ color: lineColor })
        .setLngLat(route.end)
        .addTo(map.current!);

      // Add animated marker for active routes
      if (route.status === "active") {
        const animatedMarker = document.createElement("div");
        animatedMarker.className = "rescue-vehicle-marker";
        animatedMarker.innerHTML = "🚑";
        animatedMarker.style.fontSize = "24px";

        new maplibregl.Marker({ element: animatedMarker })
          .setLngLat(route.start)
          .addTo(map.current!);
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-red-500";
      case "planned":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="h-full flex">
      {/* Routes List */}
      <div className="w-96 border-r border-white/10 overflow-y-auto">
        <div className="p-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
            <Navigation className="w-5 h-5 text-[#6B1515]" />
            Rescue Routes
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {routes.filter((r) => r.status === "active").length} active missions
          </p>
        </div>

        <div className="divide-y divide-white/10">
          {routes.map((route) => (
            <button
              key={route.id}
              onClick={() => setSelectedRoute(route.id)}
              className={`w-full p-4 text-left transition-colors hover:bg-white/5 ${
                selectedRoute === route.id ? "bg-white/10" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-3 h-3 rounded-full ${getPriorityColor(route.priority)}`}
                    ></div>
                    <span className="font-semibold text-white">
                      {route.team}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-medium ${getStatusColor(route.status)} uppercase`}
                  >
                    {route.status}
                  </span>
                </div>
                <Truck
                  className={`w-5 h-5 ${
                    route.status === "active"
                      ? "text-red-500 animate-pulse"
                      : "text-gray-500"
                  }`}
                />
              </div>

              <div className="space-y-2 mt-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>ETA: {route.duration} min</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>Distance: {route.distance} km</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Map & Details */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" />

        {selectedRoute && (
          <div className="absolute top-4 right-4 w-80 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-lg border border-white/20 p-4 shadow-lg">
            <RouteDetails route={routes.find((r) => r.id === selectedRoute)!} />
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-lg border border-white/20 p-4 shadow-lg">
          <h3 className="text-sm font-semibold mb-3 text-white">Status</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-xs text-gray-300">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-xs text-gray-300">Planned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-xs text-gray-300">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RouteDetails({ route }: { route: RescueRoute }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">{route.team}</h3>
        <span
          className={`text-sm font-medium uppercase ${
            route.status === "active"
              ? "text-red-500"
              : route.status === "planned"
                ? "text-blue-500"
                : "text-green-500"
          }`}
        >
          {route.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/50 rounded-lg p-3 border border-white/10 hover:border-white/20 transition-all">
          <div className="text-xs text-gray-400 mb-1">ETA</div>
          <div className="text-lg font-bold text-white">
            {route.duration} min
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/50 rounded-lg p-3 border border-white/10 hover:border-white/20 transition-all">
          <div className="text-xs text-gray-400 mb-1">Distance</div>
          <div className="text-lg font-bold text-white">
            {route.distance} km
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="w-4 h-4 text-[#6B1515] mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-400">Start</div>
            <div className="text-white font-mono text-xs">
              {route.start[0].toFixed(4)}, {route.start[1].toFixed(4)}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-400">Destination</div>
            <div className="text-white font-mono text-xs">
              {route.end[0].toFixed(4)}, {route.end[1].toFixed(4)}
            </div>
          </div>
        </div>
      </div>

      {route.status === "active" && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-yellow-200">
            Mission in progress - Real-time tracking active
          </p>
        </div>
      )}

      <button className="w-full bg-gradient-to-r from-[#8B0000] to-[#6B1515] hover:shadow-lg hover:shadow-[#8B0000]/50 text-white py-2 rounded-lg text-sm font-semibold transition-all duration-300">
        View Full Details
      </button>
    </div>
  );
}
