"use client";

import { PrecipSample, TyphoonData, TyphoonPoint } from "./types";

interface InfoPanelProps {
  storms: TyphoonData[];
  activeStormId: string | null;
  onStormChange: (id: string | null) => void;
  currentPoint: TyphoonPoint | null;
  precipSample: PrecipSample | null;
}

export default function InfoPanel({
  storms,
  activeStormId,
  onStormChange,
  currentPoint,
  precipSample,
}: InfoPanelProps) {
  const hasStorms = storms.length > 0;
  const activeStorm = activeStormId
    ? storms.find((s) => s.id === activeStormId) || null
    : null;

  if (!hasStorms) {
    return (
      <div className="absolute top-2.5 left-2.5 bg-white p-4 rounded-lg shadow-md z-10 max-w-75">
        <h2 className="m-0 mb-2.5 text-lg">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="absolute top-2.5 left-2.5 bg-white p-4 rounded-lg shadow-md z-10 max-w-75">
      <div className="flex items-center gap-2 mb-2">
        <label className="text-sm font-semibold" htmlFor="storm-select">
          Storms
        </label>
        <select
          id="storm-select"
          className="border rounded px-2 py-1 text-sm"
          value={activeStormId ?? "all"}
          onChange={(e) =>
            onStormChange(e.target.value === "all" ? null : e.target.value)
          }
        >
          <option value="all">All storms</option>
          {storms.map((storm) => (
            <option key={storm.id} value={storm.id}>
              {storm.title || storm.name}
            </option>
          ))}
        </select>
      </div>

      {activeStorm ? (
        <>
          <h2 className="m-0 mb-2.5 text-lg">{activeStorm.title}</h2>
          <p className="my-1.5 text-sm">
            <strong>Max Wind:</strong> {activeStorm.max} knots
          </p>
          <p className="my-1.5 text-sm">
            <strong>Location:</strong> {activeStorm.place || "Philippines"}
          </p>
          <p className="my-1.5 text-sm">
            <strong>Season:</strong> {activeStorm.season}
          </p>
          <p className="my-1.5 text-sm">
            <strong>Current:</strong>{" "}
            {currentPoint
              ? `${currentPoint.description} - ${currentPoint.wind} knots`
              : "N/A"}
          </p>
        </>
      ) : (
        <>
          <h2 className="m-0 mb-2.5 text-lg">All storms</h2>
          <p className="my-1.5 text-sm">
            <strong>Total storms:</strong> {storms.length}
          </p>
          <p className="my-1.5 text-sm">
            <strong>Tracks shown:</strong> full paths for all active storms
          </p>
        </>
      )}
      <p className="my-1.5 text-sm">
        <strong>Precip (click map):</strong>{" "}
        {precipSample
          ? `${precipSample.valueMmHr ?? "?"} mm/hr at ${new Date(
              precipSample.timestamp
            ).toLocaleString()} (${precipSample.colorHex})`
          : "Click map to sample"}
      </p>
    </div>
  );
}
