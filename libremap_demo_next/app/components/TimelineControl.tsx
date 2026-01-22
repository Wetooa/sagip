"use client";

import { TyphoonData } from "./types";

interface TimelineControlProps {
  typhoonData: TyphoonData | null;
  currentIndex: number;
  isPlaying: boolean;
  onSliderChange: (index: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default function TimelineControl({
  typhoonData,
  currentIndex,
  isPlaying,
  onSliderChange,
  onPlay,
  onPause,
  onReset,
}: TimelineControlProps) {
  if (!typhoonData) return null;

  const currentPoint = typhoonData.track[currentIndex];
  const startDate = new Date(typhoonData.track[0].date);
  const endDate = new Date(
    typhoonData.track[typhoonData.track.length - 1].date
  );
  const currentDate = new Date(currentPoint.date);

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white p-5 rounded-lg shadow-lg z-10 min-w-[500px]">
      <h3 className="m-0 mb-2.5 text-base text-center">
        Typhoon Timeline:{" "}
        <span className="font-bold text-red-600">
          {currentDate.toLocaleString()}
        </span>
      </h3>
      <div className="flex items-center gap-4 mb-2.5">
        <span className="text-sm">{startDate.toLocaleDateString()}</span>
        <input
          type="range"
          min="0"
          max={typhoonData.track.length - 1}
          value={currentIndex}
          onChange={(e) => onSliderChange(parseInt(e.target.value))}
          className="timeline-slider flex-1"
        />
        <span className="text-sm">{endDate.toLocaleDateString()}</span>
      </div>
      <div className="flex justify-center gap-2.5 mt-2.5">
        <button
          onClick={onPlay}
          disabled={isPlaying}
          className="px-4 py-2 bg-blue-600 text-white border-none rounded cursor-pointer text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          ▶ Play
        </button>
        <button
          onClick={onPause}
          disabled={!isPlaying}
          className="px-4 py-2 bg-blue-600 text-white border-none rounded cursor-pointer text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          ⏸ Pause
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-blue-600 text-white border-none rounded cursor-pointer text-sm hover:bg-blue-700"
        >
          ⏮ Reset
        </button>
      </div>
    </div>
  );
}
