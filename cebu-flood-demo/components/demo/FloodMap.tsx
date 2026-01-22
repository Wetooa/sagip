"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FloodGeoJSON } from "@/types/flood";
import { TyphoonData } from "@/types/typhoon";
import LocationSearch from "./LocationSearch";

interface FloodMapProps {
  className?: string;
}

export default function FloodMap({ className }: FloodMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const typhoonInteractionsBound = useRef(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<FloodGeoJSON | null>(null);
  const [storms, setStorms] = useState<TyphoonData[]>([]);

  // Active storm state (none by default)
  const [activeStormId, setActiveStormId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const [typhoonEnabled, setTyphoonEnabled] = useState(true);
  const [typhoonError, setTyphoonError] = useState<string | null>(null);
  const [typhoonLoading, setTyphoonLoading] = useState<boolean>(false);

  // UI selection state when user clicks a point (not yet active)
  const [selection, setSelection] = useState<{
    stormId: string;
    index: number;
    coords: [number, number];
    date: string;
  } | null>(null);

  // Selected date for storm list (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map using the libremap demo defaults (zoom level/center) but keep OSM tiles
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "raster-tiles": {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "simple-tiles",
            type: "raster",
            source: "raster-tiles",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [112.1, 13.2],
      zoom: 5,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // Function to add flood data to map
    const addFloodDataToMap = (data: FloodGeoJSON) => {
      if (!map.current) return;

      // Check if map is loaded
      if (!map.current.loaded()) {
        map.current.once("load", () => addFloodDataToMap(data));
        return;
      }

      // Add the GeoJSON source
      if (map.current.getSource("flood-hazard")) {
        (
          map.current.getSource("flood-hazard") as maplibregl.GeoJSONSource
        ).setData(data as any);
      } else {
        map.current.addSource("flood-hazard", {
          type: "geojson",
          data: data,
        });

        // Debug: Log first feature to inspect structure
        if (data.features && data.features.length > 0) {
          const sampleFeature = data.features[0];
          console.log("=== Client-side GeoJSON Debug ===");
          console.log("Sample feature:", sampleFeature);
          console.log("Properties:", sampleFeature.properties);
          console.log("Geometry type:", sampleFeature.geometry.type);

          // Check geometry closure
          if (
            sampleFeature.geometry.type === "Polygon" &&
            sampleFeature.geometry.coordinates[0]
          ) {
            const ring = sampleFeature.geometry.coordinates[0];
            const isClosed =
              ring.length > 0 &&
              ring[0][0] === ring[ring.length - 1][0] &&
              ring[0][1] === ring[ring.length - 1][1];
            console.log(
              "Polygon ring closed:",
              isClosed,
              "Ring length:",
              ring.length,
            );
          }

          // Check DEPTH_M property
          console.log("DEPTH_M exists:", "DEPTH_M" in sampleFeature.properties);
          console.log("DEPTH_M value:", sampleFeature.properties.DEPTH_M);
          console.log("DEPTH_M type:", typeof sampleFeature.properties.DEPTH_M);
          console.log("================================");
        }

        // Add fill layer for flood zones
        // Use fill-outline-color for better rendering
        // Note: $type returns 'Polygon' for both Polygon and MultiPolygon, so no filter needed
        map.current.addLayer({
          id: "flood-hazard-fill",
          type: "fill",
          source: "flood-hazard",
          paint: {
            "fill-color": [
              "case",
              ["has", "DEPTH_M"],
              [
                "interpolate",
                ["linear"],
                ["to-number", ["get", "DEPTH_M"]],
                0,
                "#e3f2fd", // 0m - Very Low
                0.5,
                "#90caf9", // 0-0.5m - Low
                1,
                "#42a5f5", // 0.5-1m - Moderate
                2,
                "#1e88e5", // 1-2m - High
                5,
                "#1565c0", // 2-5m - Very High
              ],
              "#42a5f5", // Default blue color if DEPTH_M doesn't exist
            ],
            "fill-opacity": 0.6,
            "fill-outline-color": "#0d47a1",
          },
        });

        // Add click handler for popups
        map.current.on("click", "flood-hazard-fill", (e) => {
          if (!map.current || !e.features || e.features.length === 0) return;

          const feature = e.features[0];
          const properties = feature.properties || {};

          // Create popup content
          const popupContent = Object.entries(properties)
            .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
            .join("<br/>");

          new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(popupContent || "No data available")
            .addTo(map.current);
        });

        // Change cursor on hover
        map.current.on("mouseenter", "flood-hazard-fill", () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = "pointer";
          }
        });

        map.current.on("mouseleave", "flood-hazard-fill", () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = "";
          }
        });
      }

      setIsLoading(false);
    };

    // Fetch flood data
    const fetchFloodData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/cebu-flood-data");

        if (!response.ok) {
          throw new Error(`Failed to fetch flood data: ${response.statusText}`);
        }

        const data: FloodGeoJSON = await response.json();
        setGeoJsonData(data);
        addFloodDataToMap(data);
      } catch (err: any) {
        console.error("Error fetching flood data:", err);
        setError(err.message || "Failed to load flood data");
        setIsLoading(false);
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

  // Fetch storms from Zoom Earth; fallback to bundled data
  // Load storms for a specified date (YYYY-MM-DD)
  const loadStormsFor = async (dateStr: string) => {
    const normalizeStorm = (raw: TyphoonData): TyphoonData | null => {
      if (!raw || !raw.track || !Array.isArray(raw.track)) return null;

      const safeTrack = raw.track
        .map((p) => {
          if (!p || !p.date || !p.coordinates || p.coordinates.length !== 2) {
            return null;
          }
          const parsedDate = new Date(p.date);
          if (!Number.isFinite(parsedDate.getTime())) return null;
          return {
            ...p,
            date: parsedDate.toISOString(),
          };
        })
        .filter(Boolean)
        .sort(
          (a, b) =>
            new Date((a as any).date).getTime() -
            new Date((b as any).date).getTime(),
        ) as TyphoonData["track"];

      if (safeTrack.length === 0) return null;

      return {
        id: raw.id,
        name: raw.name || raw.title || raw.id,
        title: raw.title || raw.name || raw.id,
        description: raw.description,
        season: raw.season,
        max: raw.max,
        track: safeTrack,
        place: raw.place,
        startDate: raw.startDate || safeTrack[0].date,
        endDate: raw.endDate || safeTrack[safeTrack.length - 1].date,
      };
    };

    const fetchStormDetails = async (ids: string[]): Promise<TyphoonData[]> => {
      const details = await Promise.all(
        ids.map(async (stormId) => {
          try {
            const detailRes = await fetch(
              `/api/storms?id=${encodeURIComponent(stormId)}`,
            );
            if (!detailRes.ok)
              throw new Error(`Storm detail failed: ${detailRes.status}`);
            const detailJson = await detailRes.json();
            return normalizeStorm(detailJson as TyphoonData);
          } catch (err) {
            console.warn("Failed to load storm detail", stormId, err);
            return null;
          }
        }),
      );

      return details.filter(Boolean) as TyphoonData[];
    };

    setTyphoonLoading(true);
    try {
      setTyphoonError(null);
      const listRes = await fetch(`/api/storms?date=${dateStr}&to=24`);
      if (!listRes.ok) throw new Error(`Storm list failed: ${listRes.status}`);
      const listJson = await listRes.json();

      const rawList: string[] = Array.isArray(listJson?.storms)
        ? (listJson.storms
            .map((entry: unknown) => {
              if (typeof entry === "string") return entry;
              if (
                entry &&
                typeof entry === "object" &&
                "id" in (entry as any)
              ) {
                return (entry as any).id as string;
              }
              return null;
            })
            .filter(Boolean) as string[])
        : listJson?.storms && typeof listJson.storms === "object"
          ? Object.keys(listJson.storms)
          : [];

      if (rawList.length === 0)
        throw new Error("No storms returned from upstream");

      const stormsData = await fetchStormDetails(rawList);
      if (stormsData.length === 0) throw new Error("No valid storm tracks");

      setStorms(stormsData);
    } catch (err: any) {
      console.error("Storm fetch failed; using fallback", err);
      setTyphoonError("Live storms unavailable; showing fallback track");
      try {
        const fallbackRes = await fetch("/data/tino.json");
        if (!fallbackRes.ok)
          throw new Error(`Fallback fetch failed: ${fallbackRes.status}`);
        const fallback = await fallbackRes.json();
        const normalized = normalizeStorm(fallback as TyphoonData);
        if (!normalized) throw new Error("Fallback storm invalid");
        setStorms([normalized]);
      } catch (fallbackErr: any) {
        console.error("Fallback storm failed:", fallbackErr);
        setTyphoonError(fallbackErr.message || "Failed to load typhoon data");
      }
    } finally {
      setTyphoonLoading(false);
    }
  };

  useEffect(() => {
    // Load storms for initial selected date
    loadStormsFor(selectedDate);
  }, [selectedDate]);

  // Create typhoon layers once the map is ready
  useEffect(() => {
    if (!map.current) return;
    const mapInstance = map.current;

    const disableDeprecatedPixelStoreWarnings = () => {
      const ctx: any = (mapInstance as any)?._painter?.context;
      try {
        ctx?.pixelStoreUnpackPremultiplyAlpha?.set(false);
        ctx?.pixelStoreUnpackFlipY?.set(false);
      } catch (err) {
        console.warn("Failed to disable pixel store flags", err);
      }
    };

    const ensureTyphoonLayers = () => {
      if (!mapInstance.getSource("storm-tracks-all")) {
        mapInstance.addSource("storm-tracks-all", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        });
        mapInstance.addLayer({
          id: "storm-lines-all",
          type: "line",
          source: "storm-tracks-all",
          paint: {
            "line-color": ["get", "color"],
            "line-width": 2,
            "line-opacity": 0.35,
          },
        });
      }

      if (!mapInstance.getSource("storm-points-all")) {
        mapInstance.addSource("storm-points-all", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        });
        mapInstance.addLayer({
          id: "storm-points-all",
          type: "circle",
          source: "storm-points-all",
          paint: {
            "circle-radius": 4,
            "circle-color": ["get", "color"],
            "circle-opacity": 0.3,
            "circle-stroke-width": 1,
            "circle-stroke-color": ["get", "color"],
            "circle-stroke-opacity": 0.3,
          },
        });
      }

      // Active track & point layers (for selected/active storm)
      if (!mapInstance.getSource("storm-track-active")) {
        mapInstance.addSource("storm-track-active", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: { type: "LineString", coordinates: [] },
            properties: {},
          },
        });
        mapInstance.addLayer({
          id: "storm-line-active",
          type: "line",
          source: "storm-track-active",
          paint: {
            "line-color": ["coalesce", ["get", "color"], "#ff4500"],
            "line-width": 4,
            "line-opacity": 0.9,
          },
        });
      }

      if (!mapInstance.getSource("storm-point-active")) {
        mapInstance.addSource("storm-point-active", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        });
        mapInstance.addLayer({
          id: "storm-point-active",
          type: "circle",
          source: "storm-point-active",
          paint: {
            "circle-radius": [
              "+",
              8,
              ["*", ["coalesce", ["feature-state", "pulse"], 0], 6],
            ],
            "circle-color": ["coalesce", ["get", "color"], "#ff4500"],
            "circle-opacity": 0.95,
            "circle-stroke-color": ["coalesce", ["get", "color"], "#ff4500"],
            "circle-stroke-width": [
              "+",
              1.5,
              ["*", ["coalesce", ["feature-state", "pulse"], 0], 1.5],
            ],
          },
        });
      }

      // Bind interactions once
      if (!typhoonInteractionsBound.current) {
        mapInstance.on("click", "storm-points-all", (e) => {
          if (!e.features || e.features.length === 0) return;
          const props: any = e.features[0].properties || {};
          const idx = Number(props.index);
          const id = props.id;
          const coords = e.lngLat.toArray() as [number, number];

          setSelection({
            stormId: id,
            index: idx,
            coords,
            date: props.date || new Date().toISOString(),
          });

          new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(
              `<strong>${props.name || "Storm"}</strong><br/>${props.date || ""}<br/>Wind: ${props.wind || "?"} kt<br/>Pressure: ${props.pressure || "?"} mb`,
            )
            .addTo(mapInstance);
        });

        mapInstance.on("click", "storm-point-active", (e) => {
          if (!e.features || e.features.length === 0) return;
          const props: any = e.features[0].properties || {};
          new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(
              `<strong>${props.name || "Storm"}</strong><br/>${props.date || ""}`,
            )
            .addTo(mapInstance);
        });

        mapInstance.on("mouseenter", "storm-points-all", () => {
          mapInstance.getCanvas().style.cursor = "pointer";
        });

        mapInstance.on("mouseleave", "storm-points-all", () => {
          mapInstance.getCanvas().style.cursor = "";
        });

        typhoonInteractionsBound.current = true;
      }

      setTyphoonLayerVisibility(mapInstance, typhoonEnabled);
    };

    console.log(
      "🌀 Typhoon effect triggered! Storms:",
      storms.length,
      "Map:",
      !!map.current,
    );
    if (!map.current || storms.length === 0) {
      console.log("⚠️ Bailing out - map or storms not ready");
      return;
    }

    const ensureLayersReady = () => {
      ensureTyphoonLayers();
      disableDeprecatedPixelStoreWarnings();
    };

    const applyData = () => {
      console.log("=== Applying typhoon data (no active highlight) ===");
      console.log("Number of storms:", storms.length);

      ensureTyphoonLayers();
      updateAllStorms(mapInstance, storms);

      // Fit map to show all storms
      const allCoords: [number, number][] = [];
      storms.forEach((storm) => {
        storm.track.forEach((point) => {
          allCoords.push(point.coordinates);
        });
      });

      console.log("Total coordinates collected:", allCoords.length);
      if (allCoords.length > 0) {
        const bounds = allCoords.reduce(
          (bounds, coord) => bounds.extend(coord),
          new maplibregl.LngLatBounds(allCoords[0], allCoords[0]),
        );

        console.log("Fitting bounds:", bounds);
        mapInstance.fitBounds(bounds, {
          padding: 50,
          maxZoom: 6,
          duration: 1000,
        });
      }

      console.log("=== Typhoon data applied ===");
    };

    if (mapInstance.loaded()) {
      ensureLayersReady();
      applyData();
    } else {
      mapInstance.once("load", () => {
        ensureLayersReady();
        applyData();
      });
    }
  }, [storms]);

  // Toggle visibility when user flips the switch
  useEffect(() => {
    if (!map.current) return;
    setTyphoonLayerVisibility(map.current, typhoonEnabled);
  }, [typhoonEnabled]);

  // Update active storm display when activeStormId/index changes
  useEffect(() => {
    if (!map.current) return;
    if (!activeStormId) {
      updateActiveStorm(map.current, null);
      return;
    }
    const storm = storms.find((s) => s.id === activeStormId) || null;
    updateActiveStorm(map.current, storm, activeIndex);
  }, [activeStormId, activeIndex, storms]);

  return (
    <div className={`relative w-full h-full ${className || ""}`}>
      <div ref={mapContainer} className="w-full h-full" />
      <LocationSearch map={map.current} />
      <div className="absolute top-24 left-4 z-10 space-y-2 w-64">
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
            aria-label="Typhoon date"
            disabled={typhoonLoading}
          />

          <button
            onClick={() => loadStormsFor(selectedDate)}
            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm border flex items-center gap-2"
            disabled={typhoonLoading}
          >
            {typhoonLoading ? (
              <svg
                className="h-4 w-4 animate-spin text-gray-700"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeOpacity="0.25"
                  strokeWidth="4"
                />
                <path
                  d="M22 12a10 10 0 00-10-10"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              "Refresh"
            )}
          </button>

          <button
            onClick={() => setTyphoonEnabled((prev) => !prev)}
            className="ml-auto px-4 py-2 rounded-lg shadow-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium"
          >
            {typhoonEnabled ? "Hide Typhoon Tracks" : "Show Typhoon Tracks"}
          </button>
        </div>
        {typhoonError && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded">
            <p className="text-xs font-semibold">Typhoon data note</p>
            <p className="text-xs">{typhoonError}</p>
          </div>
        )}
        {storms.length > 0 && (
          <div className="bg-white border border-gray-200 px-3 py-2 rounded shadow-sm text-xs text-gray-700">
            <div className="font-semibold mb-1">
              Storms loaded: {storms.length}
            </div>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {storms.map((s) => (
                <div key={s.id} className="flex justify-between">
                  <span className="truncate" title={s.title || s.name}>
                    {s.title || s.name}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {s.track.length} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selection UI shown when user clicks a point (not yet activated) */}
      {selection && (
        <div className="absolute top-48 left-4 z-20 bg-white border p-3 rounded shadow-sm text-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold">{selection.date}</div>
              <div className="text-xs text-gray-500">
                Click Activate to center & highlight
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveStormId(selection.stormId);
                  setActiveIndex(selection.index);
                  setSelection(null);
                }}
                className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
              >
                Activate
              </button>
              <button
                onClick={() => setSelection(null)}
                className="px-2 py-1 border rounded text-sm"
                aria-label="Close selection"
              >
                X
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active storm UI centered with arrow and date/time */}
      {activeStormId &&
        (() => {
          const storm = storms.find((s) => s.id === activeStormId);
          const point = storm ? storm.track[activeIndex] : undefined;
          const label = point ? new Date(point.date).toLocaleString() : "";
          const hasPrev = storm ? activeIndex > 0 : false;
          const hasNext = storm ? activeIndex < storm.track.length - 1 : false;
          const windDisplay = point?.wind ? `${point.wind} kt` : "";
          const activeColor = point ? windToColor(point.wind) : "#ff4500";

          const goPrev = () => {
            if (!storm) return;
            setActiveIndex((idx) => Math.max(0, idx - 1));
          };

          const goNext = () => {
            if (!storm) return;
            setActiveIndex((idx) => Math.min(storm.track.length - 1, idx + 1));
          };

          return (
            <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center z-30">
              <div className="pointer-events-auto relative flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 pr-14 shadow-lg min-w-[260px]">
                <button
                  onClick={() => {
                    setActiveStormId(null);
                    setActiveIndex(0);
                  }}
                  className="absolute right-3 top-2 h-9 w-9 rounded-full border border-gray-200 bg-white text-base font-semibold text-gray-700 shadow hover:bg-gray-50"
                  aria-label="Close typhoon overlay"
                >
                  ×
                </button>
                <button
                  onClick={goPrev}
                  disabled={!hasPrev}
                  className="h-8 w-8 rounded border border-gray-200 text-lg leading-none text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white"
                  aria-label="Previous typhoon point"
                >
                  ‹
                </button>
                <div className="flex flex-col items-center text-sm">
                  <div className="font-semibold text-gray-800">
                    {storm?.title || storm?.name || "Typhoon"}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: activeColor }}
                    />
                    <span>{windDisplay}</span>
                  </div>
                  <div className="text-xs text-gray-600">{label || ""}</div>
                </div>
                <button
                  onClick={goNext}
                  disabled={!hasNext}
                  className="h-8 w-8 rounded border border-gray-200 text-lg leading-none text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white"
                  aria-label="Next typhoon point"
                >
                  ›
                </button>
              </div>
            </div>
          );
        })()}

      {isLoading && (
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

// Helpers
let activePulseFrame: number | null = null;

function colorFromId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const r = (hash >> 0) & 0xff;
  const g = (hash >> 8) & 0xff;
  const b = (hash >> 16) & 0xff;
  return `rgb(${r % 200}, ${g % 200}, ${b % 200})`;
}

function windToColor(wind: unknown): string {
  const n = typeof wind === "string" ? Number(wind) : wind;
  const speed = typeof n === "number" && Number.isFinite(n) ? n : null;

  if (speed === null) return "#9e9e9e"; // unknown -> neutral gray
  if (speed >= 137) return "#b71c1c"; // Cat 5
  if (speed >= 113) return "#d84315"; // Cat 4
  if (speed >= 96) return "#ef6c00"; // Cat 3
  if (speed >= 83) return "#f9a825"; // Cat 2
  if (speed >= 64) return "#fdd835"; // Cat 1
  if (speed >= 34) return "#1e88e5"; // Tropical storm
  return "#4fc3f7"; // Depression / low
}

function setTyphoonLayerVisibility(
  mapInstance: maplibregl.Map,
  visible: boolean,
) {
  const layers = ["storm-lines-all", "storm-points-all"];
  layers.forEach((layerId) => {
    if (mapInstance.getLayer(layerId)) {
      mapInstance.setLayoutProperty(
        layerId,
        "visibility",
        visible ? "visible" : "none",
      );
    }
  });
}

function updateAllStorms(mapInstance: maplibregl.Map, storms: TyphoonData[]) {
  ensureTyphoonSources(mapInstance);

  console.log("updateAllStorms called with", storms.length, "storms");

  const lineFeatures = storms.map((storm) => ({
    type: "Feature" as const,
    geometry: {
      type: "LineString" as const,
      coordinates: expandTrack(storm.track),
    },
    properties: {
      id: storm.id,
      name: storm.name,
      color: colorFromId(storm.id),
    },
  }));

  console.log("Created", lineFeatures.length, "line features");

  const pointFeatures = storms.flatMap((storm) =>
    storm.track.map((point, idx) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: point.coordinates },
      properties: {
        id: storm.id,
        name: storm.name,
        index: idx,
        wind: point.wind,
        pressure: point.pressure,
        description: point.description,
        date: new Date(point.date).toLocaleString(),
        color: windToColor(point.wind),
      },
    })),
  );

  console.log("Created", pointFeatures.length, "point features");

  const tracksSource = mapInstance.getSource("storm-tracks-all") as
    | maplibregl.GeoJSONSource
    | undefined;
  if (tracksSource) {
    console.log("Setting line data on storm-tracks-all");
    tracksSource.setData({ type: "FeatureCollection", features: lineFeatures });
  } else {
    console.warn("storm-tracks-all source not found!");
  }

  const pointsSource = mapInstance.getSource("storm-points-all") as
    | maplibregl.GeoJSONSource
    | undefined;
  if (pointsSource) {
    console.log("Setting point data on storm-points-all");
    pointsSource.setData({
      type: "FeatureCollection",
      features: pointFeatures,
    });
  } else {
    console.warn("storm-points-all source not found!");
  }

  console.log("Checking layer visibility...");
  const layers = ["storm-lines-all", "storm-points-all"];
  layers.forEach((layerId) => {
    if (mapInstance.getLayer(layerId)) {
      const visibility = mapInstance.getLayoutProperty(layerId, "visibility");
      console.log(`Layer ${layerId} visibility:`, visibility);
    } else {
      console.warn(`Layer ${layerId} not found!`);
    }
  });
}

function expandTrack(track: TyphoonData["track"]): [number, number][] {
  const coords: [number, number][] = [];
  track.forEach((p) => {
    if (p.spline && p.spline.length > 0) {
      coords.push(...p.spline);
    } else {
      coords.push(p.coordinates);
    }
  });
  return coords;
}

function updateActiveStorm(
  mapInstance: maplibregl.Map | null,
  storm: TyphoonData | null,
  idx?: number,
) {
  if (!mapInstance) return;

  const trackSource = mapInstance.getSource("storm-track-active") as
    | maplibregl.GeoJSONSource
    | undefined;
  const pointSource = mapInstance.getSource("storm-point-active") as
    | maplibregl.GeoJSONSource
    | undefined;

  const stopActivePulse = () => {
    if (activePulseFrame) {
      cancelAnimationFrame(activePulseFrame);
      activePulseFrame = null;
    }
    if (
      mapInstance.isStyleLoaded() &&
      mapInstance.getSource("storm-point-active")
    ) {
      try {
        mapInstance.setFeatureState(
          { source: "storm-point-active", id: "active-point" },
          { pulse: 0 },
        );
      } catch (err) {
        console.warn("Failed to reset pulse state", err);
      }
    }
  };

  const startActivePulse = () => {
    stopActivePulse();
    if (
      !mapInstance.isStyleLoaded() ||
      !mapInstance.getSource("storm-point-active")
    ) {
      return;
    }
    const animate = (ts: number) => {
      if (!mapInstance.isStyleLoaded()) return;
      const pulse = (Math.sin(ts / 400) + 1) / 2;
      try {
        mapInstance.setFeatureState(
          { source: "storm-point-active", id: "active-point" },
          { pulse },
        );
      } catch (err) {
        console.warn("Failed to update pulse state", err);
        return;
      }
      activePulseFrame = requestAnimationFrame(animate);
    };
    activePulseFrame = requestAnimationFrame(animate);
  };

  if (!storm) {
    stopActivePulse();
    trackSource?.setData({
      type: "Feature",
      geometry: { type: "LineString", coordinates: [] },
      properties: {},
    } as any);
    pointSource?.setData({ type: "FeatureCollection", features: [] } as any);
    return;
  }

  const coords = expandTrack(storm.track);
  const activePoint = storm.track[idx ?? 0];
  const activeColor = windToColor(activePoint.wind);
  trackSource?.setData({
    type: "Feature",
    geometry: { type: "LineString", coordinates: coords },
    properties: { id: storm.id, name: storm.name, color: activeColor },
  } as any);

  const pointFeature = {
    type: "Feature" as const,
    geometry: { type: "Point" as const, coordinates: activePoint.coordinates },
    properties: {
      id: storm.id,
      name: storm.name,
      index: idx ?? 0,
      wind: activePoint.wind,
      pressure: activePoint.pressure,
      date: new Date(activePoint.date).toLocaleString(),
      color: activeColor,
    },
  };

  pointSource?.setData({
    type: "FeatureCollection",
    features: [pointFeature],
  } as any);

  // Center map on active point for the UI arrow to point to
  try {
    mapInstance.easeTo({
      center: activePoint.coordinates,
      zoom: Math.max(mapInstance.getZoom(), 6),
      duration: 800,
    });
  } catch (err) {
    console.warn("Failed to center map on active point", err);
  }
}

// Ensure typhoon sources exist even if layer-setup effect runs late
function ensureTyphoonSources(mapInstance: maplibregl.Map) {
  if (!mapInstance.getSource("storm-tracks-all")) {
    mapInstance.addSource("storm-tracks-all", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });
  }
  if (!mapInstance.getSource("storm-points-all")) {
    mapInstance.addSource("storm-points-all", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });
  }
}
