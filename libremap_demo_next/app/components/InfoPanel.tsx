"use client";

import { TyphoonData, TyphoonPoint } from "./types";

interface InfoPanelProps {
  typhoonData: TyphoonData | null;
  currentPoint: TyphoonPoint | null;
}

export default function InfoPanel({
  typhoonData,
  currentPoint,
}: InfoPanelProps) {
  if (!typhoonData) {
    return (
      <div className="absolute top-2.5 left-2.5 bg-white p-4 rounded-lg shadow-md z-10 max-w-75">
        <h2 className="m-0 mb-2.5 text-lg">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="absolute top-2.5 left-2.5 bg-white p-4 rounded-lg shadow-md z-10 max-w-75">
      <h2 className="m-0 mb-2.5 text-lg">{typhoonData.title}</h2>
      <p className="my-1.5 text-sm">
        <strong>Max Wind:</strong> {typhoonData.max} knots
      </p>
      <p className="my-1.5 text-sm">
        <strong>Location:</strong> {typhoonData.place || "Philippines"}
      </p>
      <p className="my-1.5 text-sm">
        <strong>Season:</strong> {typhoonData.season}
      </p>
      <p className="my-1.5 text-sm">
        <strong>Current:</strong>{" "}
        {currentPoint
          ? `${currentPoint.description} - ${currentPoint.wind} knots`
          : "N/A"}
      </p>
    </div>
  );
}
