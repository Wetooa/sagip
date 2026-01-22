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
  onStepBack: () => void;
  onStepForward: () => void;
  manualDate: string;
  manualTime: string;
  onManualDateChange: (value: string) => void;
  onManualTimeChange: (value: string) => void;
  onManualApply: () => void;
}

export default function TimelineControl({
  typhoonData,
  currentIndex,
  isPlaying,
  onSliderChange,
  onPlay,
  onPause,
  onReset,
  onStepBack,
  onStepForward,
  manualDate,
  manualTime,
  onManualDateChange,
  onManualTimeChange,
  onManualApply,
}: TimelineControlProps) {
  if (!typhoonData || typhoonData.track.length === 0) return null;

  const currentPoint = typhoonData.track[currentIndex];
  const startDate = new Date(typhoonData.track[0].date);
  const endDate = new Date(
    typhoonData.track[typhoonData.track.length - 1].date
  );
  const currentDate = new Date(currentPoint.date);

  return (
    <div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-5 py-4 rounded-xl shadow-lg z-10 border border-gray-200"
      style={{ minWidth: 620 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="px-3 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button
            onClick={onStepBack}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            aria-label="Step backward"
          >
            «
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex flex-col items-center">
            <span className="uppercase text-xs text-gray-500">Date</span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={manualDate}
                onChange={(e) => onManualDateChange(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
              <input
                type="time"
                value={manualTime}
                onChange={(e) => onManualTimeChange(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
                step={300}
              />
              <button
                onClick={onManualApply}
                className="px-3 py-1.5 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
              >
                Go
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onStepForward}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            aria-label="Step forward"
          >
            »
          </button>
          <button
            onClick={onReset}
            className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            ⏮
          </button>
        </div>
      </div>

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
      <p className="text-center text-sm text-gray-700 m-0">
        Current:{" "}
        <span className="font-semibold">{currentDate.toLocaleString()}</span>
      </p>
    </div>
  );
}
