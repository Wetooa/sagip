"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  AlertTriangle,
  Droplets,
  Wind,
  Mountain,
  MapPin,
  Building2,
  BarChart3,
  Cross,
  Route,
} from "lucide-react";
import { DriftPredictionModal } from "@/components/DriftPredictionModal";
import type { DriftPredictionPin } from "@/app/page";

const CEBU_CENTER: [number, number] = [123.8854, 10.3157];
const DEFAULT_ZOOM = 11;

type HazardLayer =
  | "flood"
  | "storm-surge"
  | "landslide"
  | "rainfall"
  | "buildings"
  | "elevation"
  | "facilities"
  | "roads";

interface FloodGeoJSON {
  type: "FeatureCollection";
  features: any[];
}

interface HazardMappingProps {
  driftPin?: DriftPredictionPin | null;
}

export default function HazardMapping({ driftPin }: HazardMappingProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [activeLayer, setActiveLayer] = useState<HazardLayer>("flood");
  const [isLoading, setIsLoading] = useState(true);
  const [floodData, setFloodData] = useState<FloodGeoJSON | null>(null);
  const [showDriftModal, setShowDriftModal] = useState(false);

  // Load flood data from API
  useEffect(() => {
    const loadFloodData = async () => {
      try {
        const response = await fetch("/api/cebu-flood-data");
        if (response.ok) {
          const data: FloodGeoJSON = await response.json();
          setFloodData(data);
        }
      } catch (error) {
        console.error("Failed to load flood data:", error);
      }
    };
    loadFloodData();
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Cleanup existing map if it exists
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

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
            id: "osm-tiles",
            type: "raster",
            source: "osm",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: CEBU_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    });

    // Trigger resize after a short delay to ensure container is ready
    setTimeout(() => {
      map.current?.resize();
    }, 100);

    // Add navigation controls
    map.current.addControl(
      new maplibregl.NavigationControl({ showCompass: true }),
      "bottom-right",
    );

    map.current.on("load", () => {
      setIsLoading(false);
      map.current?.resize();
      loadHazardLayers();
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;
    updateVisibleLayer();
  }, [activeLayer]);

  // Add flood layer when flood data is loaded
  useEffect(() => {
    if (!map.current || !floodData) return;

    const mapInstance = map.current;

    if (!mapInstance.loaded()) {
      mapInstance.once("load", () => addFloodLayer(mapInstance));
    } else {
      addFloodLayer(mapInstance);
    }
  }, [floodData]);

  // Add drift prediction layer
  useEffect(() => {
    if (!map.current) return;

    const mapInstance = map.current;

    const setupDriftLayer = () => {
      if (!mapInstance) return;

      try {
        // Remove existing drift layer if it exists
        if (mapInstance.getLayer("drift-predictions")) {
          mapInstance.removeLayer("drift-predictions");
        }
        if (mapInstance.getSource("drift-predictions")) {
          mapInstance.removeSource("drift-predictions");
        }
        if (mapInstance.getLayer("drift-predictions-radius")) {
          mapInstance.removeLayer("drift-predictions-radius");
        }
        if (mapInstance.getSource("drift-predictions-radius")) {
          mapInstance.removeSource("drift-predictions-radius");
        }
      } catch (e) {
        // Map may be unloading, ignore
      }

      if (!driftPin) return;

      try {
        // Add drift predictions source
        mapInstance.addSource("drift-predictions", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [driftPin.longitude, driftPin.latitude],
                },
                properties: {
                  radius: driftPin.radius,
                  timestamp: driftPin.timestamp,
                  expiresAt: driftPin.expiresAt,
                },
              },
            ],
          },
        });

        // Add circle layer for the drift prediction point
        mapInstance.addLayer({
          id: "drift-predictions",
          type: "circle",
          source: "drift-predictions",
          paint: {
            "circle-radius": 10,
            "circle-color": "#8b5cf6",
            "circle-stroke-color": "#8b5cf6",
            "circle-stroke-width": 2,
            "circle-opacity": 0.7,
          },
        });

        // Add radius circle layer (larger, semi-transparent)
        mapInstance.addSource("drift-predictions-radius", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [driftPin.longitude, driftPin.latitude],
                },
                properties: {},
              },
            ],
          },
        });

        mapInstance.addLayer({
          id: "drift-predictions-radius",
          type: "circle",
          source: "drift-predictions-radius",
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              11,
              driftPin.radius / 100,
              15,
              driftPin.radius / 50,
            ],
            "circle-color": "#8b5cf6",
            "circle-opacity": 0.2,
            "circle-stroke-color": "#8b5cf6",
            "circle-stroke-width": 1,
            "circle-stroke-opacity": 0.5,
          },
        });

        // Add click handler to show modal
        const handleDriftClick = () => {
          setShowDriftModal(true);
        };

        const handleDriftEnter = () => {
          if (mapInstance) mapInstance.getCanvas().style.cursor = "pointer";
        };

        const handleDriftLeave = () => {
          if (mapInstance) mapInstance.getCanvas().style.cursor = "";
        };

        mapInstance.on("click", "drift-predictions", handleDriftClick);
        mapInstance.on("mouseenter", "drift-predictions", handleDriftEnter);
        mapInstance.on("mouseleave", "drift-predictions", handleDriftLeave);

        return () => {
          if (!mapInstance) return;
          try {
            mapInstance.off("click", "drift-predictions", handleDriftClick);
            mapInstance.off("mouseenter", "drift-predictions", handleDriftEnter);
            mapInstance.off("mouseleave", "drift-predictions", handleDriftLeave);
          } catch (e) {
            // Map may be unloading, ignore
          }
        };
      } catch (e) {
        console.error("Error setting up drift layer:", e);
      }
    };

    if (mapInstance.loaded()) {
      return setupDriftLayer();
    } else {
      const handleLoad = () => {
        const cleanup = setupDriftLayer();
        if (cleanup) {
          return cleanup;
        }
      };
      mapInstance.once("load", handleLoad);
      return () => {
        mapInstance.off("load", handleLoad);
      };
    }
  }, [driftPin]);

  const addFloodLayer = (mapInstance: maplibregl.Map) => {
    if (!floodData) return;

    // Remove existing flood layer if it exists
    if (mapInstance.getLayer("flood-layer")) {
      mapInstance.removeLayer("flood-layer");
    }
    if (mapInstance.getSource("flood-data")) {
      mapInstance.removeSource("flood-data");
    }

    // Add real flood data source
    mapInstance.addSource("flood-data", {
      type: "geojson",
      data: floodData as any,
    });

    // Add flood layer with depth-based coloring (same as main MapView)
    mapInstance.addLayer({
      id: "flood-layer",
      type: "fill",
      source: "flood-data",
      paint: {
        "fill-color": [
          "case",
          ["has", "DEPTH_M"],
          [
            "interpolate",
            ["linear"],
            ["to-number", ["get", "DEPTH_M"]],
            0,
            "#e3f2fd",
            0.5,
            "#90caf9",
            1,
            "#42a5f5",
            2,
            "#1e88e5",
            5,
            "#1565c0",
          ],
          "#42a5f5",
        ],
        "fill-opacity": 0.6,
      },
      layout: { visibility: activeLayer === "flood" ? "visible" : "none" },
    });

    // Add click handler for flood info
    mapInstance.on("click", "flood-layer", (e) => {
      if (!e.features || e.features.length === 0) return;
      const props = e.features[0].properties || {};
      const depth = props.DEPTH_M || props.Var || "Unknown";
      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          `<div class="p-2"><strong>Flood Depth:</strong> ${depth}m</div>`,
        )
        .addTo(mapInstance);
    });

    mapInstance.on("mouseenter", "flood-layer", () => {
      mapInstance.getCanvas().style.cursor = "pointer";
    });

    mapInstance.on("mouseleave", "flood-layer", () => {
      mapInstance.getCanvas().style.cursor = "";
    });
  };

  const loadHazardLayers = () => {
    if (!map.current) return;

    // Storm surge, landslide, etc. layers (mock data for now)
    map.current.addSource("storm-surge-data", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: generateHazardFeatures("storm-surge"),
      },
    });

    map.current.addLayer({
      id: "storm-surge-layer",
      type: "fill",
      source: "storm-surge-data",
      paint: {
        "fill-color": "#3b82f6",
        "fill-opacity": 0.5,
      },
      layout: { visibility: "none" },
    });

    // Add landslide layer
    map.current.addSource("landslide-data", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: generateHazardFeatures("landslide"),
      },
    });

    map.current.addLayer({
      id: "landslide-layer",
      type: "fill",
      source: "landslide-data",
      paint: {
        "fill-color": "#a855f7",
        "fill-opacity": 0.5,
      },
      layout: { visibility: "none" },
    });

    // Add rainfall heatmap
    map.current.addSource("rainfall-data", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: generateRainfallPoints(),
      },
    });

    map.current.addLayer({
      id: "rainfall-layer",
      type: "heatmap",
      source: "rainfall-data",
      paint: {
        "heatmap-weight": ["get", "intensity"],
        "heatmap-intensity": 1,
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0,
          "rgba(33, 102, 172, 0)",
          0.2,
          "rgb(103, 169, 207)",
          0.4,
          "rgb(209, 229, 240)",
          0.6,
          "rgb(253, 219, 199)",
          0.8,
          "rgb(239, 138, 98)",
          1,
          "rgb(178, 24, 43)",
        ],
        "heatmap-radius": 30,
      },
      layout: { visibility: "none" },
    });

    // Add buildings layer
    map.current.addSource("buildings-data", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: generateBuildingFeatures(),
      },
    });

    map.current.addLayer({
      id: "buildings-layer",
      type: "fill-extrusion",
      source: "buildings-data",
      paint: {
        "fill-extrusion-color": [
          "match",
          ["get", "type"],
          "residential",
          "#64748b",
          "commercial",
          "#3b82f6",
          "industrial",
          "#f59e0b",
          "government",
          "#10b981",
          "#94a3b8",
        ],
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-opacity": 0.8,
      },
      layout: { visibility: "none" },
    });

    // Add elevation layer
    map.current.addSource("elevation-data", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: generateElevationFeatures(),
      },
    });

    map.current.addLayer({
      id: "elevation-layer",
      type: "fill",
      source: "elevation-data",
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "elevation"],
          0,
          "#1e3a5f",
          50,
          "#2d5a87",
          100,
          "#4a7c59",
          200,
          "#8fbc8f",
          300,
          "#daa520",
          400,
          "#cd853f",
          500,
          "#8b4513",
        ],
        "fill-opacity": 0.6,
      },
      layout: { visibility: "none" },
    });

    // Add facilities layer
    map.current.addSource("facilities-data", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: generateFacilityFeatures(),
      },
    });

    map.current.addLayer({
      id: "facilities-layer",
      type: "circle",
      source: "facilities-data",
      paint: {
        "circle-radius": 8,
        "circle-color": [
          "match",
          ["get", "type"],
          "hospital",
          "#ef4444",
          "evacuation",
          "#22c55e",
          "fire-station",
          "#f97316",
          "police",
          "#3b82f6",
          "#94a3b8",
        ],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
      layout: { visibility: "none" },
    });

    // Add roads layer
    map.current.addSource("roads-data", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: generateRoadFeatures(),
      },
    });

    map.current.addLayer({
      id: "roads-layer",
      type: "line",
      source: "roads-data",
      paint: {
        "line-color": [
          "match",
          ["get", "type"],
          "highway",
          "#ef4444",
          "primary",
          "#f97316",
          "secondary",
          "#eab308",
          "tertiary",
          "#64748b",
          "#94a3b8",
        ],
        "line-width": [
          "match",
          ["get", "type"],
          "highway",
          4,
          "primary",
          3,
          "secondary",
          2,
          1,
        ],
      },
      layout: { visibility: "none" },
    });
  };

  const updateVisibleLayer = () => {
    if (!map.current) return;

    const layers = [
      "flood-layer",
      "storm-surge-layer",
      "landslide-layer",
      "rainfall-layer",
      "buildings-layer",
      "elevation-layer",
      "facilities-layer",
      "roads-layer",
    ];
    layers.forEach((layer) => {
      if (map.current?.getLayer(layer)) {
        map.current.setLayoutProperty(
          layer,
          "visibility",
          layer === `${activeLayer}-layer` ? "visible" : "none",
        );
      }
    });
  };

  const generateHazardFeatures = (type: string) => {
    const features = [];
    for (let i = 0; i < 15; i++) {
      const lat = CEBU_CENTER[1] + (Math.random() - 0.5) * 0.2;
      const lng = CEBU_CENTER[0] + (Math.random() - 0.5) * 0.2;
      const size = 0.01 + Math.random() * 0.02;

      features.push({
        type: "Feature" as const,
        properties: {
          severity: ["low", "medium", "high", "critical"][
            Math.floor(Math.random() * 4)
          ],
          type,
        },
        geometry: {
          type: "Polygon" as const,
          coordinates: [
            [
              [lng, lat],
              [lng + size, lat],
              [lng + size, lat + size],
              [lng, lat + size],
              [lng, lat],
            ],
          ],
        },
      });
    }
    return features;
  };

  const generateRainfallPoints = () => {
    const features = [];
    for (let i = 0; i < 100; i++) {
      features.push({
        type: "Feature" as const,
        properties: {
          intensity: Math.random(),
        },
        geometry: {
          type: "Point" as const,
          coordinates: [
            CEBU_CENTER[0] + (Math.random() - 0.5) * 0.2,
            CEBU_CENTER[1] + (Math.random() - 0.5) * 0.2,
          ],
        },
      });
    }
    return features;
  };

  const generateBuildingFeatures = () => {
    const features = [];
    const buildingTypes = [
      "residential",
      "commercial",
      "industrial",
      "government",
    ];
    for (let i = 0; i < 30; i++) {
      const lat = CEBU_CENTER[1] + (Math.random() - 0.5) * 0.15;
      const lng = CEBU_CENTER[0] + (Math.random() - 0.5) * 0.15;
      const size = 0.003 + Math.random() * 0.005;

      features.push({
        type: "Feature" as const,
        properties: {
          type: buildingTypes[Math.floor(Math.random() * buildingTypes.length)],
          height: 10 + Math.random() * 50,
        },
        geometry: {
          type: "Polygon" as const,
          coordinates: [
            [
              [lng, lat],
              [lng + size, lat],
              [lng + size, lat + size],
              [lng, lat + size],
              [lng, lat],
            ],
          ],
        },
      });
    }
    return features;
  };

  const generateElevationFeatures = () => {
    const features = [];
    for (let i = 0; i < 20; i++) {
      const lat = CEBU_CENTER[1] + (Math.random() - 0.5) * 0.2;
      const lng = CEBU_CENTER[0] + (Math.random() - 0.5) * 0.2;
      const size = 0.015 + Math.random() * 0.025;

      features.push({
        type: "Feature" as const,
        properties: {
          elevation: Math.floor(Math.random() * 500),
        },
        geometry: {
          type: "Polygon" as const,
          coordinates: [
            [
              [lng, lat],
              [lng + size, lat],
              [lng + size, lat + size],
              [lng, lat + size],
              [lng, lat],
            ],
          ],
        },
      });
    }
    return features;
  };

  const generateFacilityFeatures = () => {
    const features = [];
    const facilityTypes = ["hospital", "evacuation", "fire-station", "police"];
    for (let i = 0; i < 25; i++) {
      features.push({
        type: "Feature" as const,
        properties: {
          type: facilityTypes[Math.floor(Math.random() * facilityTypes.length)],
          name: `Facility ${i + 1}`,
        },
        geometry: {
          type: "Point" as const,
          coordinates: [
            CEBU_CENTER[0] + (Math.random() - 0.5) * 0.18,
            CEBU_CENTER[1] + (Math.random() - 0.5) * 0.18,
          ],
        },
      });
    }
    return features;
  };

  const generateRoadFeatures = () => {
    const features = [];
    const roadTypes = ["highway", "primary", "secondary", "tertiary"];
    for (let i = 0; i < 15; i++) {
      const startLat = CEBU_CENTER[1] + (Math.random() - 0.5) * 0.2;
      const startLng = CEBU_CENTER[0] + (Math.random() - 0.5) * 0.2;
      const points: number[][] = [];

      for (let j = 0; j < 5; j++) {
        points.push([
          startLng + (Math.random() - 0.5) * 0.1 + j * 0.02,
          startLat + (Math.random() - 0.5) * 0.05,
        ]);
      }

      features.push({
        type: "Feature" as const,
        properties: {
          type: roadTypes[Math.floor(Math.random() * roadTypes.length)],
        },
        geometry: {
          type: "LineString" as const,
          coordinates: points,
        },
      });
    }
    return features;
  };

  return (
    <div className="relative w-full h-full min-h-[500px]">
      {/* Map Container */}
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

      {/* Drift Prediction Modal */}
      {driftPin && (
        <DriftPredictionModal
          open={showDriftModal}
          onClose={() => setShowDriftModal(false)}
          latitude={driftPin.latitude}
          longitude={driftPin.longitude}
          radius={driftPin.radius}
          expiresAt={driftPin.expiresAt}
        />
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#0f172a]/90 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#6B1515] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Loading hazard data...</p>
          </div>
        </div>
      )}

      {/* Layer Controls */}
      <div className="absolute top-4 left-4 bg-gradient-to-br from-[#1e293b]/90 to-[#0f172a]/90 backdrop-blur-xl rounded-lg border border-white/20 p-2 space-y-1.5 shadow-lg max-h-[calc(100%-2rem)] overflow-y-auto">
        <div className="text-xs font-semibold text-white/60 px-2 pt-1 uppercase tracking-wider">
          Natural Hazards
        </div>
        <LayerButton
          icon={Droplets}
          label="Flood Zones"
          active={activeLayer === "flood"}
          onClick={() => setActiveLayer("flood")}
          color="text-blue-500"
        />
        <LayerButton
          icon={Wind}
          label="Storm Surge"
          active={activeLayer === "storm-surge"}
          onClick={() => setActiveLayer("storm-surge")}
          color="text-cyan-500"
        />
        <LayerButton
          icon={Mountain}
          label="Landslide Risk"
          active={activeLayer === "landslide"}
          onClick={() => setActiveLayer("landslide")}
          color="text-purple-500"
        />
        <LayerButton
          icon={AlertTriangle}
          label="Rainfall"
          active={activeLayer === "rainfall"}
          onClick={() => setActiveLayer("rainfall")}
          color="text-yellow-500"
        />

        <div className="text-xs font-semibold text-white/60 px-2 pt-3 uppercase tracking-wider">
          Infrastructure
        </div>
        <LayerButton
          icon={Building2}
          label="Buildings"
          active={activeLayer === "buildings"}
          onClick={() => setActiveLayer("buildings")}
          color="text-slate-400"
        />
        <LayerButton
          icon={BarChart3}
          label="Elevation"
          active={activeLayer === "elevation"}
          onClick={() => setActiveLayer("elevation")}
          color="text-emerald-500"
        />
        <LayerButton
          icon={Cross}
          label="Facilities"
          active={activeLayer === "facilities"}
          onClick={() => setActiveLayer("facilities")}
          color="text-red-500"
        />
        <LayerButton
          icon={Route}
          label="Roads"
          active={activeLayer === "roads"}
          onClick={() => setActiveLayer("roads")}
          color="text-orange-500"
        />
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-gradient-to-br from-[#1e293b]/90 to-[#0f172a]/90 backdrop-blur-xl rounded-lg border border-white/20 p-4 min-w-[200px] shadow-lg">
        <h3 className="text-sm font-semibold mb-3 text-white">
          {activeLayer === "flood"
            ? "Flood Depth (m)"
            : activeLayer === "storm-surge" ||
                activeLayer === "landslide" ||
                activeLayer === "rainfall"
              ? "Risk Levels"
              : activeLayer === "buildings"
                ? "Building Types"
                : activeLayer === "elevation"
                  ? "Elevation (m)"
                  : activeLayer === "facilities"
                    ? "Facility Types"
                    : "Road Types"}
        </h3>
        <div className="space-y-2">
          {activeLayer === "flood" && (
            <>
              <LegendItem color="bg-[#e3f2fd]" label="< 0.5m (Low)" />
              <LegendItem color="bg-[#90caf9]" label="0.5 - 1m" />
              <LegendItem color="bg-[#42a5f5]" label="1 - 2m" />
              <LegendItem color="bg-[#1e88e5]" label="2 - 5m" />
              <LegendItem color="bg-[#1565c0]" label="> 5m (High)" />
            </>
          )}
          {(activeLayer === "storm-surge" ||
            activeLayer === "landslide" ||
            activeLayer === "rainfall") && (
            <>
              <LegendItem color="bg-[#fef3c7]" label="Low Risk" />
              <LegendItem color="bg-[#fbbf24]" label="Medium Risk" />
              <LegendItem color="bg-[#f97316]" label="High Risk" />
              <LegendItem color="bg-[#dc2626]" label="Critical Risk" />
            </>
          )}
          {activeLayer === "buildings" && (
            <>
              <LegendItem color="bg-[#64748b]" label="Residential" />
              <LegendItem color="bg-[#3b82f6]" label="Commercial" />
              <LegendItem color="bg-[#f59e0b]" label="Industrial" />
              <LegendItem color="bg-[#10b981]" label="Government" />
            </>
          )}
          {activeLayer === "elevation" && (
            <>
              <LegendItem color="bg-[#1e3a5f]" label="0-50m (Low)" />
              <LegendItem color="bg-[#4a7c59]" label="100-200m" />
              <LegendItem color="bg-[#daa520]" label="300-400m" />
              <LegendItem color="bg-[#8b4513]" label="500m+ (High)" />
            </>
          )}
          {activeLayer === "facilities" && (
            <>
              <LegendItem color="bg-[#ef4444]" label="Hospital" />
              <LegendItem color="bg-[#22c55e]" label="Evacuation Center" />
              <LegendItem color="bg-[#f97316]" label="Fire Station" />
              <LegendItem color="bg-[#3b82f6]" label="Police Station" />
            </>
          )}
          {activeLayer === "roads" && (
            <>
              <LegendItem color="bg-[#ef4444]" label="Highway" />
              <LegendItem color="bg-[#f97316]" label="Primary" />
              <LegendItem color="bg-[#eab308]" label="Secondary" />
              <LegendItem color="bg-[#64748b]" label="Tertiary" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface LayerButtonProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  color: string;
}

function LayerButton({
  icon: Icon,
  label,
  active,
  onClick,
  color,
}: LayerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-all ${
        active
          ? "bg-gradient-to-r from-[#8B0000] to-[#6B1515] text-white shadow-md"
          : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon className={`w-4 h-4 ${active ? "text-white" : color}`} />
      <span className="text-sm font-medium whitespace-nowrap">{label}</span>
    </button>
  );
}

interface LegendItemProps {
  color: string;
  label: string;
}

function LegendItem({ color, label }: LegendItemProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded ${color}`}></div>
      <span className="text-xs text-gray-300">{label}</span>
    </div>
  );
}
