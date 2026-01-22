"use client";

import { useState, useEffect } from "react";
import {
  Map,
  Radio,
  Navigation,
  Users,
  MessageSquare,
  Activity,
  AlertTriangle,
  MapPin,
  TrendingUp,
  Clock,
  Zap,
  Shield,
  Send,
  X,
  ChevronRight,
  Maximize2,
  RefreshCw,
  User,
} from "lucide-react";
import HazardMapping from "@/components/CommandCenter/HazardMapping";
import LoRaPanel from "@/components/CommandCenter/LoRaPanel";
import RescueRoutes from "@/components/CommandCenter/RescueRoutes";
import RollCall from "@/components/CommandCenter/RollCall";
import AIAnalytics from "@/components/CommandCenter/AIAnalytics";
import AIChatbot from "@/components/CommandCenter/AIChatbot";
import type { DriftPredictionPin } from "@/app/page";

type Panel =
  | "hazard"
  | "lora"
  | "rescue"
  | "rollcall"
  | "analytics"
  | "profile";

interface SOSAlert {
  id: string;
  location: [number, number];
  timestamp: string;
  status: "critical" | "high" | "medium";
  name: string;
}

export default function CommandCenter() {
  const [activePanel, setActivePanel] = useState<Panel>("hazard");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [driftPin, setDriftPin] = useState<DriftPredictionPin | null>(null);
  const [sosAlerts, setSOSAlerts] = useState<SOSAlert[]>([
    {
      id: "1",
      location: [123.8854, 10.3157],
      timestamp: new Date().toISOString(),
      status: "critical",
      name: "Zone A-12",
    },
    {
      id: "2",
      location: [123.8754, 10.3257],
      timestamp: new Date().toISOString(),
      status: "high",
      name: "Sector B-5",
    },
    {
      id: "3",
      location: [123.8954, 10.3057],
      timestamp: new Date().toISOString(),
      status: "medium",
      name: "Area C-8",
    },
  ]);
  const [criticalZones, setCriticalZones] = useState(24);
  const [activeRescues, setActiveRescues] = useState(12);
  const [peopleTracked, setPeopleTracked] = useState(1247);

  // Load drift pin from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("urgentHelpLostSignal");
    if (stored) {
      try {
        const pin: DriftPredictionPin = JSON.parse(stored);
        // Check if expired
        if (pin.expiresAt > Date.now()) {
          // Use a callback to avoid setState during render
          queueMicrotask(() => {
            setDriftPin(pin);
          });
        } else {
          // Expired, clean up
          localStorage.removeItem("urgentHelpLostSignal");
        }
      } catch (e) {
        console.error("Failed to parse drift pin from localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setPeopleTracked((prev) => prev + Math.floor(Math.random() * 3) - 1);
      setActiveRescues((prev) =>
        Math.max(0, prev + Math.floor(Math.random() * 3) - 1),
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderPanel = () => {
    switch (activePanel) {
      case "hazard":
        return <HazardMapping driftPin={driftPin} />;
      case "lora":
        return <LoRaPanel alerts={sosAlerts} />;
      case "rescue":
        return <RescueRoutes />;
      case "rollcall":
        return <RollCall peopleCount={peopleTracked} />;
      case "analytics":
        return <AIAnalytics />;
      case "profile":
        return <ProfilePanel />;
      default:
        return <HazardMapping driftPin={driftPin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1a1f35] to-[#111827] text-white relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8B0000]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#0ea5e9]/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-[#8B0000]/20 to-[#6B1515]/20 backdrop-blur-md border-b border-white/10 shadow-lg relative z-10">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                <Shield className="w-8 h-8 text-[#F4E4C1]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-wide text-white flex items-center gap-2">
                  SAGIP <span className="text-[#F4E4C1]">AI</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#F4E4C1]/20 text-[#F4E4C1] border border-[#F4E4C1]/30">
                    COMMAND CENTER
                  </span>
                </h1>
                <p className="text-sm text-[#F4E4C1]/80">
                  Government Emergency Operations Dashboard
                </p>
              </div>
            </div>

            {/* Real-time Stats & Profile */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">LIVE</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#F4E4C1]/70">System Time</div>
                <div className="text-sm font-mono font-semibold">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
              {/* Profile Button */}
              <button
                onClick={() => {
                  setActivePanel("profile");
                  setIsProfileOpen(!isProfileOpen);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 border ${
                  activePanel === "profile"
                    ? "bg-gradient-to-r from-[#8B0000] to-[#6B1515] border-[#8B0000]/50 shadow-lg shadow-[#8B0000]/30"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#8B0000] to-[#6B1515] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  AD
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-white">Admin</div>
                  <div className="text-xs text-gray-400">Operator</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-88px)] relative z-10">
        {/* Sidebar Navigation */}
        <aside className="w-24 bg-gradient-to-b from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-md border-r border-white/10 flex flex-col items-center py-6 gap-2">
          <NavButton
            icon={Map}
            label="Hazard Map"
            active={activePanel === "hazard"}
            onClick={() => setActivePanel("hazard")}
          />
          <NavButton
            icon={Radio}
            label="LoRa SOS"
            active={activePanel === "lora"}
            onClick={() => setActivePanel("lora")}
            badge={sosAlerts.length}
          />
          <NavButton
            icon={Navigation}
            label="Rescue"
            active={activePanel === "rescue"}
            onClick={() => setActivePanel("rescue")}
          />
          <NavButton
            icon={Users}
            label="Risk Tracking"
            active={activePanel === "rollcall"}
            onClick={() => setActivePanel("rollcall")}
          />
          <NavButton
            icon={Activity}
            label="Analytics"
            active={activePanel === "analytics"}
            onClick={() => setActivePanel("analytics")}
          />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative">
          {/* Quick Stats Bar */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-[#1e293b]/95 to-transparent backdrop-blur-md border-b border-white/10 px-6 py-3">
            <div className="grid grid-cols-4 gap-4">
              <StatCard
                icon={AlertTriangle}
                label="Critical Zones"
                value={criticalZones}
                color="text-red-500"
                bgColor="bg-red-500/10"
              />
              <StatCard
                icon={Radio}
                label="SOS Alerts"
                value={sosAlerts.length}
                color="text-orange-500"
                bgColor="bg-orange-500/10"
              />
              <StatCard
                icon={Navigation}
                label="Active Rescues"
                value={activeRescues}
                color="text-blue-500"
                bgColor="bg-blue-500/10"
              />
              <StatCard
                icon={Users}
                label="At Risk"
                value={peopleTracked}
                color="text-green-500"
                bgColor="bg-green-500/10"
              />
            </div>
          </div>

          {/* Panel Content */}
          <div className="h-full pt-24 pb-4 px-6">
            <div className="h-full bg-[#0f172a]/50 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl overflow-hidden">
              {renderPanel()}
            </div>
          </div>
        </main>
      </div>

      {/* AI Chatbot */}
      {isChatbotOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-white/20 rounded-2xl shadow-2xl z-50 flex flex-col">
          <div className="bg-gradient-to-r from-[#8B0000]/80 to-[#6B1515]/80 backdrop-blur-md px-4 py-3 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">AI Assistant</span>
            </div>
            <button
              onClick={() => setIsChatbotOpen(false)}
              className="hover:bg-white/10 p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <AIChatbot />
        </div>
      )}

      {/* Chatbot Toggle Button */}
      {!isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-[#8B0000] to-[#6B1515] hover:shadow-lg hover:shadow-[#8B0000]/50 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}

function NavButton({
  icon: Icon,
  label,
  active,
  onClick,
  badge,
}: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative w-16 flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all duration-300 group ${
        active
          ? "bg-gradient-to-br from-[#8B0000] to-[#6B1515] shadow-lg shadow-[#8B0000]/50 text-white"
          : "bg-white/5 hover:bg-white/10 hover:border-white/20 text-gray-400 hover:text-white"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-medium mt-1 leading-none text-center">
        {label}
      </span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {badge}
        </span>
      )}
    </button>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}

function StatCard({ icon: Icon, label, value, color, bgColor }: StatCardProps) {
  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-lg p-3 border border-white/10 flex items-center gap-3 hover:border-white/20 transition-all shadow-lg">
      <div className={`${bgColor} p-2 rounded-lg`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <div className="text-xs text-gray-400">{label}</div>
      </div>
    </div>
  );
}

// Profile Panel Component
function ProfilePanel() {
  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10 p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#8B0000] to-[#6B1515] rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
              AD
            </div>
            <div>
              <h3 className="text-xl font-bold">Admin User</h3>
              <p className="text-gray-400">Emergency Operations Officer</p>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-sm text-gray-400 mb-1">Email</div>
              <div className="font-medium">admin@sagip.gov.ph</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-sm text-gray-400 mb-1">Role</div>
              <div className="font-medium">System Administrator</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-sm text-gray-400 mb-1">Region</div>
              <div className="font-medium">Region VII - Central Visayas</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-sm text-gray-400 mb-1">Last Login</div>
              <div className="font-medium">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gradient-to-r from-[#8B0000] to-[#6B1515] px-4 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-[#8B0000]/30 transition-all">
              Edit Profile
            </button>
            <button className="bg-white/10 px-4 py-3 rounded-xl font-medium hover:bg-white/20 transition-all border border-white/10">
              Change Password
            </button>
            <button className="bg-white/10 px-4 py-3 rounded-xl font-medium hover:bg-white/20 transition-all border border-white/10">
              Notification Settings
            </button>
            <button className="bg-red-500/20 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-500/30 transition-all border border-red-500/30">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
