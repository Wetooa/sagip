"use client";

import { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

interface LocationSearchProps {
  map: maplibregl.Map | null;
}

interface GeocodeResult {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    display_name: string;
    place_id: number;
    [key: string]: unknown;
  };
}

export default function LocationSearch({ map }: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/geocode?q=${encodeURIComponent(query)}`,
        );
        if (!response.ok) {
          throw new Error("Geocoding failed");
        }
        const data = await response.json();
        setResults(data.features || []);
        setShowResults(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Error searching:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (result: GeocodeResult) => {
    if (!map) return;

    const [lng, lat] = result.geometry.coordinates;

    // Fly to the location
    map.flyTo({
      center: [lng, lat],
      zoom: 15,
      duration: 1500,
    });

    // Close results and clear query
    setShowResults(false);
    setQuery(result.properties.display_name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (
      e.key === "Enter" &&
      selectedIndex >= 0 &&
      results[selectedIndex]
    ) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowResults(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) {
              setShowResults(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search for a location in Cebu..."
          className="w-full px-4 py-2.5 pr-10 text-sm rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6B1515] focus:border-transparent"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#6B1515]"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-50">
          {results.map((result, index) => (
            <button
              key={result.properties.place_id}
              onClick={() => handleSelect(result)}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-[#6B1515]/10 transition-colors ${
                index === selectedIndex ? "bg-[#6B1515]/20" : ""
              } ${index !== results.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <div className="font-medium text-gray-900">
                {result.properties.display_name}
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults &&
        !loading &&
        results.length === 0 &&
        query.trim().length >= 2 && (
          <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3 z-50">
            <div className="text-sm text-gray-500">No results found</div>
          </div>
        )}
    </div>
  );
}
