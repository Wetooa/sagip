"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, Navigation, Save, Loader2 } from "lucide-react";

export default function DebugPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [currentStoredLocation, setCurrentStoredLocation] = useState<{
    latitude: number;
    longitude: number;
    timestamp?: string;
  } | null>(null);

  // Load current location from localStorage
  useEffect(() => {
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      try {
        const location = JSON.parse(storedLocation);
        if (location.latitude && location.longitude) {
          setCurrentStoredLocation(location);
          setSelectedLocation({ latitude: location.latitude, longitude: location.longitude });
          setLatInput(location.latitude.toString());
          setLngInput(location.longitude.toString());
        }
      } catch (e) {
        // Invalid stored location
      }
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const defaultCenter: [number, number] = selectedLocation
      ? [selectedLocation.longitude, selectedLocation.latitude]
      : [123.8854, 10.3157]; // Cebu City default

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm-layer",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center: defaultCenter,
      zoom: 13,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    // Handle map clicks
    map.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      setSelectedLocation({ latitude: lat, longitude: lng });
      setLatInput(lat.toFixed(6));
      setLngInput(lng.toFixed(6));
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update marker when location changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedLocation) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Add new marker
    const el = document.createElement("div");
    el.className = "custom-marker";
    el.style.width = "32px";
    el.style.height = "32px";
    el.style.borderRadius = "50%";
    el.style.backgroundColor = "#ef4444";
    el.style.border = "3px solid white";
    el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
    el.style.cursor = "pointer";
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";

    // Add pin icon
    const pinSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    pinSvg.setAttribute("width", "20");
    pinSvg.setAttribute("height", "20");
    pinSvg.setAttribute("viewBox", "0 0 24 24");
    pinSvg.setAttribute("fill", "white");
    const pinPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pinPath.setAttribute(
      "d",
      "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
    );
    pinSvg.appendChild(pinPath);
    el.appendChild(pinSvg);

    markerRef.current = new maplibregl.Marker({ element: el })
      .setLngLat([selectedLocation.longitude, selectedLocation.latitude])
      .setPopup(
        new maplibregl.Popup().setHTML(`
          <div class="p-2">
            <strong>Selected Location</strong>
            <p class="text-xs mt-1">Lat: ${selectedLocation.latitude.toFixed(6)}</p>
            <p class="text-xs">Lng: ${selectedLocation.longitude.toFixed(6)}</p>
          </div>
        `)
      )
      .addTo(map.current);

    // Center map on selected location
    map.current.flyTo({
      center: [selectedLocation.longitude, selectedLocation.latitude],
      zoom: 15,
      duration: 1000,
    });
  }, [mapLoaded, selectedLocation]);

  const handleSaveLocation = () => {
    if (!selectedLocation) return;

    setIsSaving(true);
    const locationData = {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("userLocation", JSON.stringify(locationData));
    setCurrentStoredLocation(locationData);

    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event("locationUpdated"));

    setTimeout(() => {
      setIsSaving(false);
      alert("Location saved successfully!");
    }, 500);
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setSelectedLocation(location);
        setLatInput(location.latitude.toFixed(6));
        setLngInput(location.longitude.toFixed(6));
      },
      (error) => {
        alert(`Error getting location: ${error.message}`);
      }
    );
  };

  const handleManualInput = () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);

    if (isNaN(lat) || isNaN(lng)) {
      alert("Please enter valid coordinates");
      return;
    }

    if (lat < -90 || lat > 90) {
      alert("Latitude must be between -90 and 90");
      return;
    }

    if (lng < -180 || lng > 180) {
      alert("Longitude must be between -180 and 180");
      return;
    }

    setSelectedLocation({ latitude: lat, longitude: lng });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Debug Page</h1>
            <p className="text-gray-300">Location Selector - Click on map or enter coordinates</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-white/10">
                <div ref={mapContainer} className="w-full h-[600px]" />
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Current Stored Location */}
              {currentStoredLocation && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-blue-300 mb-2">Current Stored Location</h3>
                  <div className="text-xs text-gray-300 space-y-1">
                    <p>Lat: {currentStoredLocation.latitude.toFixed(6)}</p>
                    <p>Lng: {currentStoredLocation.longitude.toFixed(6)}</p>
                    {currentStoredLocation.timestamp && (
                      <p className="text-gray-400 mt-2">
                        Updated: {new Date(currentStoredLocation.timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Selected Location */}
              {selectedLocation && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-green-300 mb-2">Selected Location</h3>
                  <div className="text-xs text-gray-300 space-y-1">
                    <p>Lat: {selectedLocation.latitude.toFixed(6)}</p>
                    <p>Lng: {selectedLocation.longitude.toFixed(6)}</p>
                  </div>
                </div>
              )}

              {/* Manual Input */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-white">Manual Input</h3>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={latInput}
                    onChange={(e) => setLatInput(e.target.value)}
                    onBlur={handleManualInput}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10.3157"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={lngInput}
                    onChange={(e) => setLngInput(e.target.value)}
                    onBlur={handleManualInput}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123.8854"
                  />
                </div>
                <button
                  onClick={handleManualInput}
                  className="w-full py-2 px-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-sm font-medium text-white transition-all flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Update from Input
                </button>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={handleUseGPS}
                  className="w-full py-3 px-4 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-sm font-medium text-white transition-all flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Use GPS Location
                </button>
                <button
                  onClick={handleSaveLocation}
                  disabled={!selectedLocation || isSaving}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-white transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Location
                    </>
                  )}
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-yellow-300 mb-2">Instructions</h3>
                <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                  <li>Click on the map to select a location</li>
                  <li>Or enter coordinates manually</li>
                  <li>Or use GPS to get your current location</li>
                  <li>Click "Save Location" to update localStorage</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
