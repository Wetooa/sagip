'use client';

export default function FloodLegend() {
  const legendItems = [
    { color: '#e3f2fd', label: '0m - Very Low', depth: '0m' },
    { color: '#90caf9', label: '0-0.5m - Low', depth: '0-0.5m' },
    { color: '#42a5f5', label: '0.5-1m - Moderate', depth: '0.5-1m' },
    { color: '#1e88e5', label: '1-2m - High', depth: '1-2m' },
    { color: '#1565c0', label: '2-5m - Very High', depth: '2-5m' },
    { color: '#0d47a1', label: '5m+ - Extreme', depth: '5m+' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">
        Flood Hazard Levels
      </h3>
      <div className="space-y-2">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">
                {item.depth}
              </div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Data: 5-year flood hazard zones for Cebu, Philippines
        </p>
      </div>
    </div>
  );
}
