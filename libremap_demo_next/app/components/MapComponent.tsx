"use client";

import { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import { TyphoonData } from "./types";

interface MapComponentProps {
  typhoonData: TyphoonData | null;
  currentIndex: number;
}

export default function MapComponent({
  typhoonData,
  currentIndex,
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const tileCacheRef = useRef<Record<string, string>>({});

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          gibs: {
            type: "raster",
            tiles: [
              "https://gibs-a.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2025-11-01/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg",
            ],
            tileSize: 256,
            attribution: "NASA GIBS",
          },
        },
        layers: [
          {
            id: "gibs",
            type: "raster",
            source: "gibs",
            minzoom: 0,
            maxzoom: 9,
          },
        ],
      },
      center: [112.1, 13.2],
      zoom: 5,
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Setup layers when data loads
  useEffect(() => {
    if (!map.current || !typhoonData) return;

    const mapInstance = map.current;

    const setupLayers = () => {
      // Add all track points (faded)
      mapInstance.addSource("typhoon-points-all", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: typhoonData.track.map((point) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: point.coordinates,
            },
            properties: {
              wind: point.wind,
              description: point.description,
              date: new Date(point.date).toLocaleString(),
              pressure: point.pressure,
            },
          })),
        },
      });

      mapInstance.addLayer({
        id: "typhoon-points-all",
        type: "circle",
        source: "typhoon-points-all",
        paint: {
          "circle-radius": 4,
          "circle-color": "#cccccc",
          "circle-opacity": 0.3,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#999999",
          "circle-stroke-opacity": 0.3,
        },
      });

      // Build full track with splines
      const allSplineCoords: [number, number][] = [];
      typhoonData.track.forEach((point) => {
        if (point.spline) {
          allSplineCoords.push(...point.spline);
        } else if (allSplineCoords.length === 0) {
          allSplineCoords.push(point.coordinates);
        }
      });

      // Add full track line (faded)
      mapInstance.addSource("typhoon-track-all", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: allSplineCoords,
          },
          properties: {},
        },
      });

      mapInstance.addLayer({
        id: "typhoon-line-all",
        type: "line",
        source: "typhoon-track-all",
        paint: {
          "line-color": "#cccccc",
          "line-width": 2,
          "line-opacity": 0.3,
        },
      });

      // Add current track line (highlighted)
      mapInstance.addSource("typhoon-track-current", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [],
          },
          properties: {},
        },
      });

      mapInstance.addLayer({
        id: "typhoon-line-current",
        type: "line",
        source: "typhoon-track-current",
        paint: {
          "line-color": "#ff0000",
          "line-width": 4,
          "line-opacity": 0.9,
        },
      });

      // Add current point (highlighted)
      mapInstance.addSource("typhoon-point-current", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      mapInstance.addLayer({
        id: "typhoon-point-current",
        type: "circle",
        source: "typhoon-point-current",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "wind"],
            20,
            6,
            50,
            8,
            80,
            10,
            120,
            14,
          ],
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "wind"],
            20,
            "#00ff00",
            34,
            "#ffff00",
            64,
            "#ff9900",
            83,
            "#ff0000",
            100,
            "#cc0000",
            130,
            "#990000",
          ],
          "circle-opacity": 1,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Add popup on click
      mapInstance.on("click", "typhoon-point-current", (e) => {
        if (!e.features || e.features.length === 0) return;
        const props = e.features[0].properties;
        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `
            <strong>${props.description}</strong><br>
            Wind: ${props.wind} knots<br>
            Pressure: ${props.pressure} mb<br>
            ${props.date}
          `
          )
          .addTo(mapInstance);
      });

      // Change cursor on hover
      mapInstance.on("mouseenter", "typhoon-point-current", () => {
        mapInstance.getCanvas().style.cursor = "pointer";
      });

      mapInstance.on("mouseleave", "typhoon-point-current", () => {
        mapInstance.getCanvas().style.cursor = "";
      });

      // Preload tile cache
      preloadTileCache();
    };

    const preloadTileCache = () => {
      const uniqueDates = new Set<string>();
      typhoonData.track.forEach((point) => {
        const dateStr = new Date(point.date).toISOString().split("T")[0];
        uniqueDates.add(dateStr);
      });

      uniqueDates.forEach((dateStr) => {
        if (!tileCacheRef.current[dateStr]) {
          tileCacheRef.current[dateStr] =
            `https://gibs-a.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${dateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;
        }
      });

      console.log(`Cached ${uniqueDates.size} unique dates`);
    };

    if (mapInstance.loaded()) {
      setupLayers();
    } else {
      mapInstance.on("load", setupLayers);
    }
  }, [typhoonData]);

  // Update map when currentIndex changes
  useEffect(() => {
    if (!map.current || !typhoonData || currentIndex < 0) return;

    const mapInstance = map.current;
    const point = typhoonData.track[currentIndex];
    const date = new Date(point.date);
    const dateStr = date.toISOString().split("T")[0];

    // Update GIBS tiles
    const tileUrl =
      tileCacheRef.current[dateStr] ||
      `https://gibs-a.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${dateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;

    const source = mapInstance.getSource("gibs");
    if (source && "setTiles" in source) {
      (source as maplibregl.RasterTileSource).setTiles([tileUrl]);
    }

    // Build current track up to this point
    const currentTrackCoords: [number, number][] = [];
    for (let i = 0; i <= currentIndex; i++) {
      const p = typhoonData.track[i];
      if (p.spline) {
        currentTrackCoords.push(...p.spline);
      } else if (currentTrackCoords.length === 0) {
        currentTrackCoords.push(p.coordinates);
      }
    }

    // Update current track line
    const trackSource = mapInstance.getSource("typhoon-track-current");
    if (trackSource && "setData" in trackSource) {
      (trackSource as maplibregl.GeoJSONSource).setData({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: currentTrackCoords,
        },
        properties: {},
      });
    }

    // Update current point
    const pointSource = mapInstance.getSource("typhoon-point-current");
    if (pointSource && "setData" in pointSource) {
      (pointSource as maplibregl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: point.coordinates,
            },
            properties: {
              wind: point.wind,
              description: point.description,
              date: date.toLocaleString(),
              pressure: point.pressure,
            },
          },
        ],
      });
    }

    // Center map on current point with easing
    mapInstance.easeTo({
      center: point.coordinates,
      duration: 500,
    });
  }, [typhoonData, currentIndex]);

  return <div ref={mapContainer} className="map-container" />;
}
