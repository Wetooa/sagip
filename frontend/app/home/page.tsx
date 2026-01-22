'use client';

import { useState, useEffect } from 'react';
import { User, Map, Ticket, Radio, MessageCircle, MapPin, Sparkles, Shield, TrendingUp, Navigation, Loader2 } from 'lucide-react';
import { useNearestEvacuationCenters } from '@/lib/api/routing';
import { EvacuationRouteMap } from '@/components/EvacuationRouteMap';

type Tab = 'profile' | 'mapping' | 'tickets' | 'lora' | 'chatbot' | 'evacuation';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'mapping':
        return <HazardMappingTab />;
      case 'tickets':
        return <TicketSystemTab />;
      case 'lora':
        return <LoRaTab />;
      case 'chatbot':
        return <ChatbotTab />;
      case 'evacuation':
        return <EvacuationPointsTab />;
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
          <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white px-6 py-2 flex justify-between items-center text-xs font-semibold">
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
            style={{ height: '844px' }}
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8B0000]/10 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#0ea5e9]/10 to-transparent rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <header className="bg-gradient-to-r from-[#8B0000]/20 to-[#6B1515]/20 backdrop-blur-md text-white px-4 py-3 shadow-lg flex-shrink-0 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-2">
                <img src="/sagip-logo.svg" alt="SAGIP" className="w-7 h-7" />
                <h1 className="text-lg font-bold bg-gradient-to-r from-[#ff6b6b] to-[#ff8e72] bg-clip-text text-transparent">SAGIP</h1>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-3 py-4 pb-24 space-y-3 relative z-10">
              {renderContent()}
            </main>

            {/* Bottom Navigation */}
            <nav className="bg-gradient-to-t from-[#0f172a]/98 to-[#1a1f35]/90 backdrop-blur-xl px-2 py-3 grid grid-cols-6 gap-1.5 absolute bottom-0 left-0 right-0 border-t border-white/10 z-50 pointer-events-auto">
              <NavTab
                icon={User}
                label="Profile"
                active={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
              />
              <NavTab
                icon={Map}
                label="Mapping"
                active={activeTab === 'mapping'}
                onClick={() => setActiveTab('mapping')}
              />
              <NavTab
                icon={Ticket}
                label="Tickets"
                active={activeTab === 'tickets'}
                onClick={() => setActiveTab('tickets')}
              />
              <NavTab
                icon={Radio}
                label="LoRa"
                active={activeTab === 'lora'}
                onClick={() => setActiveTab('lora')}
              />
              <NavTab
                icon={MessageCircle}
                label="Chat"
                active={activeTab === 'chatbot'}
                onClick={() => setActiveTab('chatbot')}
              />
              <NavTab
                icon={MapPin}
                label="Evacuation"
                active={activeTab === 'evacuation'}
                onClick={() => setActiveTab('evacuation')}
              />
            </nav>
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
          ? 'bg-gradient-to-br from-[#ff6b6b] to-[#ff8e72] text-white shadow-lg shadow-[#ff6b6b]/50'
          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
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

      <button className="w-full py-3 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e72] text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-[#ff6b6b]/50 transition-all duration-300">
        Edit Profile
      </button>
    </div>
  );
}

function HazardMappingTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Hazard Mapping</h2>
        <Shield className="w-5 h-5 text-[#0ea5e9]" />
      </div>

      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/10 overflow-hidden">
        <div className="w-full h-48 bg-gradient-to-br from-[#0ea5e9]/20 to-[#06b6d4]/10 rounded-xl mb-3 flex items-center justify-center border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:via-white/10 transition-all"></div>
          <div className="text-center relative z-10">
            <Map className="w-12 h-12 text-[#0ea5e9] mx-auto mb-2" />
            <p className="text-sm text-gray-300">Interactive Map</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <p className="text-gray-300">📍 Current Location: Cebu City</p>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 rounded-full text-xs font-medium border border-red-500/30">
              🔴 HIGH RISK
            </span>
            <span className="px-3 py-1 bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-300 rounded-full text-xs font-medium border border-orange-500/30">
              🌊 FLOOD ZONE
            </span>
          </div>
        </div>
      </div>

      <button className="w-full py-3 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-[#0ea5e9]/50 transition-all duration-300">
        View Full Map
      </button>
    </div>
  );
}

function TicketSystemTab() {
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
            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">✓ RESOLVED</span>
          </div>
          <p className="text-xs text-gray-300">Water supply assistance</p>
        </div>

        <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-400/10 backdrop-blur-xl rounded-xl p-3 shadow-lg border border-yellow-500/20 hover:border-yellow-500/40 transition-all">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-white text-sm">Ticket #002</h3>
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-medium">⏳ IN PROGRESS</span>
          </div>
          <p className="text-xs text-gray-300">Medical aid request</p>
        </div>
      </div>

      <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
        Create New Ticket
      </button>
    </div>
  );
}

function LoRaTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">LoRa Devices</h2>
        <Radio className="w-5 h-5 text-cyan-400" />
      </div>

      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/10 hover:border-white/20 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white">Weather Station 01</h3>
            <p className="text-xs text-gray-400">Signal: Excellent • Last update: 2 min ago</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-green-500/30 to-green-400/20 rounded-lg flex items-center justify-center border border-green-500/30">
            <span className="text-green-400 font-bold text-lg">●</span>
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

      <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300">
        View All Devices
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
        <button className="px-4 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e72] text-white rounded-xl hover:shadow-lg hover:shadow-[#ff6b6b]/50 transition-all">
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

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
          </div>
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
