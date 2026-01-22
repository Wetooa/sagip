import { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Navigation } from 'lucide-react';
import type { HazardCategory } from 'app/page';

interface MapViewProps {
  category: HazardCategory;
}

export function MapView({ category }: MapViewProps) {
  const [zoom, setZoom] = useState(12);
  
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 1, 18));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 1, 8));

  // Different map overlay colors based on category
  const getOverlayStyle = () => {
    switch(category) {
      case 'flood':
        return 'rgba(59, 130, 246, 0.3)'; // Blue
      case 'storm-surge':
        return 'rgba(14, 165, 233, 0.3)'; // Cyan
      case 'landslide':
        return 'rgba(245, 158, 11, 0.3)'; // Orange
      case 'rainfall':
        return 'rgba(99, 102, 241, 0.3)'; // Indigo
      case 'buildings':
        return 'rgba(107, 114, 128, 0.3)'; // Gray
      case 'elevation':
        return 'rgba(139, 92, 46, 0.3)'; // Brown
      case 'facilities':
        return 'rgba(239, 68, 68, 0.3)'; // Red
      case 'roads':
        return 'rgba(75, 85, 99, 0.3)'; // Dark gray
      default:
        return 'rgba(59, 130, 246, 0.3)';
    }
  };

  return (
    <div className="w-full h-full relative bg-[#A8B5A0]">
      {/* Map placeholder with grid pattern */}
      <div className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(107, 21, 21, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(107, 21, 21, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Hazard overlay */}
      <div 
        className="absolute inset-0 transition-colors duration-500"
        style={{ backgroundColor: getOverlayStyle() }}
      >
        {/* Simulated hazard zones */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-60"
          style={{ backgroundColor: getOverlayStyle().replace('0.3', '0.7') }}
        />
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full opacity-50"
          style={{ backgroundColor: getOverlayStyle().replace('0.3', '0.6') }}
        />
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-24 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={handleZoomIn}
          className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-[#6B1515]" />
        </button>
        <div className="bg-white rounded-full px-3 py-2 shadow-lg text-sm font-medium text-[#6B1515]">
          {zoom}x
        </div>
        <button
          onClick={handleZoomOut}
          className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-[#6B1515]" />
        </button>
        <button
          className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors mt-2"
          aria-label="Recenter"
        >
          <Navigation className="w-5 h-5 text-[#6B1515]" />
        </button>
        <button
          className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Full screen"
        >
          <Maximize2 className="w-5 h-5 text-[#6B1515]" />
        </button>
      </div>

      {/* Location indicator */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-4 h-4 bg-[#FF4545] rounded-full border-4 border-white shadow-lg animate-pulse" />
      </div>
    </div>
  );
}
