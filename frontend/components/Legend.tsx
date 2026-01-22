import { X } from "lucide-react";
import type { HazardCategory } from "app/page";

interface LegendProps {
  category: HazardCategory;
  onClose: () => void;
}

const legendData: Record<
  HazardCategory,
  { title: string; items: Array<{ color: string; label: string }> }
> = {
  flood: {
    title: "Flood Depth",
    items: [
      { color: "#1565c0", label: "2-5m (Very High)" },
      { color: "#1e88e5", label: "1-2m (High)" },
      { color: "#42a5f5", label: "0.5-1m (Moderate)" },
      { color: "#90caf9", label: "0-0.5m (Low)" },
      { color: "#e3f2fd", label: "0m (Very Low)" },
    ],
  },
  "storm-surge": {
    title: "Storm Surge & Typhoons",
    items: [
      { color: "#ff4500", label: "Typhoon Track" },
      { color: "#8B0000", label: "> 3m surge" },
      { color: "#FF4545", label: "2-3m surge" },
      { color: "#FF8A3D", label: "1-2m surge" },
      { color: "#3B82F6", label: "0.5-1m surge" },
    ],
  },
};

export function Legend({ category, onClose }: LegendProps) {
  const data = legendData[category];

  return (
    <div className="absolute top-16 left-4 bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-3 max-w-[180px] z-10 border border-white/40">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-xs text-[#6B1515]">{data.title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close legend"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-1.5">
        {data.items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-5 h-3 rounded border border-gray-300/50 flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[10px] text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
