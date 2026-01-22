"use client";

import { useState } from "react";
import {
  Radio,
  MapPin,
  Clock,
  AlertCircle,
  Navigation,
  Phone,
  User,
} from "lucide-react";

interface SOSAlert {
  id: string;
  location: [number, number];
  timestamp: string;
  status: "critical" | "high" | "medium";
  name: string;
  deviceId: string;
  batteryLevel: number;
  signalStrength: number;
}

interface LoRaPanelProps {
  alerts: Array<{
    id: string;
    location: [number, number];
    timestamp: string;
    status: "critical" | "high" | "medium";
    name: string;
  }>;
}

export default function LoRaPanel({ alerts }: LoRaPanelProps) {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [sosAlerts] = useState<SOSAlert[]>([
    {
      id: "1",
      location: [123.8854, 10.3157],
      timestamp: new Date(Date.now() - 120000).toISOString(),
      status: "critical",
      name: "Zone A-12",
      deviceId: "LORA-001",
      batteryLevel: 45,
      signalStrength: 78,
    },
    {
      id: "2",
      location: [123.8754, 10.3257],
      timestamp: new Date(Date.now() - 300000).toISOString(),
      status: "high",
      name: "Sector B-5",
      deviceId: "LORA-002",
      batteryLevel: 82,
      signalStrength: 92,
    },
    {
      id: "3",
      location: [123.8954, 10.3057],
      timestamp: new Date(Date.now() - 600000).toISOString(),
      status: "medium",
      name: "Area C-8",
      deviceId: "LORA-003",
      batteryLevel: 67,
      signalStrength: 65,
    },
    {
      id: "4",
      location: [123.8654, 10.3357],
      timestamp: new Date(Date.now() - 180000).toISOString(),
      status: "critical",
      name: "District D-3",
      deviceId: "LORA-004",
      batteryLevel: 23,
      signalStrength: 45,
    },
    {
      id: "5",
      location: [123.9054, 10.2957],
      timestamp: new Date(Date.now() - 420000).toISOString(),
      status: "high",
      name: "Zone E-7",
      deviceId: "LORA-005",
      batteryLevel: 91,
      signalStrength: 88,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor(
      (Date.now() - new Date(timestamp).getTime()) / 1000,
    );
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="h-full flex">
      {/* Alerts List */}
      <div className="w-96 border-r border-white/10 overflow-y-auto">
        <div className="p-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
            <Radio className="w-5 h-5 text-[#6B1515]" />
            LoRa SOS Alerts
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {sosAlerts.length} active signals
          </p>
        </div>

        <div className="divide-y divide-white/10">
          {sosAlerts.map((alert) => (
            <button
              key={alert.id}
              onClick={() => setSelectedAlert(alert.id)}
              className={`w-full p-4 text-left transition-colors hover:bg-white/5 ${
                selectedAlert === alert.id ? "bg-white/10" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${getStatusColor(alert.status)} animate-pulse`}
                  ></div>
                  <span className="font-semibold text-white">{alert.name}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {getTimeAgo(alert.timestamp)}
                </span>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-3 h-3" />
                  <span className="font-mono text-xs">
                    {alert.location[0].toFixed(4)},{" "}
                    {alert.location[1].toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Radio className="w-3 h-3" />
                  <span className="text-xs">{alert.deviceId}</span>
                </div>
              </div>

              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      alert.batteryLevel > 50
                        ? "bg-green-500"
                        : alert.batteryLevel > 20
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-xs text-gray-400">
                    {alert.batteryLevel}%
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      alert.signalStrength > 70
                        ? "bg-green-500"
                        : alert.signalStrength > 40
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-xs text-gray-400">
                    Signal {alert.signalStrength}%
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="flex-1 overflow-y-auto">
        {selectedAlert ? (
          <AlertDetail alert={sosAlerts.find((a) => a.id === selectedAlert)!} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Radio className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Select an alert to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AlertDetail({ alert }: { alert: SOSAlert }) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`w-4 h-4 rounded-full ${
              alert.status === "critical"
                ? "bg-red-500"
                : alert.status === "high"
                  ? "bg-orange-500"
                  : "bg-yellow-500"
            } animate-pulse`}
          ></div>
          <h2 className="text-2xl font-bold text-white">{alert.name}</h2>
        </div>
        <p className="text-sm text-gray-400">Device ID: {alert.deviceId}</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all">
          <div className="text-sm text-gray-400 mb-1">Status</div>
          <div className="text-lg font-semibold text-white capitalize">
            {alert.status}
          </div>
        </div>
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all">
          <div className="text-sm text-gray-400 mb-1">Time Elapsed</div>
          <div className="text-lg font-semibold text-white">
            {Math.floor(
              (Date.now() - new Date(alert.timestamp).getTime()) / 60000,
            )}
            m
          </div>
        </div>
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all">
          <div className="text-sm text-gray-400 mb-1">Battery</div>
          <div className="text-lg font-semibold text-white">
            {alert.batteryLevel}%
          </div>
        </div>
        <div className="bg-[#1e293b]/50 rounded-lg p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Signal</div>
          <div className="text-lg font-semibold text-white">
            {alert.signalStrength}%
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all">
        <h3 className="text-sm font-semibold mb-3 text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#6B1515]" />
          GPS Coordinates
        </h3>
        <div className="font-mono text-lg text-white">
          {alert.location[0].toFixed(6)}, {alert.location[1].toFixed(6)}
        </div>
        <button className="mt-3 text-sm text-[#6B1515] hover:underline flex items-center gap-1">
          <Navigation className="w-3 h-3" />
          Navigate to location
        </button>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button className="w-full bg-gradient-to-r from-[#8B0000] to-[#6B1515] hover:shadow-lg hover:shadow-[#8B0000]/50 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300">
          <Navigation className="w-5 h-5" />
          Dispatch Rescue Team
        </button>
        <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all border border-white/20">
          <Phone className="w-5 h-5" />
          Contact Emergency Services
        </button>
      </div>

      {/* Timeline */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all">
        <h3 className="text-sm font-semibold mb-3 text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#6B1515]" />
          Event Timeline
        </h3>
        <div className="space-y-3">
          <TimelineItem
            time={new Date(alert.timestamp).toLocaleTimeString()}
            event="SOS signal received"
            type="alert"
          />
          <TimelineItem
            time={new Date(Date.now() - 60000).toLocaleTimeString()}
            event="Location verified"
            type="info"
          />
          <TimelineItem
            time={new Date().toLocaleTimeString()}
            event="Awaiting response"
            type="pending"
          />
        </div>
      </div>
    </div>
  );
}

function TimelineItem({
  time,
  event,
  type,
}: {
  time: string;
  event: string;
  type: string;
}) {
  const color =
    type === "alert"
      ? "bg-red-500"
      : type === "info"
        ? "bg-blue-500"
        : "bg-yellow-500";
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <div className="w-px h-full bg-white/10 mt-1"></div>
      </div>
      <div>
        <div className="text-xs text-gray-400">{time}</div>
        <div className="text-sm text-white">{event}</div>
      </div>
    </div>
  );
}
