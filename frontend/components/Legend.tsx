import { X } from 'lucide-react';
import type { HazardCategory } from '../App';

interface LegendProps {
  category: HazardCategory;
  onClose: () => void;
}

const legendData: Record<HazardCategory, { title: string; items: Array<{ color: string; label: string }> }> = {
  flood: {
    title: 'Flood Susceptibility',
    items: [
      { color: '#FF4545', label: 'Very High' },
      { color: '#FF8A3D', label: 'High' },
      { color: '#FFA500', label: 'Moderate' },
      { color: '#90EE90', label: 'Low' },
      { color: '#E8F5E9', label: 'Very Low' },
    ],
  },
  'storm-surge': {
    title: 'Storm Surge Models',
    items: [
      { color: '#8B0000', label: '> 3m height' },
      { color: '#FF4545', label: '2-3m height' },
      { color: '#FF8A3D', label: '1-2m height' },
      { color: '#3B82F6', label: '0.5-1m height' },
      { color: '#93C5FD', label: '< 0.5m height' },
    ],
  },
  landslide: {
    title: 'Landslide Warning',
    items: [
      { color: '#8B0000', label: 'Critical' },
      { color: '#FF4545', label: 'High Risk' },
      { color: '#FF8A3D', label: 'Moderate Risk' },
      { color: '#FFA500', label: 'Low Risk' },
      { color: '#F4E4C1', label: 'Minimal Risk' },
    ],
  },
  rainfall: {
    title: 'Real-Time Rainfall',
    items: [
      { color: '#6B1515', label: 'Intense (>30mm/hr)' },
      { color: '#FF4545', label: 'Heavy (20-30mm/hr)' },
      { color: '#FF8A3D', label: 'Moderate (10-20mm/hr)' },
      { color: '#FFA500', label: 'Light (5-10mm/hr)' },
      { color: '#90EE90', label: 'Drizzle (<5mm/hr)' },
    ],
  },
  buildings: {
    title: 'Building Footprints',
    items: [
      { color: '#6B1515', label: 'High-rise (>10 floors)' },
      { color: '#8B4513', label: 'Mid-rise (4-10 floors)' },
      { color: '#A8B5A0', label: 'Low-rise (1-3 floors)' },
      { color: '#D3D3D3', label: 'Residential' },
      { color: '#F0F0F0', label: 'Temporary structures' },
    ],
  },
  elevation: {
    title: 'Elevation/Terrain (DTM)',
    items: [
      { color: '#8B4513', label: '> 500m elevation' },
      { color: '#D2691E', label: '200-500m elevation' },
      { color: '#DEB887', label: '100-200m elevation' },
      { color: '#F4E4C1', label: '50-100m elevation' },
      { color: '#90EE90', label: '< 50m elevation' },
    ],
  },
  facilities: {
    title: 'Critical Facilities',
    items: [
      { color: '#FF4545', label: 'Hospitals' },
      { color: '#FF8A3D', label: 'Fire Stations' },
      { color: '#FFA500', label: 'Police Stations' },
      { color: '#3B82F6', label: 'Schools' },
      { color: '#2ECC71', label: 'Evacuation Centers' },
    ],
  },
  roads: {
    title: 'Road Network',
    items: [
      { color: '#6B1515', label: 'Major highways' },
      { color: '#8B4513', label: 'Main roads' },
      { color: '#A8B5A0', label: 'Secondary roads' },
      { color: '#D3D3D3', label: 'Local streets' },
      { color: '#F0F0F0', label: 'Unpaved roads' },
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