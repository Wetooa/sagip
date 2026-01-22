"use client";

import { useState, useEffect, useRef } from "react";
import MapComponent from "./MapComponent";
import InfoPanel from "./InfoPanel";
import TimelineControl from "./TimelineControl";
import { MapStyle, PrecipSample, TyphoonData } from "./types";

export default function TyphoonMap() {
  const [storms, setStorms] = useState<TyphoonData[]>([]);
  const [activeStormId, setActiveStormId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [precipVisible, setPrecipVisible] = useState(true);
  const [precipSample, setPrecipSample] = useState<PrecipSample | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyle>("satellite");
  const [manualDate, setManualDate] = useState<string>("");
  const [manualTime, setManualTime] = useState<string>("00:00");
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch storms for today from Zoom Earth; fallback to bundled data
  useEffect(() => {
    const loadStorms = async () => {
      setIsLoading(true);
      const todayIso = new Date().toISOString().split("T")[0];
      try {
        const listRes = await fetch(`/api/storms?date=${todayIso}&to=12`);
        const listJson = await listRes.json();
        const rawStorms: { id: string }[] = Array.isArray(listJson?.storms)
          ? (listJson.storms
              .map((entry: unknown) => {
                if (typeof entry === "string") return { id: entry };
                if (
                  entry &&
                  typeof entry === "object" &&
                  "id" in (entry as Record<string, unknown>)
                ) {
                  return entry as { id: string };
                }
                return null;
              })
              .filter(Boolean) as { id: string }[])
          : listJson?.storms && typeof listJson.storms === "object"
            ? Object.entries(listJson.storms).map(([id, value]) => ({
                id,
                ...(value as Record<string, unknown>),
              }))
            : [];

        const stormsToFetch = rawStorms.filter((s) => s.id).slice(0, 10);

        const details = await Promise.all(
          stormsToFetch.map(async (storm) => {
            try {
              const detailRes = await fetch(`/api/storms?id=${storm.id}`);
              const detailJson = await detailRes.json();
              return normalizeStorm(detailJson as TyphoonData);
            } catch (err) {
              console.warn("Failed to load storm detail", storm.id, err);
              return null;
            }
          })
        );

        const cleaned = (details.filter(Boolean) as TyphoonData[]).filter(
          (s) => s.track.length > 0
        );

        if (cleaned.length === 0) {
          throw new Error("No storms loaded from API");
        }

        setStorms(cleaned);
        setActiveStormId(cleaned[0]?.id ?? null);
        setManualDefaults(cleaned[0]);
      } catch (error) {
        console.error("Error loading storms from API, using fallback:", error);
        try {
          const response = await fetch("/data/tino.json");
          const data: TyphoonData = await response.json();
          setStorms([data]);
          setActiveStormId(data.id);
          setManualDefaults(data);
        } catch (fallbackErr) {
          console.error("Fallback storm failed:", fallbackErr);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadStorms();
  }, []);

  // Cleanup animation interval on unmount
  useEffect(() => {
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Reset when storm changes
    setCurrentIndex(0);
    setIsPlaying(false);
    const active = getActiveStorm();
    if (active) {
      setManualDefaults(active);
    }
  }, [activeStormId]);

  const startAnimation = () => {
    const active = getActiveStorm();
    if (!active || isPlaying) return;

    setIsPlaying(true);
    animationIntervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= active.track.length - 1) {
          pauseAnimation();
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, 500);
  };

  const pauseAnimation = () => {
    setIsPlaying(false);
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
  };

  const resetAnimation = () => {
    pauseAnimation();
    setCurrentIndex(0);
  };

  const handleSliderChange = (index: number) => {
    pauseAnimation();
    setCurrentIndex(index);
  };

  const handleStep = (delta: number) => {
    const active = getActiveStorm();
    if (!active) return;
    pauseAnimation();
    setCurrentIndex((prev) => {
      const next = Math.min(Math.max(prev + delta, 0), active.track.length - 1);
      return next;
    });
  };

  const handleManualApply = () => {
    const active = getActiveStorm();
    if (!active || !manualDate) return;
    pauseAnimation();
    const target = new Date(
      `${manualDate}T${(manualTime || "00:00") + ":00"}`
    ).getTime();
    let bestIdx = 0;
    let bestDiff = Number.POSITIVE_INFINITY;
    active.track.forEach((p, idx) => {
      const diff = Math.abs(new Date(p.date).getTime() - target);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestIdx = idx;
      }
    });
    setCurrentIndex(bestIdx);
  };

  const getActiveStorm = () =>
    activeStormId === null
      ? null
      : storms.find((s) => s.id === activeStormId) || null;

  const setManualDefaults = (storm: TyphoonData) => {
    const start = storm.track[0]?.date;
    if (start) {
      const d = new Date(start);
      setManualDate(d.toISOString().split("T")[0]);
      const hh = d.getHours().toString().padStart(2, "0");
      const mm = d.getMinutes().toString().padStart(2, "0");
      setManualTime(`${hh}:${mm}`);
    }
  };

  const activeStorm = getActiveStorm();
  const currentPoint = activeStorm ? activeStorm.track[currentIndex] : null;

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <p className="text-xl">Loading typhoon data...</p>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <MapComponent
        storms={storms}
        activeStormId={activeStormId}
        currentIndex={currentIndex}
        precipVisible={precipVisible}
        mapStyle={mapStyle}
        onPrecipSample={setPrecipSample}
      />
      <InfoPanel
        storms={storms}
        activeStormId={activeStormId}
        onStormChange={setActiveStormId}
        currentPoint={currentPoint}
        precipSample={precipSample}
      />
      <div className="absolute top-2.5 right-2.5 z-10 flex gap-2">
        <button
          className="px-3 py-2 bg-gray-800 text-white rounded shadow hover:bg-gray-900"
          onClick={() =>
            setMapStyle((prev) =>
              prev === "satellite" ? "normal" : "satellite"
            )
          }
        >
          {mapStyle === "satellite" ? "Normal Map" : "Satellite"}
        </button>
      </div>
      <TimelineControl
        typhoonData={activeStorm}
        currentIndex={currentIndex}
        isPlaying={isPlaying}
        onSliderChange={handleSliderChange}
        onPlay={startAnimation}
        onPause={pauseAnimation}
        onReset={resetAnimation}
        onStepBack={() => handleStep(-1)}
        onStepForward={() => handleStep(1)}
        manualDate={manualDate}
        manualTime={manualTime}
        onManualDateChange={setManualDate}
        onManualTimeChange={setManualTime}
        onManualApply={handleManualApply}
      />
    </div>
  );
}

// Normalize storms that resemble TyphoonData; tolerate missing properties
function normalizeStorm(raw: TyphoonData): TyphoonData {
  const title = raw.title || raw.name || raw.id || "Storm";
  const track = Array.isArray(raw.track)
    ? (raw.track
        .map((p) => {
          if (!p) return null;
          const { date, coordinates } = p as Partial<typeof p>;
          if (!date || !coordinates || coordinates.length !== 2) return null;
          const parsed = new Date(date);
          if (!Number.isFinite(parsed.getTime())) return null;
          return {
            ...p,
            date: parsed.toISOString(),
          } as typeof p;
        })
        .filter(Boolean)
        .sort(
          (a, b) =>
            new Date((a as (typeof raw.track)[0]).date).getTime() -
            new Date((b as (typeof raw.track)[0]).date).getTime()
        ) as typeof raw.track)
    : [];
  return {
    id: raw.id || title,
    name: raw.name || title,
    title,
    description: raw.description || "",
    season: raw.season || "",
    type: raw.type || "",
    max: raw.max || 0,
    forecast: raw.forecast || 0,
    ja: raw.ja || 0,
    ph: raw.ph || "",
    agencies: raw.agencies || "",
    track,
    place: raw.place,
    startDate: raw.startDate || track[0]?.date,
    endDate: raw.endDate || track[track.length - 1]?.date,
  };
}
