"use client";

import { useState, useEffect } from 'react';
import { User, Map, Ticket, Radio, MessageCircle, MapPin, Sparkles, Shield, TrendingUp, Navigation, Loader2 } from 'lucide-react';
import { useNearestEvacuationCenters } from '@/lib/api/routing';
import { EvacuationRouteMap } from '@/components/EvacuationRouteMap';
import { useState, useEffect, useRef } from "react";
import {
  User,
  Ticket,
  Radio,
  MessageCircle,
  MapPin,
  Sparkles,
  TrendingUp,
  X,
  AlertTriangle,
  Phone,
  CheckCircle2,
  Clock,
  Package,
  Smartphone,
  Send,
  Navigation,
  AlertCircle,
  Map,
} from "lucide-react";
import Link from "next/link";

type Tab =
  | "profile"
  | "tickets"
  | "lora"
  | "chatbot"
  | "evacuation";

type TicketType = "rescue" | "medical" | "supplies" | "evacuation" | "other";
type LoRaStatus = "none" | "pending" | "eligible" | "not-eligible" | "claimed";

interface EvacuationCenter {
  id: string;
  name: string;
  distance: string;
  capacity: number;
  icon: string;
  color: string;
  coords: [number, number];
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [loraStatus, setLoraStatus] = useState<LoRaStatus>("none");
  const [selectedEvacCenter, setSelectedEvacCenter] = useState<EvacuationCenter | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "tickets":
        return (
          <TicketSystemTab onCreateTicket={() => setIsTicketModalOpen(true)} />
        );
      case "lora":
        return (
          <LoRaTab loraStatus={loraStatus} setLoraStatus={setLoraStatus} />
        );
      case "chatbot":
        return <ChatbotTab />;
      case "evacuation":
        return <EvacuationPointsTab onSelectCenter={setSelectedEvacCenter} />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="relative w-full max-w-sm">
        {/* Phone Bezel */}
        <div className="rounded-[3rem] border-[12px] border-[#1a1a1a] shadow-2xl overflow-hidden bg-black">
          {/* Status Bar */}
          <div className="bg-[#1a1a1a] text-white px-6 py-2 flex justify-between items-center text-xs font-semibold">
            <span>9:41</span>
            <div className="flex gap-1">
              <span>📶</span>
              <span>📡</span>
              <span>🔋</span>
            </div>
          </div>

          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-[#1a1a1a] rounded-b-3xl z-10"></div>

          {/* Screen Content */}
          <div
            className="bg-gradient-to-br from-[#0f172a] via-[#1a1f35] to-[#111827] flex flex-col relative overflow-hidden"
            style={{ height: "844px" }}
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8B0000]/10 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#0ea5e9]/10 to-transparent rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <header className="bg-gradient-to-r from-[#8B0000]/20 to-[#6B1515]/20 backdrop-blur-md text-white px-4 py-3 shadow-lg flex-shrink-0 border-b border-white/10 relative z-10">
              <div className="flex items-center justify-between">
                <img src="/logo.png" alt="SAGIP" className="h-5" />
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`p-1 transition-all duration-300 ${
                    activeTab === "profile"
                      ? "text-[#F5E6C8]"
                      : "text-[#F5E6C8]/70 hover:text-[#F5E6C8]"
                  }`}
                >
                  <User
                    className="w-5 h-5"
                    strokeWidth={activeTab === "profile" ? 2.5 : 2}
                  />
                </button>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-3 py-4 pb-24 space-y-3 relative z-10">
              {renderContent()}
            </main>

            {/* Bottom Navigation */}
            <nav className="bg-gradient-to-t from-[#0f172a]/98 to-[#1a1f35]/90 backdrop-blur-xl px-2 py-3 grid grid-cols-5 gap-2 absolute bottom-0 left-0 right-0 border-t border-white/10 z-50 pointer-events-auto">
              <Link
                href="/"
                className="flex flex-col items-center justify-center py-2.5 px-1 rounded-lg transition-all duration-300 cursor-pointer w-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              >
                <AlertCircle className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium">Hazard</span>
              </Link>
              <NavTab
                icon={Ticket}
                label="Tickets"
                active={activeTab === "tickets"}
                onClick={() => setActiveTab("tickets")}
              />
              <NavTab
                icon={Radio}
                label="LoRa"
                active={activeTab === "lora"}
                onClick={() => setActiveTab("lora")}
              />
              <NavTab
                icon={MessageCircle}
                label="Chat"
                active={activeTab === "chatbot"}
                onClick={() => setActiveTab("chatbot")}
              />
              <NavTab
                icon={MapPin}
                label="Evacuation"
                active={activeTab === "evacuation"}
                onClick={() => setActiveTab("evacuation")}
              />
            </nav>

            {/* Ticket Modal */}
            <TicketModal
              isOpen={isTicketModalOpen}
              onClose={() => setIsTicketModalOpen(false)}
            />

            {/* Evacuation Route Modal */}
            <EvacuationRouteModal
              center={selectedEvacCenter}
              onClose={() => setSelectedEvacCenter(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface NavTabProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavTab({ icon: Icon, label, active, onClick }: NavTabProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg transition-all duration-300 cursor-pointer w-full ${
        active
          ? "bg-gradient-to-br from-[#8B0000] to-[#6B1515] text-white shadow-lg shadow-[#8B0000]/50"
          : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs font-semibold mt-1 leading-none">{label}</span>
    </button>
  );
}

// Tab Components
function ProfileTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">My Profile</h2>
        <Sparkles className="w-5 h-5 text-[#ff6b6b]" />
      </div>

      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/10 hover:border-white/20 transition-all">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#ff6b6b] to-[#ff8e72] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#ff6b6b]/40">
            JD
          </div>
          <div>
            <p className="font-semibold text-white">John Doe</p>
            <p className="text-sm text-gray-300">Registered Citizen</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 px-3 bg-white/5 rounded-lg border border-white/5">
            <span className="text-gray-400">Email:</span>
            <span className="font-medium text-white">john@example.com</span>
          </div>
          <div className="flex justify-between items-center py-2 px-3 bg-white/5 rounded-lg border border-white/5">
            <span className="text-gray-400">Phone:</span>
            <span className="font-medium text-white">09123456789</span>
          </div>
          <div className="flex justify-between items-center py-2 px-3 bg-white/5 rounded-lg border border-white/5">
            <span className="text-gray-400">Address:</span>
            <span className="font-medium text-white text-right">Cebu City</span>
          </div>
          <div className="flex justify-between items-center py-2 px-3 bg-gradient-to-r from-green-500/10 to-green-400/10 rounded-lg border border-green-500/20">
            <span className="text-gray-400">Volunteer:</span>
            <span className="font-medium text-green-400">✓ Active</span>
          </div>
        </div>
      </div>

      <button className="w-full py-3 bg-gradient-to-r from-[#8B0000] to-[#6B1515] text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-[#8B0000]/50 transition-all duration-300">
        Edit Profile
      </button>
    </div>
  );
}

function TicketSystemTab({ onCreateTicket }: { onCreateTicket: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Support Tickets</h2>
        <TrendingUp className="w-5 h-5 text-purple-400" />
      </div>

      <div className="space-y-2">
        <div className="bg-gradient-to-r from-green-500/10 to-green-400/10 backdrop-blur-xl rounded-xl p-3 shadow-lg border border-green-500/20 hover:border-green-500/40 transition-all">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-white text-sm">Ticket #001</h3>
            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
              ✓ RESOLVED
            </span>
          </div>
          <p className="text-xs text-gray-300">Water supply assistance</p>
        </div>

        <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-400/10 backdrop-blur-xl rounded-xl p-3 shadow-lg border border-yellow-500/20 hover:border-yellow-500/40 transition-all">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-white text-sm">Ticket #002</h3>
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-medium">
              ⏳ IN PROGRESS
            </span>
          </div>
          <p className="text-xs text-gray-300">Medical aid request</p>
        </div>
      </div>

      <button
        onClick={onCreateTicket}
        className="w-full py-3 bg-gradient-to-r from-[#8B0000] to-[#6B1515] text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-[#8B0000]/50 transition-all duration-300"
      >
        Create New Ticket
      </button>
    </div>
  );
}

function LoRaTab({
  loraStatus,
  setLoraStatus,
}: {
  loraStatus: LoRaStatus;
  setLoraStatus: (status: LoRaStatus) => void;
}) {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = () => {
    setIsApplying(true);
    // Simulate eligibility check
    setTimeout(() => {
      setIsApplying(false);
      // Randomly decide eligibility for demo (in real app, this would be based on criteria)
      const isEligible = Math.random() > 0.3;
      setLoraStatus(isEligible ? "eligible" : "not-eligible");
    }, 2000);
  };

  const handleClaim = () => {
    setLoraStatus("pending");
    // Simulate claiming process
    setTimeout(() => {
      setLoraStatus("claimed");
    }, 1500);
  };

  // User has a claimed LoRa device
  if (loraStatus === "claimed") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">LoRa Device</h2>
          <Radio className="w-5 h-5 text-cyan-400" />
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-400/10 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-green-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/30 to-green-400/20 rounded-xl flex items-center justify-center border border-green-500/30">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Device Active</h3>
              <p className="text-xs text-green-300">LoRa-SAGIP-0847</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <p className="text-xs text-gray-400 mb-1">Temperature</p>
              <p className="font-bold text-white text-lg">28°C</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <p className="text-xs text-gray-400 mb-1">Humidity</p>
              <p className="font-bold text-white text-lg">65%</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <p className="text-xs text-gray-400 mb-1">Rainfall</p>
              <p className="font-bold text-white text-lg">12mm</p>
            </div>
          </div>
        </div>

        <button className="w-full py-3 bg-gradient-to-r from-[#8B0000] to-[#6B1515] text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-[#8B0000]/50 transition-all duration-300">
          View Device Details
        </button>
      </div>
    );
  }

  // User is eligible and can claim
  if (loraStatus === "eligible") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">LoRa Device</h2>
          <Radio className="w-5 h-5 text-cyan-400" />
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-400/10 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-green-500/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500/30 to-green-400/20 rounded-lg flex items-center justify-center border border-green-500/30">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-green-300">You're Eligible!</h3>
              <p className="text-xs text-gray-400">
                You can claim a LoRa device
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-300 mb-3">
            Based on your location in a high-risk area, you qualify for a free
            LoRa weather station.
          </p>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 mb-3">
            <h4 className="text-sm font-medium text-white mb-2">
              📦 Delivery Information
            </h4>
            <p className="text-xs text-gray-400">
              Your device will be delivered to your registered address within
              5-7 business days. A technician will help with installation.
            </p>
          </div>
        </div>

        <button
          onClick={handleClaim}
          className="w-full py-3 bg-gradient-to-r from-[#8B0000] to-[#6B1515] text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-[#8B0000]/50 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" />
          Claim Your LoRa Device
        </button>
      </div>
    );
  }

  // User's claim is pending
  if (loraStatus === "pending") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">LoRa Device</h2>
          <Radio className="w-5 h-5 text-cyan-400" />
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-400/10 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-yellow-500/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/30 to-yellow-400/20 rounded-lg flex items-center justify-center border border-yellow-500/30 animate-pulse">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-300">
                Claim Processing
              </h3>
              <p className="text-xs text-gray-400">
                Your device is being prepared
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Eligibility verified</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Device allocated</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-yellow-300">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span>Awaiting shipment...</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <p className="text-xs text-gray-400">
            📍 Delivery to:{" "}
            <span className="text-white">Your registered address</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            📅 Expected: <span className="text-white">5-7 business days</span>
          </p>
        </div>
      </div>
    );
  }

  // User is not eligible - phone serves as LoRa with SOS
  if (loraStatus === "not-eligible") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">LoRa Device</h2>
          <Radio className="w-5 h-5 text-cyan-400" />
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-orange-400/10 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-orange-500/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500/30 to-orange-400/20 rounded-lg flex items-center justify-center border border-orange-500/30">
              <Smartphone className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold text-orange-300">
                Phone-as-LoRa Mode
              </h3>
              <p className="text-xs text-gray-400">
                Your phone serves as your emergency beacon
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-300 mb-3">
            Based on your area's risk assessment, you don't currently qualify
            for a physical LoRa device. However, your phone can serve as an
            emergency beacon!
          </p>
        </div>

        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/10">
          <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Emergency SOS
          </h4>
          <p className="text-xs text-gray-400 mb-3">
            In case of emergency, use the SOS button to send your location and
            alert emergency services.
          </p>
          <button className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-2 border-2 border-red-400/50">
            🆘 SOS EMERGENCY
          </button>
        </div>

        <p className="text-xs text-center text-gray-500">
          Your eligibility will be reassessed during the next census update
        </p>
      </div>
    );
  }

  // Default: User doesn't have LoRa yet - needs to apply
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">LoRa Device</h2>
        <Radio className="w-5 h-5 text-cyan-400" />
      </div>

      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/30 to-cyan-400/20 rounded-xl flex items-center justify-center border border-cyan-500/30">
            <Radio className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">No Device Yet</h3>
            <p className="text-xs text-gray-400">Apply to check eligibility</p>
          </div>
        </div>
        <p className="text-xs text-gray-300 mb-3">
          LoRa devices help monitor weather conditions in your area and provide
          early warnings. Apply now to check if you're eligible for a free
          device.
        </p>
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <h4 className="text-xs font-medium text-white mb-2">
            Eligibility Criteria:
          </h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Located in high-risk flood zone</li>
            <li>• Completed digital census registration</li>
            <li>• Active community participation</li>
          </ul>
        </div>
      </div>

      <button
        onClick={handleApply}
        disabled={isApplying}
        className="w-full py-3 bg-gradient-to-r from-[#8B0000] to-[#6B1515] text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-[#8B0000]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isApplying ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Checking Eligibility...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Apply for LoRa Device
          </>
        )}
      </button>
    </div>
  );
}

function ChatbotTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">SAGIP Assistant</h2>
        <Sparkles className="w-5 h-5 text-pink-400" />
      </div>

      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/10 h-40 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex justify-end">
            <div className="bg-gradient-to-r from-[#ff6b6b] to-[#ff8e72] text-white p-3 rounded-xl text-xs max-w-xs rounded-tr-none shadow-lg">
              How do I prepare for typhoons?
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-white/10 text-gray-300 p-3 rounded-xl text-xs max-w-xs rounded-tl-none border border-white/10">
              Start by securing your home and preparing an emergency kit...
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask SAGIP..."
          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] backdrop-blur-sm transition-all"
        />
        <button className="px-4 py-3 bg-gradient-to-r from-[#8B0000] to-[#6B1515] text-white rounded-xl hover:shadow-lg hover:shadow-[#8B0000]/50 transition-all">
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

const evacuationCenters: EvacuationCenter[] = [
  {
    id: "1",
    name: "Cebu Technical University",
    distance: "1.2 km",
    capacity: 500,
    icon: "🏫",
    color: "blue",
    coords: [123.8954, 10.3257],
  },
  {
    id: "2",
    name: "Don Bosco High School",
    distance: "2.5 km",
    capacity: 800,
    icon: "🏢",
    color: "green",
    coords: [123.8754, 10.3057],
  },
  {
    id: "3",
    name: "Civic Center",
    distance: "3.1 km",
    capacity: 1500,
    icon: "🏛️",
    color: "red",
    coords: [123.8654, 10.3357],
  },
];

function EvacuationPointsTab({ onSelectCenter }: { onSelectCenter: (center: EvacuationCenter) => void }) {
function EvacuationPointsTab() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [vehicleType, setVehicleType] = useState<'driving' | 'walking' | 'cycling'>('driving');
  const [showMap, setShowMap] = useState(false);

  // Get user location on mount
  useEffect(() => {
    // Try to get location from localStorage first
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      try {
        const location = JSON.parse(storedLocation);
        if (location.latitude && location.longitude) {
          setUserLocation({ latitude: location.latitude, longitude: location.longitude });
          return;
        }
      } catch (e) {
        // Invalid stored location, continue to GPS
      }
    }

    // Try to get current location from GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(location);
          // Store in localStorage for future use
          localStorage.setItem('userLocation', JSON.stringify({
            ...location,
            timestamp: new Date().toISOString(),
          }));
        },
        (error) => {
          setLocationError('Unable to get your location. Please enable location services.');
          // Fallback to Cebu City coordinates
          setUserLocation({ latitude: 10.3157, longitude: 123.8854 });
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      // Fallback to Cebu City coordinates
      setUserLocation({ latitude: 10.3157, longitude: 123.8854 });
    }
  }, []);

  const { data, isLoading, error } = useNearestEvacuationCenters(
    userLocation?.latitude ?? null,
    userLocation?.longitude ?? null,
    vehicleType,
    true
  );

  const formatDistance = (meters: number | null): string => {
    if (meters === null) return 'Unknown';
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number | null): string => {
    if (seconds === null) return 'Unknown';
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-blue-500/10 to-blue-400/10 border-blue-500/20 hover:border-blue-500/40';
      case 2:
        return 'from-green-500/10 to-green-400/10 border-green-500/20 hover:border-green-500/40';
      case 3:
        return 'from-orange-500/10 to-orange-400/10 border-orange-500/20 hover:border-orange-500/40';
      default:
        return 'from-gray-500/10 to-gray-400/10 border-gray-500/20 hover:border-gray-500/40';
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '📍';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Evacuation Centers</h2>
        <MapPin className="w-5 h-5 text-red-400" />
      </div>

      <p className="text-xs text-gray-400">Tap on a center to view route directions</p>

      <div className="space-y-2">
        {evacuationCenters.map((center) => (
          <button
            key={center.id}
            onClick={() => onSelectCenter(center)}
            className={`w-full text-left bg-gradient-to-r ${
              center.color === "blue" ? "from-blue-500/10 to-blue-400/10 border-blue-500/20 hover:border-blue-500/40" :
              center.color === "green" ? "from-green-500/10 to-green-400/10 border-green-500/20 hover:border-green-500/40" :
              "from-red-500/10 to-red-400/10 border-red-500/20 hover:border-red-500/40"
            } backdrop-blur-xl rounded-xl p-3 shadow-lg border transition-all`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm">{center.name}</h3>
                <p className="text-xs text-gray-400">
                  {center.distance} away • {center.capacity} capacity
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{center.icon}</span>
                <Navigation className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <MapPin className="w-4 h-4 text-[#8B0000]" />
          <span>Your location is used to calculate nearest centers</span>
        </div>
      </div>
    </div>
  );
}

// Ticket Modal Component
interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ticketTypes: {
  id: TicketType;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    id: "rescue",
    label: "Rescue Request",
    icon: "🆘",
    description: "Request immediate rescue assistance",
  },
  {
    id: "medical",
    label: "Medical Aid",
    icon: "🏥",
    description: "Request medical supplies or assistance",
  },
  {
    id: "supplies",
    label: "Food & Supplies",
    icon: "📦",
    description: "Request food, water, or basic supplies",
  },
  {
    id: "evacuation",
    label: "Evacuation Help",
    icon: "🚐",
    description: "Request transportation to evacuation center",
  },
  {
    id: "other",
    label: "Other",
    icon: "📝",
    description: "Other emergency assistance",
  },
];

function TicketModal({ isOpen, onClose }: TicketModalProps) {
  const [ticketType, setTicketType] = useState<TicketType | null>(null);
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<
    "low" | "medium" | "high" | "critical"
  >("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
    if (!ticketType || !description.trim()) return;

    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setTicketType(null);
        setDescription("");
        setPriority("medium");
        setIsSuccess(false);
      }, 1500);
    }, 1500);
  };

  const resetAndClose = () => {
    onClose();
    setTicketType(null);
    setDescription("");
    setPriority("medium");
    setIsSuccess(false);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#111827] to-[#0f172a] rounded-3xl w-full max-w-sm max-h-[85vh] overflow-hidden border border-white/10 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1a1f35]/95 to-[#111827]/95 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Create New Ticket</h2>
            <p className="text-xs text-gray-400 mt-1">
              Request emergency assistance
            </p>
          </div>
          <button
            onClick={resetAndClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
      {locationError && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-xs text-yellow-300">
          {locationError}
        </div>
      )}

      {/* Vehicle Type Selector */}
      <div className="flex gap-2">
        {(['driving', 'walking', 'cycling'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setVehicleType(type)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
              vehicleType === type
                ? 'bg-gradient-to-r from-[#ff6b6b] to-[#ff8e72] text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
          <span className="ml-2 text-sm text-gray-300">Finding nearest evacuation centers...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-300">
          Failed to load evacuation centers: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      )}

      {data && data.centers && (
        <>
          <div className="space-y-2">
            {data.centers.map((center) => (
              <div
                key={center.rank}
                className={`bg-gradient-to-r ${getRankColor(center.rank)} backdrop-blur-xl rounded-xl p-3 shadow-lg border transition-all`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getRankBadge(center.rank)}</span>
                      <h3 className="font-semibold text-white text-sm">
                        {center.evacuation_center.name || `Evacuation Center #${center.rank}`}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-400">
                      {formatDistance(center.route_distance_meters)} away • {formatDuration(center.route_duration_seconds)}
                    </p>
                    {center.evacuation_center.capacity && (
                      <p className="text-xs text-gray-500 mt-1">
                        Capacity: {center.evacuation_center.capacity}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowMap(true)}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            Show Routes on Map
          </button>
        </>
      )}

      {showMap && userLocation && data?.centers && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-2">
          <div className="bg-white rounded-2xl w-full h-full max-h-[90vh] overflow-hidden relative">
            <EvacuationRouteMap
              userLocation={userLocation}
              centers={data.centers}
              onClose={() => setShowMap(false)}
            />

        {/* Content */}
        <div
          className="overflow-y-auto px-6 py-6 space-y-5"
          style={{ maxHeight: "calc(85vh - 140px)" }}
        >
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/30 to-green-400/20 rounded-full flex items-center justify-center border border-green-500/30 mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Ticket Submitted!
              </h3>
              <p className="text-xs text-gray-400 text-center">
                Your request has been received. Help is on the way.
              </p>
              <p className="text-sm text-green-400 mt-2 font-medium">
                Ticket #003
              </p>
            </div>
          ) : (
            <>
              {/* Ticket Type Selection */}
              <div>
                <label className="text-sm font-medium text-white mb-3 block">
                  What do you need help with?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ticketTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setTicketType(type.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        ticketType === type.id
                          ? "bg-gradient-to-r from-[#8B0000]/30 to-[#6B1515]/30 border-[#8B0000]/50"
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <span className="text-xl mb-1 block">{type.icon}</span>
                      <span
                        className={`text-xs font-medium block ${ticketType === type.id ? "text-white" : "text-gray-300"}`}
                      >
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Selection */}
              <div>
                <label className="text-sm font-medium text-white mb-3 block">
                  Priority Level
                </label>
                <div className="flex gap-2">
                  {[
                    { id: "low", label: "Low", color: "green" },
                    { id: "medium", label: "Medium", color: "yellow" },
                    { id: "high", label: "High", color: "orange" },
                    { id: "critical", label: "Critical", color: "red" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPriority(p.id as typeof priority)}
                      className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all border ${
                        priority === p.id
                          ? p.color === "green"
                            ? "bg-green-500/30 border-green-500/50 text-green-300"
                            : p.color === "yellow"
                              ? "bg-yellow-500/30 border-yellow-500/50 text-yellow-300"
                              : p.color === "orange"
                                ? "bg-orange-500/30 border-orange-500/50 text-orange-300"
                                : "bg-red-500/30 border-red-500/50 text-red-300"
                          : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-white mb-3 block">
                  Describe your situation
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide details about your emergency..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B0000] backdrop-blur-sm transition-all resize-none"
                />
              </div>

              {/* Location Info */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <MapPin className="w-4 h-4 text-[#8B0000]" />
                  <span>Location will be automatically attached</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!isSuccess && (
          <div className="sticky bottom-0 bg-gradient-to-t from-[#0f172a] to-transparent p-6 pt-2">
            <button
              onClick={handleSubmit}
              disabled={!ticketType || !description.trim() || isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-[#8B0000] to-[#6B1515] text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-[#8B0000]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Ticket
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Evacuation Route Modal Component
function EvacuationRouteModal({ center, onClose }: { center: EvacuationCenter | null; onClose: () => void }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const userLocation: [number, number] = [123.8854, 10.3157]; // Mock user location

  useEffect(() => {
    if (!center || !mapContainer.current) return;

    // Clean up existing map
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const loadMap = async () => {
      const maplibregl = (await import("maplibre-gl")).default;
      await import("maplibre-gl/dist/maplibre-gl.css");

      // Calculate center point between user and destination
      const centerPoint: [number, number] = [
        (userLocation[0] + center.coords[0]) / 2,
        (userLocation[1] + center.coords[1]) / 2,
      ];

      mapInstance.current = new maplibregl.Map({
        container: mapContainer.current!,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: "osm-tiles",
              type: "raster",
              source: "osm",
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: centerPoint,
        zoom: 13,
        attributionControl: false,
      });

      mapInstance.current.on("load", () => {
        setIsMapLoaded(true);

        // Add route line
        mapInstance.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [userLocation, center.coords],
            },
          },
        });

        mapInstance.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#8B0000",
            "line-width": 4,
            "line-dasharray": [2, 1],
          },
        });

        // Add user marker
        const userEl = document.createElement("div");
        userEl.className = "w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg";
        new maplibregl.Marker({ element: userEl })
          .setLngLat(userLocation)
          .addTo(mapInstance.current);

        // Add destination marker
        const destEl = document.createElement("div");
        destEl.className = "w-6 h-6 bg-[#8B0000] rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs";
        destEl.innerHTML = "📍";
        new maplibregl.Marker({ element: destEl })
          .setLngLat(center.coords)
          .addTo(mapInstance.current);

        mapInstance.current.resize();
      });
    };

    loadMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [center]);

  if (!center) return null;

  return (
    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a1f35]/95 to-[#111827]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[#8B0000]" />
              Route to Evacuation
            </h2>
            <p className="text-xs text-gray-400">{center.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="w-full h-full" />
        {!isMapLoaded && (
          <div className="absolute inset-0 bg-[#0f172a] flex items-center justify-center">
            <div className="text-center">
              <Map className="w-12 h-12 text-[#0ea5e9] mx-auto mb-2 animate-pulse" />
              <p className="text-sm text-gray-300">Loading Route...</p>
            </div>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="bg-gradient-to-t from-[#0f172a]/98 to-[#1a1f35]/90 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{center.icon}</span>
              <div>
                <h3 className="font-semibold text-white text-sm">{center.name}</h3>
                <p className="text-xs text-gray-400">Evacuation Center</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-xs text-gray-400">Distance</p>
              <p className="font-bold text-white">{center.distance}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-xs text-gray-400">Capacity</p>
              <p className="font-bold text-white">{center.capacity}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-xs text-gray-400">Est. Time</p>
              <p className="font-bold text-white">~15 min</p>
            </div>
          </div>
        </div>
        <button className="w-full mt-3 py-3 bg-gradient-to-r from-[#8B0000] to-[#6B1515] text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-[#8B0000]/50 transition-all duration-300 flex items-center justify-center gap-2">
          <Navigation className="w-4 h-4" />
          Start Navigation
        </button>
      </div>
      )}

      {!isLoading && !error && data && (!data.centers || data.centers.length === 0) && (
        <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-4 text-center text-sm text-gray-400">
          No evacuation centers found nearby.
        </div>
      )}
    </div>
  );
}