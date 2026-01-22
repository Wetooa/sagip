"use client";

import { CategoryTabs } from "@/components/CategoryTabs";
import { Header } from "@/components/Header";
import { MapView } from "@/components/MapView";
import { useState, useEffect } from "react";
import { Legend } from "@/components/Legend";

import DebugPanel, { DebugState } from "@/components/DebugPanel";
import { DebugModals, DebugModalType } from "@/components/DebugModals";

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

  // Debug state for all toggles
  const [debug, setDebug] = useState<DebugState>({
    duringTyphoon: false,
    phoneDead: false,
    internet: true,
    bluetoothMesh: false,
    loraDevice: false,
  });
  const [modal, setModal] = useState<DebugModalType>(null);

  // User flow logic
  useEffect(() => {
    if (!debug.duringTyphoon) {
      setModal(null);
      return;
    }
    if (!debug.phoneDead) {
      setModal("are-you-safe");
    } else {
      if (debug.loraDevice) {
        setModal("lora-sos");
      } else {
        setModal("lora-drift");
      }
    }
  }, [debug]);

  // Handle modal transitions based on user flow
  const handleStatus = (status: string) => {
    if (!debug.phoneDead) {
      // PHONE ALIVE FLOW
      if (status === "yes") {
        setModal(null); // Mark safe
      } else if (status === "no") {
        setModal("location-sent");
      } else if (status === "bluetooth") {
        // This is triggered by "Try Bluetooth Mesh" in Offline SOS modal
        if (!debug.internet && !debug.bluetoothMesh) {
          setModal("location-sent");
        } else if (debug.bluetoothMesh) {
          setModal("bluetooth-mesh");
        } else {
          setModal("drift-analysis");
        }
      } else if (status === "drift") {
        setModal("drift-analysis");
      }
    } else {
      // DEAD BATTERY FLOW
      if (debug.loraDevice) {
        setModal("lora-sos");
      } else {
        setModal("lora-drift");
      }
    }
  };

  // LoRa SOS button triggers LoRa modal
  const handleLoraSOS = () => {
    setModal("lora-sos");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      {/* Mobile Phone Frame */}
      <div className="w-full max-w-97.5 h-211 bg-black rounded-[3rem] shadow-2xl overflow-hidden border-8 border-gray-800 relative">
        {/* Notch */}
        {/* <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-50"></div> */}

        {/* App Content */}
        <div
          id="phone"
          className="h-full w-full flex flex-col bg-[#F4E4C1] relative overflow-hidden"
        >
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
          {/* Debug Panel Floating */}
          <DebugPanel onChange={setDebug} onLoraSOS={handleLoraSOS} />
          <DebugModals
            modal={modal}
            setModal={setModal}
            onStatus={handleStatus}
          />
        </div>
      </div>
    </div>
  );
}
