export function Header() {
  return (
    <header className="bg-[#6B1515] text-white px-4 py-3 shadow-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="SAGIP" className="h-6" />
      </div>
      <p className="text-xs text-[#F4E4C1]">Hazard Monitoring</p>
    </header>
  );
}
