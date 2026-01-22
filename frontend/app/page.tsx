"use client";

import { CategoryTabs } from "@/components/CategoryTabs";
import { Header } from "@/components/Header";
import { MapView } from "@/components/MapView";
import { useState } from "react";
import { Legend } from "@/components/Legend";

export type HazardCategory =
  | "flood"
  | "storm-surge"
  | "landslide"
  | "rainfall"
  | "buildings"
  | "elevation"
  | "facilities"
  | "roads";

export default function Home() {
  // Renamed from RootLayout to Home
  const [selectedCategory, setSelectedCategory] =
    useState<HazardCategory>("flood");
  const [showLegend, setShowLegend] = useState(true);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      {/* Mobile Phone Frame */}
      <div className="w-full max-w-[390px] h-[844px] bg-black rounded-[3rem] shadow-2xl overflow-hidden border-8 border-gray-800 relative">
        {/* Notch */}
        {/* <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-50"></div> */}

        {/* App Content */}
        <div id="phone" className="h-full w-full flex flex-col bg-[#F4E4C1]">
          <Header />

          <div className="flex-1 relative overflow-hidden">
            <MapView category={selectedCategory} />

            {showLegend && (
              <Legend
                category={selectedCategory}
                onClose={() => setShowLegend(false)}
              />
            )}

            <button
              onClick={() => setShowLegend(!showLegend)}
              className="absolute top-4 right-4 bg-[#6B1515]/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg shadow-lg z-10 text-xs font-medium"
            >
              {showLegend ? "Hide" : "Show"} Legend
            </button>
          </div>

          <CategoryTabs
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>
    </div>
  );
}
