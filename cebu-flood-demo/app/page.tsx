import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Cebu Flood Hazard Map Demo
        </h1>
        <p className="text-gray-600 mb-6">
          This demo visualizes flood hazard data from Project NOAH for Cebu, Philippines.
          The data is processed from shapefiles and displayed using MapLibre GL.
        </p>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="font-semibold text-blue-900 mb-2">Features:</h2>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Shapefile to GeoJSON conversion</li>
              <li>Interactive map with zoom and pan controls</li>
              <li>Color-coded flood hazard zones</li>
              <li>Click on zones to view detailed attributes</li>
              <li>Legend showing hazard levels</li>
            </ul>
          </div>
          
          <Link
            href="/demo/cebu-flood"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            View Map Demo →
          </Link>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Data source: Project NOAH - PH072200000_FH_5yr (5-year flood hazard zones)
          </p>
        </div>
      </div>
    </div>
  );
}
