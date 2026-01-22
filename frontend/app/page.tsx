"use client";

import { MapView } from "@/components/MapView";
import { useState } from "react";
import { Legend } from "@/components/Legend";
import { ChevronLeft, Droplets, Waves, Mountain, Cloud, Building2, Layers, MapPin, Route, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export type HazardCategory =
  | "flood"
  | "storm-surge"
  | "landslide"
  | "rainfall"
  | "buildings"
  | "elevation"
  | "facilities"
  | "roads";

export default function HazardMapPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<HazardCategory>("flood");
  const [showLegend, setShowLegend] = useState(true);

  const hazardLayers = [
    { id: "flood" as HazardCategory, label: "Flood", icon: Droplets },
    { id: "storm-surge" as HazardCategory, label: "Storm Surge", icon: Waves },
    { id: "landslide" as HazardCategory, label: "Landslide", icon: Mountain },
    { id: "rainfall" as HazardCategory, label: "Rainfall", icon: Cloud },
    { id: "buildings" as HazardCategory, label: "Buildings", icon: Building2 },
    { id: "elevation" as HazardCategory, label: "Terrain", icon: Layers },
    { id: "facilities" as HazardCategory, label: "Facilities", icon: MapPin },
    { id: "roads" as HazardCategory, label: "Roads", icon: Route },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="relative w-full max-w-sm">
        {/* Phone Bezel */}
        <div className="rounded-[3rem] border-[12px] border-[#1a1a1a] shadow-2xl overflow-hidden bg-black">
          {/* Status Bar */}
          <div className="bg-[#1a1a1a] text-white px-6 py-2 flex justify-between items-center text-xs font-semibold">
            <span>9:41</span>
            <div className="flex gap-1">
              <span>📶</span>
              <span>📡</span>
              <span>🔋</span>
            </div>
          </div>

          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-[#1a1a1a] rounded-b-3xl z-10"></div>

          {/* Screen Content */}
          <div
            className="bg-gradient-to-br from-[#0f172a] via-[#1a1f35] to-[#111827] overflow-hidden relative flex flex-col"
            style={{ height: "844px" }}
          >
            {/* Header */}
            <header className="bg-gradient-to-r from-[#8B0000]/20 to-[#6B1515]/20 backdrop-blur-md text-white px-4 py-3 shadow-lg flex-shrink-0 border-b border-white/10 relative z-10">
              <div className="flex items-center justify-between">
                <Link 
                  href="/home"
                  className="flex items-center gap-2 text-[#F5E6C8]/70 hover:text-[#F5E6C8] transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm">Back</span>
                </Link>
                <span className="text-sm font-medium text-white">Hazard Map</span>
                <div className="w-16"></div>
              </div>
            </header>

            {/* Map Content */}
            <div className="flex-1 relative overflow-hidden">
              <MapView category={selectedCategory} hideControls />

              {showLegend && (
                <Legend
                  category={selectedCategory}
                  onClose={() => setShowLegend(false)}
                />
              )}
            </div>

            {/* Bottom Navigation - Hazard Layer Selector */}
            <div className="bg-gradient-to-t from-[#0f172a]/98 to-[#1a1f35]/90 backdrop-blur-xl border-t border-white/10 px-2 py-3">
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {hazardLayers.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedCategory(id)}
                    className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all min-w-[56px] flex-1 ${
                      selectedCategory === id
                        ? "bg-gradient-to-r from-[#8B0000] to-[#6B1515] text-white shadow-lg"
                        : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] font-medium whitespace-nowrap">{label}</span>
                      {selectedCategory === id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowLegend(!showLegend);
                          }}
                          className="p-0.5 rounded hover:bg-white/20 transition-all"
                          title={showLegend ? "Hide legend" : "Show legend"}
                        >
                          {showLegend ? (
                            <Eye className="w-3 h-3" />
                          ) : (
                            <EyeOff className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
