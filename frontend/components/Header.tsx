export function Header() {
  return (
    <header className="bg-[#6B1515] text-white px-4 py-3 shadow-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img src="/sagip-logo.svg" alt="SAGIP" className="w-8 h-8" />
        <h1 className="text-xl tracking-wide">SAGIP</h1>
      </div>
      <p className="text-xs text-[#F4E4C1]">Hazard Monitoring</p>
    </header>
  );
}
