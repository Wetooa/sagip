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

export interface DriftPredictionPin {
  latitude: number;
  longitude: number;
  radius: number;
  timestamp: number;
  expiresAt: number;
}

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
  const [driftPin, setDriftPin] = useState<DriftPredictionPin | null>(null);

  // Load drift pin from localStorage on mount
  // eslint-disable react-hooks/exhaustive-deps
  useEffect(() => {
    const stored = localStorage.getItem("urgentHelpLostSignal");
    if (stored) {
      try {
        const pin: DriftPredictionPin = JSON.parse(stored);
        // Check if expired
        if (pin.expiresAt > Date.now()) {
          setDriftPin(pin);
        } else {
          // Expired, clean up
          localStorage.removeItem("urgentHelpLostSignal");
        }
      } catch (e) {
        console.error("Failed to parse drift pin from localStorage:", e);
      }
    }
  }, []);

  // Check drift pin expiry periodically
  useEffect(() => {
    if (!driftPin) return;

    const checkExpiry = () => {
      if (driftPin.expiresAt <= Date.now()) {
        setDriftPin(null);
        localStorage.removeItem("urgentHelpLostSignal");
      }
    };

    const interval = setInterval(checkExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [driftPin]);

  // User flow logic
  // eslint-disable react-hooks/exhaustive-deps
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
    if (status === "drift-triggered") {
      // Create drift pin with random radius (50-500 meters)
      const randomRadius = Math.floor(Math.random() * 450) + 50;
      const now = Date.now();
      const expiresAt = now + 24 * 60 * 60 * 1000; // 24 hours from now

      const newDriftPin: DriftPredictionPin = {
        latitude: 10.515794365028029,
        longitude: 124.0266410381405,
        radius: randomRadius,
        timestamp: now,
        expiresAt,
      };

      setDriftPin(newDriftPin);
      localStorage.setItem("urgentHelpLostSignal", JSON.stringify(newDriftPin));
      return;
    }

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
          <DebugPanel
            onChange={setDebug}
            onLoraSOS={handleLoraSOS}
            driftPin={driftPin}
            onTriggerDrift={() => {
              const randomRadius = Math.floor(Math.random() * 450) + 50;
              const now = Date.now();
              const expiresAt = now + 24 * 60 * 60 * 1000;
              const newDriftPin: DriftPredictionPin = {
                latitude: 10.515794365028029,
                longitude: 124.0266410381405,
                radius: randomRadius,
                timestamp: now,
                expiresAt,
              };
              setDriftPin(newDriftPin);
              localStorage.setItem(
                "urgentHelpLostSignal",
                JSON.stringify(newDriftPin),
              );
            }}
            onDeleteDrift={() => {
              setDriftPin(null);
              localStorage.removeItem("urgentHelpLostSignal");
            }}
          />
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
