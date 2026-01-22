import FloodMap from '@/components/demo/FloodMap';
import FloodLegend from '@/components/demo/FloodLegend';

export default function CebuFloodDemoPage() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <header className="bg-blue-600 text-white px-6 py-4 shadow-md">
        <h1 className="text-2xl font-bold">Cebu Flood Hazard Map Demo</h1>
        <p className="text-sm text-blue-100 mt-1">
          Interactive visualization of 5-year flood hazard zones
        </p>
      </header>
      
      <div className="flex-1 relative">
        <FloodMap className="absolute inset-0" />
        
        {/* Legend positioned in bottom-right */}
        <div className="absolute bottom-4 right-4 z-10 max-w-xs">
          <FloodLegend />
        </div>
      </div>
    </div>
  );
}
