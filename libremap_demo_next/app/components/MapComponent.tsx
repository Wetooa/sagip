"use client";

import { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import { MapStyle, PrecipSample, TyphoonData } from "./types";

interface MapComponentProps {
  storms: TyphoonData[];
  activeStormId: string | null;
  currentIndex: number;
  precipVisible: boolean;
  mapStyle: MapStyle;
  onPrecipSample: (sample: PrecipSample) => void;
}

export default function MapComponent({
  storms,
  activeStormId,
  currentIndex,
  precipVisible,
  mapStyle,
  onPrecipSample,
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const tileCacheRef = useRef<Record<string, string>>({});
  const precipDateRef = useRef<string>("2024-01-01");
  const precipVisibleRef = useRef<boolean>(precipVisible);
  const wiredRef = useRef<boolean>(false);

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
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
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
          {
            id: "osm",
            type: "raster",
            source: "osm",
            minzoom: 0,
            maxzoom: 19,
            layout: {
              visibility: "none",
            },
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

  useEffect(() => {
    precipVisibleRef.current = precipVisible;
  }, [precipVisible]);

  // Build layers when storms load
  useEffect(() => {
    if (!map.current || storms.length === 0) return;
    const mapInstance = map.current;

    const setup = () => {
      const firstTrackDate = storms[0]?.track[0]?.date;
      const firstDateStr = firstTrackDate
        ? new Date(firstTrackDate).toISOString().split("T")[0]
        : "2025-11-01";
      precipDateRef.current = firstDateStr;

      ensurePrecip(mapInstance, firstDateStr);
      updateAllTracks(mapInstance);
      ensureActiveLayers(mapInstance);
      wireInteractions(mapInstance);
      preloadTileCache();

      // Fit map to show all storms
      const allCoords: [number, number][] = [];
      storms.forEach((storm) => {
        storm.track.forEach((point) => {
          allCoords.push(point.coordinates);
        });
      });

      if (allCoords.length > 0) {
        const bounds = allCoords.reduce(
          (bounds, coord) => bounds.extend(coord),
          new maplibregl.LngLatBounds(allCoords[0], allCoords[0]),
        );
        mapInstance.fitBounds(bounds, {
          padding: 50,
          maxZoom: 6,
          duration: 1000,
        });
      }
    };

    if (mapInstance.loaded()) {
      setup();
    } else {
      mapInstance.on("load", setup);
    }
  }, [storms]);

  // Update active track on index change
  useEffect(() => {
    if (!map.current || storms.length === 0 || currentIndex < 0) return;
    const active = activeStormId
      ? storms.find((s) => s.id === activeStormId)
      : null;
    if (!active) return;

    const mapInstance = map.current;
    const point = active.track[currentIndex];
    if (!point) return;
    const date = new Date(point.date);
    const dateStr = date.toISOString().split("T")[0];
    precipDateRef.current = dateStr;

    updateBaseTiles(mapInstance, dateStr);
    updateActiveTrack(mapInstance, active, currentIndex);

    mapInstance.easeTo({
      center: point.coordinates,
      duration: 500,
    });
  }, [storms, activeStormId, currentIndex]);

  // Reflect precipitation visibility changes
  useEffect(() => {
    if (!map.current) return;
    if (map.current.getLayer("precip-layer")) {
      map.current.setLayoutProperty(
        "precip-layer",
        "visibility",
        precipVisible ? "visible" : "none",
      );
    }
  }, [precipVisible]);

  // Toggle base layers when map style switches
  useEffect(() => {
    if (!map.current) return;
    const mapInstance = map.current;
    if (mapInstance.getLayer("gibs")) {
      mapInstance.setLayoutProperty(
        "gibs",
        "visibility",
        mapStyle === "satellite" ? "visible" : "none",
      );
    }
    if (mapInstance.getLayer("osm")) {
      mapInstance.setLayoutProperty(
        "osm",
        "visibility",
        mapStyle === "normal" ? "visible" : "none",
      );
    }
  }, [mapStyle]);

  function buildPrecipTileUrl(dateStr: string) {
    return `https://gibs-a.earthdata.nasa.gov/wmts/epsg3857/best/GPM_3IMERGHHE/default/${dateStr}/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png`;
  }

  const ensurePrecip = (mapInstance: maplibregl.Map, dateStr: string) => {
    if (!mapInstance.getSource("precip")) {
      mapInstance.addSource("precip", {
        type: "raster",
        tiles: [buildPrecipTileUrl(dateStr)],
        tileSize: 256,
        attribution: "NASA GIBS GPM IMERG Half-Hourly",
      });

      mapInstance.addLayer({
        id: "precip-layer",
        type: "raster",
        source: "precip",
        minzoom: 0,
        maxzoom: 6,
        layout: {
          visibility: precipVisible ? "visible" : "none",
        },
        paint: {
          "raster-opacity": 0.75,
        },
      });
    }
  };

  const ensureActiveLayers = (mapInstance: maplibregl.Map) => {
    if (!mapInstance.getSource("storm-track-active")) {
      mapInstance.addSource("storm-track-active", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates: [] },
          properties: {},
        },
      });
    }
    if (!mapInstance.getLayer("storm-line-active")) {
      mapInstance.addLayer({
        id: "storm-line-active",
        type: "line",
        source: "storm-track-active",
        paint: {
          "line-color": "#ff4500",
          "line-width": 4,
          "line-opacity": 0.9,
        },
      });
    }

    if (!mapInstance.getSource("storm-point-active")) {
      mapInstance.addSource("storm-point-active", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
    }
    if (!mapInstance.getLayer("storm-point-active")) {
      mapInstance.addLayer({
        id: "storm-point-active",
        type: "circle",
        source: "storm-point-active",
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

      mapInstance.on("click", "storm-point-active", (e) => {
        if (!e.features || e.features.length === 0) return;
        const props = e.features[0].properties;
        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `
            <strong>${props.description || "Storm point"}</strong><br>
            Wind: ${props.wind} knots<br>
            Pressure: ${props.pressure} mb<br>
            ${props.date}
          `,
          )
          .addTo(mapInstance);
      });

      mapInstance.on("mouseenter", "storm-point-active", () => {
        mapInstance.getCanvas().style.cursor = "pointer";
      });

      mapInstance.on("mouseleave", "storm-point-active", () => {
        mapInstance.getCanvas().style.cursor = "";
      });
    }
  };

  const updateAllTracks = (mapInstance: maplibregl.Map) => {
    const lineFeatures = storms.map((storm) => ({
      type: "Feature" as const,
      geometry: {
        type: "LineString" as const,
        coordinates: expandTrackCoordinates(storm.track),
      },
      properties: {
        id: storm.id,
        name: storm.name,
        color: colorFromId(storm.id),
      },
    }));

    const pointFeatures = storms.flatMap((storm) =>
      storm.track.map((point) => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: point.coordinates },
        properties: {
          id: storm.id,
          name: storm.name,
          wind: point.wind,
          description: point.description,
          date: new Date(point.date).toLocaleString(),
          pressure: point.pressure,
          color: colorFromId(storm.id),
        },
      })),
    );

    if (!mapInstance.getSource("storm-tracks-all")) {
      mapInstance.addSource("storm-tracks-all", {
        type: "geojson",
        data: { type: "FeatureCollection", features: lineFeatures },
      });
      mapInstance.addLayer({
        id: "storm-lines-all",
        type: "line",
        source: "storm-tracks-all",
        paint: {
          "line-color": ["get", "color"],
          "line-width": 2,
          "line-opacity": 0.35,
        },
      });
    } else {
      (
        mapInstance.getSource("storm-tracks-all") as maplibregl.GeoJSONSource
      ).setData({
        type: "FeatureCollection",
        features: lineFeatures,
      });
    }

    if (!mapInstance.getSource("storm-points-all")) {
      mapInstance.addSource("storm-points-all", {
        type: "geojson",
        data: { type: "FeatureCollection", features: pointFeatures },
      });
      mapInstance.addLayer({
        id: "storm-points-all",
        type: "circle",
        source: "storm-points-all",
        paint: {
          "circle-radius": 4,
          "circle-color": ["get", "color"],
          "circle-opacity": 0.3,
          "circle-stroke-width": 1,
          "circle-stroke-color": ["get", "color"],
          "circle-stroke-opacity": 0.3,
        },
      });
    } else {
      (
        mapInstance.getSource("storm-points-all") as maplibregl.GeoJSONSource
      ).setData({
        type: "FeatureCollection",
        features: pointFeatures,
      });
    }
  };

  const updateActiveTrack = (
    mapInstance: maplibregl.Map,
    active: TyphoonData,
    idx: number,
  ) => {
    const currentTrackCoords: [number, number][] = [];
    for (let i = 0; i <= idx; i++) {
      const p = active.track[i];
      if (!p) continue;
      if (p.spline) {
        currentTrackCoords.push(...p.spline);
      } else if (currentTrackCoords.length === 0) {
        currentTrackCoords.push(p.coordinates);
      }
    }

    const trackSource = mapInstance.getSource("storm-track-active");
    if (trackSource && "setData" in trackSource) {
      (trackSource as maplibregl.GeoJSONSource).setData({
        type: "Feature",
        geometry: { type: "LineString", coordinates: currentTrackCoords },
        properties: {},
      });
    }

    const point = active.track[idx];
    if (point) {
      const pointSource = mapInstance.getSource("storm-point-active");
      if (pointSource && "setData" in pointSource) {
        (pointSource as maplibregl.GeoJSONSource).setData({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: point.coordinates },
              properties: {
                wind: point.wind,
                description: point.description,
                date: new Date(point.date).toLocaleString(),
                pressure: point.pressure,
              },
            },
          ],
        });
      }
    }
  };

  const updateBaseTiles = (mapInstance: maplibregl.Map, dateStr: string) => {
    const tileUrl =
      tileCacheRef.current[dateStr] ||
      `https://gibs-a.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${dateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;

    const source = mapInstance.getSource("gibs");
    if (source && "setTiles" in source) {
      (source as maplibregl.RasterTileSource).setTiles([tileUrl]);
    }

    const precipSource = mapInstance.getSource("precip");
    if (precipSource && "setTiles" in precipSource) {
      (precipSource as maplibregl.RasterTileSource).setTiles([
        buildPrecipTileUrl(dateStr),
      ]);
    }
  };

  const wireInteractions = (mapInstance: maplibregl.Map) => {
    if (wiredRef.current) return;
    wiredRef.current = true;
    mapInstance.on("click", async (e) => {
      if (!precipVisibleRef.current) return;
      try {
        const sample = await samplePrecipAt(
          mapInstance,
          e.lngLat.lng,
          e.lngLat.lat,
          precipDateRef.current,
        );
        onPrecipSample(sample);
      } catch (err) {
        console.error("Failed to sample precipitation", err);
      }
    });
  };

  const preloadTileCache = () => {
    const uniqueDates = new Set<string>();
    storms.forEach((storm) => {
      storm.track.forEach((point) => {
        const dateStr = new Date(point.date).toISOString().split("T")[0];
        uniqueDates.add(dateStr);
      });
    });

    uniqueDates.forEach((dateStr) => {
      if (!tileCacheRef.current[dateStr]) {
        tileCacheRef.current[dateStr] =
          `https://gibs-a.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${dateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;
      }
    });
  };

  const samplePrecipAt = async (
    mapInstance: maplibregl.Map,
    lng: number,
    lat: number,
    dateStr: string,
  ): Promise<PrecipSample> => {
    const zoom = Math.min(Math.max(Math.floor(mapInstance.getZoom()), 0), 6);
    const tileXYZ = lngLatToTile(lng, lat, zoom);
    const pixel = lngLatToPixelInTile(lng, lat, zoom, tileXYZ.x, tileXYZ.y);
    const url = buildPrecipTileUrl(dateStr)
      .replace("{z}", `${zoom}`)
      .replace("{x}", `${tileXYZ.x}`)
      .replace("{y}", `${tileXYZ.y}`);

    const imageData = await fetchTilePixel(url, pixel.x, pixel.y);
    const colorHex = rgbToHex(imageData[0], imageData[1], imageData[2]);
    const valueMmHr = estimatePrecipMmHr(
      imageData[0],
      imageData[1],
      imageData[2],
    );

    return {
      valueMmHr,
      colorHex,
      timestamp: new Date(dateStr).toISOString(),
      location: [lng, lat],
    };
  };

  const lngLatToTile = (lng: number, lat: number, z: number) => {
    const scale = 2 ** z;
    const x = Math.floor(((lng + 180) / 360) * scale);
    const sinLat = Math.sin((lat * Math.PI) / 180);
    const y = Math.floor(
      (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale,
    );
    return { x, y };
  };

  const lngLatToPixelInTile = (
    lng: number,
    lat: number,
    z: number,
    tileX: number,
    tileY: number,
  ) => {
    const scale = 2 ** z;
    const worldX = ((lng + 180) / 360) * scale;
    const sinLat = Math.sin((lat * Math.PI) / 180);
    const worldY =
      (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;

    const pixelX = Math.floor((worldX - tileX) * 256);
    const pixelY = Math.floor((worldY - tileY) * 256);
    return { x: pixelX, y: pixelY };
  };

  const fetchTilePixel = async (
    url: string,
    x: number,
    y: number,
  ): Promise<Uint8ClampedArray> => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const loadPromise = new Promise<Uint8ClampedArray>((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(x, y, 1, 1).data;
        resolve(data);
      };
      img.onerror = (err) => reject(err);
    });

    img.src = url;
    return loadPromise;
  };

  const rgbToHex = (r: number, g: number, b: number) =>
    `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  const estimatePrecipMmHr = (r: number, g: number, b: number) => {
    const maxRate = 50; // rough cap for IMERG half-hourly tiles
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const value = +(luminance * maxRate).toFixed(1);
    return Number.isFinite(value) ? value : null;
  };

  const expandTrackCoordinates = (track: TyphoonData["track"]) => {
    const coords: [number, number][] = [];
    track.forEach((p) => {
      if (p.spline) {
        coords.push(...p.spline);
      } else {
        coords.push(p.coordinates);
      }
    });
    return coords;
  };

  const colorFromId = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }
    const r = (hash >> 16) & 0xff;
    const g = (hash >> 8) & 0xff;
    const b = hash & 0xff;
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };

  return <div ref={mapContainer} className="map-container" />;
}
