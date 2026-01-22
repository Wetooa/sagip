import { AlertTriangle } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-[#6B1515] text-white px-4 py-3 shadow-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="relative">
          <AlertTriangle className="w-6 h-6" fill="#FFA500" stroke="#6B1515" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-2 bg-[#FF4545]"></div>
        </div>
        <h1 className="text-xl tracking-wide">sagip</h1>
      </div>
      <p className="text-xs text-[#F4E4C1]">Hazard Monitoring</p>
    </header>
  );
}
