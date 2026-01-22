"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";

export type HazardCategory =
  | "flood"
  | "storm-surge"
  | "landslide";
import { TyphoonData } from "@/types/typhoon";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import LocationSearch from "./LocationSearch";
import { LayerControls } from "./LayerControls";
import {
  useCensusData,
  useEvacuationCenters,
  useBarangaysByProvince,
} from "@/lib/api/geojson";
import type { SicknessType } from "@/types/geojson";
import { SICKNESS_COLORS } from "@/types/geojson";

interface MapViewProps {
  category: HazardCategory;
}

// Cebu City coordinates
const CEBU_CENTER: [number, number] = [123.8854, 10.3157];
const DEFAULT_ZOOM = 11;

export function MapView({ category }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const typhoonInteractionsBound = useRef(false);

  const [storms, setStorms] = useState<TyphoonData[]>([]);
  const [typhoonEnabled, setTyphoonEnabled] = useState(true);
  const [typhoonLoading, setTyphoonLoading] = useState(false);

  // Active storm state
  const [activeStormId, setActiveStormId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Date picker state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [stormDrawerOpen, setStormDrawerOpen] = useState(false);

  // Layer toggle state
  const [censusEnabled, setCensusEnabled] = useState(false);
  const [evacuationCentersEnabled, setEvacuationCentersEnabled] =
    useState(false);
  const [barangayEnabled, setBarangayEnabled] = useState(false);

  // Health risk selection state
  const [selectedSickness, setSelectedSickness] =
    useState<SicknessType>("leptospirosis");
  const [selectedProvince, setSelectedProvince] = useState<string | null>(
    "Cebu"
  );

  // Layer controls drawer state
  const [layerDrawerOpen, setLayerDrawerOpen] = useState(false);

  const activePulseFrame = useRef<number | null>(null);

  // Fetch data using TanStack Query
  const { data: censusData } = useCensusData();
  const { data: evacuationCentersData } = useEvacuationCenters(true);
  const { data: barangayData } = useBarangaysByProvince(selectedProvince);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map centered on Cebu
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
    });

    // Add navigation controls (compact for mobile)
    map.current.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right",
    );

    // Load initial typhoon data
    loadStormsFor(selectedDate);

    return () => {
      if (activePulseFrame.current) {
        cancelAnimationFrame(activePulseFrame.current);
      }
      map.current?.remove();
      map.current = null;
    };
  }, []);

  const loadStormsFor = async (date: Date) => {
    setTyphoonLoading(true);
    try {
      const dateStr = date.toISOString().split("T")[0];
      const response = await fetch(`/api/storms?date=${dateStr}&to=24`);

      if (response.ok) {
        const data = await response.json();
        const stormIds: string[] = Array.isArray(data?.storms)
          ? data.storms.filter((s: unknown) => typeof s === "string")
          : [];

        if (stormIds.length > 0) {
          const stormDetails = await Promise.all(
            stormIds.map(async (id) => {
              const res = await fetch(
                `/api/storms?id=${encodeURIComponent(id)}`,
              );
              if (!res.ok) return null;
              const stormData = await res.json();
              return normalizeStorm(stormData);
            }),
          );
          const validStorms = stormDetails.filter(Boolean) as TyphoonData[];
          setStorms(validStorms);
          setTyphoonLoading(false);
          return;
        }
      }

      // Fallback to tino.json
      const fallback = await fetch("/data/tino.json");
      if (fallback.ok) {
        const data = await fallback.json();
        const normalized = normalizeStorm(data);
        setStorms(normalized ? [normalized] : []);
      }
    } catch (error) {
      console.error("Failed to load typhoon data:", error);
      // Try fallback
      try {
        const fallback = await fetch("/data/tino.json");
        if (fallback.ok) {
          const data = await fallback.json();
          const normalized = normalizeStorm(data);
          setStorms(normalized ? [normalized] : []);
        }
      } catch (e) {
        console.error("Fallback failed:", e);
      }
    } finally {
      setTyphoonLoading(false);
    }
  };

  // Normalize storm data
  const normalizeStorm = (storm: TyphoonData): TyphoonData | null => {
    if (!storm?.track || !Array.isArray(storm.track)) return null;

    // Validate and sort track points
    const validTrack = storm.track
      .filter((p) => {
        if (!p.coordinates || p.coordinates.length !== 2) return false;
        const [lng, lat] = p.coordinates;
        if (typeof lng !== "number" || typeof lat !== "number") return false;
        if (!Number.isFinite(lng) || !Number.isFinite(lat)) return false;
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      });

    if (validTrack.length === 0) return null;

    return { ...storm, track: validTrack };
  };

  // Create 4-layer typhoon system when storms are loaded
  useEffect(() => {
    if (!map.current || storms.length === 0) return;

    const mapInstance = map.current;

    const ensureTyphoonLayers = () => {
      // Layer 1: All storm tracks (low opacity)
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

      // Layer 2: All storm points (clickable)
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

      // Layer 3: Active storm track (highlighted)
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

      // Layer 4: Active storm point with pulse animation
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

      // Bind click interactions once
      if (!typhoonInteractionsBound.current) {
        mapInstance.on("click", "storm-points-all", (e) => {
          if (!e.features || e.features.length === 0) return;
          const props: any = e.features[0].properties || {};
          const idx = Number(props.index);
          const id = props.id;
          const date = props.date || new Date().toISOString();

          // Show toast notification for activation
          toast.info(
            <div className="flex items-center gap-3">
              <div>
                <p className="font-semibold">{date}</p>
                <p className="text-xs text-gray-500">
                  Tap to activate and track
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setActiveStormId(id);
                  setActiveIndex(idx);
                  toast.dismiss();
                }}
                className="bg-[#6B1515] hover:bg-[#6B1515]/90"
              >
                Activate
              </Button>
            </div>,
            { duration: 5000 },
          );

          new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(
              `<strong>${props.name || "Storm"}</strong><br/>${props.date || ""}<br/>Wind: ${props.wind || "?"} kt<br/>Pressure: ${props.pressure || "?"} mb`,
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
    };

    const applyStormData = () => {
      ensureTyphoonLayers();

      // Update all storms layers
      const lineFeatures = storms.map((storm) => ({
        type: "Feature" as const,
        geometry: {
          type: "LineString" as const,
          coordinates: storm.track.map((p) => p.coordinates),
        },
        properties: {
          id: storm.id,
          name: storm.name,
          color: colorFromId(storm.id),
        },
      }));

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
            date: new Date(point.date).toLocaleString(),
            color: windToColor(point.wind),
          },
        })),
      );

      (
        mapInstance.getSource("storm-tracks-all") as maplibregl.GeoJSONSource
      )?.setData({
        type: "FeatureCollection",
        features: lineFeatures,
      });

      (
        mapInstance.getSource("storm-points-all") as maplibregl.GeoJSONSource
      )?.setData({
        type: "FeatureCollection",
        features: pointFeatures,
      });

      // Set visibility based on category and toggle
      const showStorms =
        typhoonEnabled &&
        (category === "storm-surge" || category === "rainfall");
      setTyphoonLayerVisibility(mapInstance, showStorms);
    };

    if (mapInstance.loaded()) {
      applyStormData();
    } else {
      mapInstance.once("load", applyStormData);
    }
  }, [storms, typhoonEnabled, category]);

  // Update active storm display
  useEffect(() => {
    if (!map.current) return;
    if (!activeStormId) {
      updateActiveStorm(map.current, null, activePulseFrame);
      return;
    }
    const storm = storms.find((s) => s.id === activeStormId) || null;
    updateActiveStorm(map.current, storm, activePulseFrame, activeIndex);
  }, [activeStormId, activeIndex, storms]);

  // Handle category changes
  useEffect(() => {
    if (!map.current) return;
    const mapInstance = map.current;

    if (mapInstance.loaded()) {
      // Typhoon visibility
      const showStorms =
        typhoonEnabled &&
        (category === "storm-surge" || category === "rainfall");
      setTyphoonLayerVisibility(mapInstance, showStorms);
    }
  }, [category, typhoonEnabled]);

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setDatePickerOpen(false);
    loadStormsFor(date);
  };

  const handleStormSelect = (stormId: string) => {
    setActiveStormId(stormId);
    setActiveIndex(0);
    setStormDrawerOpen(false);
  };

  const activeStorm = storms.find((s) => s.id === activeStormId);
  const activePoint = activeStorm ? activeStorm.track[activeIndex] : undefined;
  const windDisplay = activePoint?.wind ? `${activePoint.wind} kt` : "";
  const activeColor = activePoint ? windToColor(activePoint.wind) : "#ff4500";
  const hasPrev = activeStorm ? activeIndex > 0 : false;
  const hasNext = activeStorm
    ? activeIndex < activeStorm.track.length - 1
    : false;

  const goPrev = () => {
    if (!activeStorm) return;
    setActiveIndex((idx) => Math.max(0, idx - 1));
  };

  const goNext = () => {
    if (!activeStorm) return;
    setActiveIndex((idx) => Math.min(activeStorm.track.length - 1, idx + 1));
  };

  // Add census layer
  useEffect(() => {
    if (!map.current || !censusData || !censusEnabled) {
      if (map.current?.getLayer("census-layer")) {
        map.current.setLayoutProperty("census-layer", "visibility", "none");
      }
      return;
    }

    const mapInstance = map.current;

    const addCensusLayer = () => {
      if (mapInstance.getSource("census-source")) {
        (
          mapInstance.getSource("census-source") as maplibregl.GeoJSONSource
        ).setData(censusData as any);
        mapInstance.setLayoutProperty("census-layer", "visibility", "visible");
        return;
      }

      mapInstance.addSource("census-source", {
        type: "geojson",
        data: censusData as any,
      });

      mapInstance.addLayer({
        id: "census-layer",
        type: "fill",
        source: "census-source",
        paint: {
          "fill-color": [
            "case",
            ["get", "risk_status"],
            [
              "match",
              ["get", "risk_status"],
              1,
              "#ef4444",
              2,
              "#f97316",
              3,
              "#eab308",
              "#22c55e",
            ],
            "#94a3b8",
          ],
          "fill-opacity": 0.5,
          "fill-outline-color": "#64748b",
        },
      });

      mapInstance.on("click", "census-layer", (e) => {
        if (!e.features || e.features.length === 0) return;
        const props = e.features[0].properties || {};
        const popup = new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `<div>
              <strong>Census Data</strong><br/>
              Total Population: ${props.total_pop || "N/A"}<br/>
              Elderly Count: ${props.elderly_count || "N/A"}<br/>
              Stories: ${props.stories || "N/A"}<br/>
              Risk Status: ${props.risk_status || "N/A"}
            </div>`
          )
          .addTo(mapInstance);
      });
    };

    if (mapInstance.loaded()) {
      addCensusLayer();
    } else {
      mapInstance.once("load", addCensusLayer);
    }
  }, [censusData, censusEnabled]);

  // Add evacuation centers layer
  useEffect(() => {
    if (!map.current || !evacuationCentersData || !evacuationCentersEnabled) {
      if (map.current?.getLayer("evacuation-centers-layer")) {
        map.current.setLayoutProperty(
          "evacuation-centers-layer",
          "visibility",
          "none"
        );
      }
      return;
    }

    const mapInstance = map.current;

    const addEvacuationCentersLayer = () => {
      if (mapInstance.getSource("evacuation-centers-source")) {
        (
          mapInstance.getSource(
            "evacuation-centers-source"
          ) as maplibregl.GeoJSONSource
        ).setData(evacuationCentersData as any);
        mapInstance.setLayoutProperty(
          "evacuation-centers-layer",
          "visibility",
          "visible"
        );
        return;
      }

      mapInstance.addSource("evacuation-centers-source", {
        type: "geojson",
        data: evacuationCentersData as any,
      });

      mapInstance.addLayer({
        id: "evacuation-centers-layer",
        type: "circle",
        source: "evacuation-centers-source",
        paint: {
          "circle-radius": 8,
          "circle-color": "#10b981",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
          "circle-opacity": 0.8,
        },
      });

      mapInstance.on("click", "evacuation-centers-layer", (e) => {
        if (!e.features || e.features.length === 0) return;
        const props = e.features[0].properties || {};
        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `<div>
              <strong>${props.name || "Evacuation Center"}</strong><br/>
              Capacity: ${props.max_occupancy || "N/A"}<br/>
              Current: ${props.current_occupancy || "N/A"}<br/>
              Occupancy: ${props.occupancy_percentage || 0}%<br/>
              WiFi: ${props.has_wifi ? "Yes" : "No"}
            </div>`
          )
          .addTo(mapInstance);
      });
    };

    if (mapInstance.loaded()) {
      addEvacuationCentersLayer();
    } else {
      mapInstance.once("load", addEvacuationCentersLayer);
    }
  }, [evacuationCentersData, evacuationCentersEnabled]);

  // Add barangay layer with health risks
  useEffect(() => {
    if (!map.current || !barangayData || !barangayEnabled) {
      if (map.current?.getLayer("barangay-layer")) {
        map.current.setLayoutProperty("barangay-layer", "visibility", "none");
      }
      return;
    }

    const mapInstance = map.current;
    const sicknessColor = SICKNESS_COLORS[selectedSickness];

    // Process barangay data to add computed opacity property
    const processedData = {
      ...barangayData,
      features: barangayData.features.map((feature: any) => {
        const props = feature.properties || {};
        const healthRisks = props.health_risks || {};
        const sicknessRisk = healthRisks[selectedSickness] || {};
        const regressionScore = sicknessRisk.regression_score || 0;

        return {
          ...feature,
          properties: {
            ...props,
            _computed_opacity: regressionScore,
            _computed_color: sicknessColor,
          },
        };
      }),
    };

    const addBarangayLayer = () => {
      const source = mapInstance.getSource("barangay-source") as
        | maplibregl.GeoJSONSource
        | undefined;

      if (source) {
        source.setData(processedData as any);
        mapInstance.setLayoutProperty("barangay-layer", "visibility", "visible");
        // Update paint properties
        mapInstance.setPaintProperty(
          "barangay-layer",
          "fill-color",
          sicknessColor
        );
        return;
      }

      mapInstance.addSource("barangay-source", {
        type: "geojson",
        data: processedData as any,
      });

      mapInstance.addLayer({
        id: "barangay-layer",
        type: "fill",
        source: "barangay-source",
        paint: {
          "fill-color": ["get", "_computed_color"],
          "fill-opacity": [
            "coalesce",
            ["get", "_computed_opacity"],
            0.3,
          ],
          "fill-outline-color": "#000",
        },
      });

      mapInstance.on("click", "barangay-layer", (e) => {
        if (!e.features || e.features.length === 0) return;
        const props = e.features[0].properties || {};
        const healthRisks = props.health_risks || {};
        const sicknessRisk = healthRisks[selectedSickness] || {};

        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `<div>
              <strong>${props.NAME_3 || "Barangay"}</strong><br/>
              Province: ${props.PROVINCE || "N/A"}<br/>
              <hr/>
              <strong>Health Risk</strong><br/>
              ${selectedSickness}: ${sicknessRisk.regression_score || "N/A"}<br/>
              Risk Level: ${sicknessRisk.risk_level || "N/A"}
            </div>`
          )
          .addTo(mapInstance);
      });
    };

    if (mapInstance.loaded()) {
      addBarangayLayer();
    } else {
      mapInstance.once("load", addBarangayLayer);
    }
  }, [barangayData, barangayEnabled, selectedSickness]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Layer Controls */}
      <LayerControls
        censusEnabled={censusEnabled}
        evacuationCentersEnabled={evacuationCentersEnabled}
        barangayEnabled={barangayEnabled}
        onCensusToggle={setCensusEnabled}
        onEvacuationCentersToggle={setEvacuationCentersEnabled}
        onBarangayToggle={setBarangayEnabled}
        selectedSickness={selectedSickness}
        onSicknessChange={setSelectedSickness}
        open={layerDrawerOpen}
        onOpenChange={setLayerDrawerOpen}
      />

      {/* Location Search */}
      <LocationSearch map={map.current} drawerOpen={layerDrawerOpen} />

      {/* Date Picker Popover - Top Right */}
      <div className="absolute top-4 right-16 z-10 flex gap-2">
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-11 w-11 bg-white shadow-lg border-gray-300"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              disabled={(date) => date > new Date()}
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="sm"
          onClick={() => loadStormsFor(selectedDate)}
          disabled={typhoonLoading}
          className="h-11 w-11 bg-white shadow-lg border-gray-300"
        >
          <RefreshCw
            className={`h-4 w-4 ${typhoonLoading ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      {/* Storm List Drawer - Bottom Right */}
      {storms.length > 0 &&
        (category === "storm-surge" || category === "rainfall") && (
          <Drawer open={stormDrawerOpen} onOpenChange={setStormDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                className="fixed bottom-20 right-4 z-20 shadow-lg bg-[#6B1515] hover:bg-[#6B1515]/90"
                size="sm"
              >
                <Badge variant="secondary" className="mr-2">
                  {storms.length}
                </Badge>
                Storms
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Active Storms ({storms.length})</DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="max-h-[60vh] px-4 pb-4">
                <div className="space-y-2">
                  {storms.map((storm) => (
                    <button
                      key={storm.id}
                      onClick={() => handleStormSelect(storm.id)}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-[#6B1515]/10 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">
                            {storm.title || storm.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {storm.track.length} track points
                          </div>
                        </div>
                        {activeStormId === storm.id && (
                          <Badge className="bg-[#6B1515]">Active</Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </DrawerContent>
          </Drawer>
        )}

      {/* Active Storm Navigation - Bottom Center */}
      {activeStormId && activeStorm && (
        <div className="absolute inset-x-0 bottom-19 flex justify-center z-30">
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur rounded-full px-3 py-2 shadow-lg border min-w-60">
            <button
              onClick={goPrev}
              disabled={!hasPrev}
              className="h-11 w-11 rounded-full border border-gray-200 text-lg leading-none text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white flex items-center justify-center"
              aria-label="Previous storm point"
            >
              ‹
            </button>
            <div className="flex flex-col items-center text-xs flex-1">
              <div className="font-semibold text-gray-800 truncate max-w-30">
                {activeStorm.title || activeStorm.name}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-600">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: activeColor }}
                />
                <span>{windDisplay}</span>
              </div>
              {activePoint && (
                <div className="text-[10px] text-gray-600">
                  {new Date(activePoint.date).toLocaleString()}
                </div>
              )}
            </div>
            <button
              onClick={goNext}
              disabled={!hasNext}
              className="h-11 w-11 rounded-full border border-gray-200 text-lg leading-none text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white flex items-center justify-center"
              aria-label="Next storm point"
            >
              ›
            </button>
            <button
              onClick={() => {
                setActiveStormId(null);
                setActiveIndex(0);
              }}
              className="h-11 w-11 rounded-full border border-gray-200 text-lg leading-none text-gray-700 hover:bg-gray-50 flex items-center justify-center ml-1"
              aria-label="Close storm tracking"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
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
  const layers = [
    "storm-lines-all",
    "storm-points-all",
    "storm-line-active",
    "storm-point-active",
  ];
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

function updateActiveStorm(
  mapInstance: maplibregl.Map | null,
  storm: TyphoonData | null,
  pulseFrameRef: React.MutableRefObject<number | null>,
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
    if (pulseFrameRef.current) {
      cancelAnimationFrame(pulseFrameRef.current);
      pulseFrameRef.current = null;
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
      pulseFrameRef.current = requestAnimationFrame(animate);
    };
    pulseFrameRef.current = requestAnimationFrame(animate);
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

  const coords = storm.track.map((p) => p.coordinates);
  const activePoint = storm.track[idx ?? 0];
  const activeColor = windToColor(activePoint.wind);

  trackSource?.setData({
    type: "Feature",
    geometry: { type: "LineString", coordinates: coords },
    properties: { id: storm.id, name: storm.name, color: activeColor },
  } as any);

  const pointFeature = {
    type: "Feature" as const,
    id: "active-point",
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

  // Center map on active point
  try {
    mapInstance.easeTo({
      center: activePoint.coordinates,
      zoom: Math.max(mapInstance.getZoom(), 10),
      duration: 800,
    });
  } catch (err) {
    console.warn("Failed to center map on active point", err);
  }

  startActivePulse();
}
