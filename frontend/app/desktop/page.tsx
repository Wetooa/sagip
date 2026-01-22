"use client";

import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { MapView } from "@/components/desktop/MapView";
import { LayerControls } from "@/components/desktop/LayerControls";
import LocationSearch from "@/components/desktop/LocationSearch";
import { Legend } from "@/components/Legend";
export type HazardCategory =
  | "flood"
  | "storm-surge"
  | "landslide";
import maplibregl from "maplibre-gl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import type { SicknessType } from "@/types/geojson";

export default function DesktopPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<HazardCategory>("flood");
  const [showLegend, setShowLegend] = useState(true);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // Layer toggle state
  const [censusEnabled, setCensusEnabled] = useState(false);
  const [evacuationCentersEnabled, setEvacuationCentersEnabled] =
    useState(false);
  const [barangayEnabled, setBarangayEnabled] = useState(false);

  // Health risk selection state
  const [selectedSickness, setSelectedSickness] =
    useState<SicknessType>("leptospirosis");

  const handleMapReady = (map: maplibregl.Map | null) => {
    mapRef.current = map;
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Header />
        <div className="flex items-center gap-4">
          <LocationSearch map={mapRef.current} />
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 w-10 bg-white shadow-sm border-gray-300"
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={new Date()}
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-10 bg-white shadow-sm border-gray-300"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <LayerControls
          censusEnabled={censusEnabled}
          evacuationCentersEnabled={evacuationCentersEnabled}
          barangayEnabled={barangayEnabled}
          onCensusToggle={setCensusEnabled}
          onEvacuationCentersToggle={setEvacuationCentersEnabled}
          onBarangayToggle={setBarangayEnabled}
          selectedSickness={selectedSickness}
          onSicknessChange={setSelectedSickness}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Map Area */}
        <div className="flex-1 relative">
          <MapView
            category={selectedCategory}
            censusEnabled={censusEnabled}
            evacuationCentersEnabled={evacuationCentersEnabled}
            barangayEnabled={barangayEnabled}
            selectedSickness={selectedSickness}
            onMapReady={handleMapReady}
          />

          {showLegend && (
            <div className="absolute bottom-4 right-4 z-10">
              <Legend
                category={selectedCategory}
                onClose={() => setShowLegend(false)}
              />
            </div>
          )}

          <button
            onClick={() => setShowLegend(!showLegend)}
            className="absolute bottom-4 right-4 bg-[#6B1515]/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg shadow-lg z-10 text-xs font-medium"
          >
            {showLegend ? "Hide" : "Show"} Legend
          </button>
        </div>
      </div>
    </div>
  );
}
