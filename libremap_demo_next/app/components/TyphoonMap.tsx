"use client";

import { useState, useEffect, useRef } from "react";
import MapComponent from "./MapComponent";
import InfoPanel from "./InfoPanel";
import TimelineControl from "./TimelineControl";
import { TyphoonData } from "./types";

export default function TyphoonMap() {
  const [typhoonData, setTyphoonData] = useState<TyphoonData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch typhoon data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/tino.json");
        const data: TyphoonData = await response.json();
        setTyphoonData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading typhoon data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cleanup animation interval on unmount
  useEffect(() => {
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, []);

  const startAnimation = () => {
    if (!typhoonData || isPlaying) return;

    setIsPlaying(true);
    animationIntervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= typhoonData.track.length - 1) {
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

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <p className="text-xl">Loading typhoon data...</p>
      </div>
    );
  }

  const currentPoint = typhoonData ? typhoonData.track[currentIndex] : null;

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <MapComponent typhoonData={typhoonData} currentIndex={currentIndex} />
      <InfoPanel typhoonData={typhoonData} currentPoint={currentPoint} />
      <TimelineControl
        typhoonData={typhoonData}
        currentIndex={currentIndex}
        isPlaying={isPlaying}
        onSliderChange={handleSliderChange}
        onPlay={startAnimation}
        onPause={pauseAnimation}
        onReset={resetAnimation}
      />
    </div>
  );
}
