"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl, { Map as MapLibreMap } from "maplibre-gl";

type Bounds = [number, number, number, number];

const BASEMAP_SOURCE_ID = "basemap";
const BASEMAP_LAYER_ID = "basemap-layer";
const PRECIP_SOURCE_ID = "precip-image";
const PRECIP_LAYER_ID = "precip-layer";
const DEFAULT_CENTER: [number, number] = [125, 13.5];
const DEFAULT_ZOOM = 5;
const DEFAULT_MIN_ZOOM = 3;
const DEFAULT_MAX_ZOOM = 14;
const DEFAULT_LAYER_TYPE = "prate";
const DEFAULT_MODEL = "undefined";
const DEFAULT_NWP_START =
  process.env.NEXT_PUBLIC_NWP_START || "2026-01-22T17:00:00";
const DEFAULT_NWP_INIT =
  process.env.NEXT_PUBLIC_NWP_INIT || "2026-01-22 00:00:00 UTC";

const BOUNDS_ATMO: Bounds = [
  116.36436282608695, 4.18057258477824, 127.47868072717367, 21.43894411105318,
];
const BOUNDS_STANDARD: Bounds = [99.95, -5.050000000000004, 160.05, 40.05];

function formatIsoDate(date: Date) {
  return date.toISOString().split(".")[0];
}

function buildTimeWindow(hours: number, startIso?: string) {
  const frames: string[] = [];
  const base = startIso ? new Date(startIso) : new Date();
  const start = isNaN(base.getTime()) ? new Date() : base;
  for (let i = 0; i < hours; i++) {
    const d = new Date(start);
    d.setHours(start.getHours() + i);
    frames.push(formatIsoDate(d));
  }
  return frames;
}

function buildNwpImageUrl({
  time,
  layerType,
  model,
  init,
  token,
  apiBase,
}: {
  time: string;
  layerType: string;
  model: string;
  init: string;
  token?: string;
  apiBase?: string;
}) {
  const base = (apiBase ?? "https://www.panahon.gov.ph").replace(/\/$/, "");
  const safeToken = token ?? "4xSXZxRO7FyDHCLR5YIwermQ5j9QhcTHHZICLHfn";
  const timeParam = encodeURIComponent(time);
  const initParam = encodeURIComponent(init);
  return `${base}/api/v1/nwp-image?url=${layerType}&token=${safeToken}&t=${timeParam}&model=${model}&init=${initParam}`;
}

export default function Home() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  const [selectedFrameIdx, setSelectedFrameIdx] = useState(0);
  const [layerType] = useState(DEFAULT_LAYER_TYPE);
  const [model] = useState(DEFAULT_MODEL);

  const timeFrames = useMemo(() => buildTimeWindow(12, DEFAULT_NWP_START), []);
  const selectedTime = timeFrames[selectedFrameIdx] ?? timeFrames[0];

  const initialImageUrl = useMemo(
    () =>
      buildNwpImageUrl({
        time: timeFrames[0] ?? formatIsoDate(new Date()),
        layerType,
        model,
        init: DEFAULT_NWP_INIT,
        token: process.env.NEXT_PUBLIC_CSRF_TOKEN,
        apiBase: process.env.NEXT_PUBLIC_API_BASE,
      }),
    [layerType, model, timeFrames]
  );

  const imageUrl = useMemo(
    () =>
      buildNwpImageUrl({
        time: selectedTime,
        layerType,
        model,
        init: DEFAULT_NWP_INIT,
        token: process.env.NEXT_PUBLIC_CSRF_TOKEN,
        apiBase: process.env.NEXT_PUBLIC_API_BASE,
      }),
    [selectedTime, layerType, model, timeFrames]
  );

  const bounds: Bounds = model === "atmo" ? BOUNDS_ATMO : BOUNDS_STANDARD;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialUrl = initialImageUrl;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          [BASEMAP_SOURCE_ID]: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: BASEMAP_LAYER_ID,
            type: "raster",
            source: BASEMAP_SOURCE_ID,
            minzoom: DEFAULT_MIN_ZOOM,
            maxzoom: DEFAULT_MAX_ZOOM,
          },
        ],
      },
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: DEFAULT_MIN_ZOOM,
      maxZoom: DEFAULT_MAX_ZOOM,
    });

    map.once("load", () => {
      map.addSource(PRECIP_SOURCE_ID, {
        type: "image",
        url: initialUrl,
        coordinates: [
          [bounds[0], bounds[3]],
          [bounds[2], bounds[3]],
          [bounds[2], bounds[1]],
          [bounds[0], bounds[1]],
        ],
      });

      map.addLayer({
        id: PRECIP_LAYER_ID,
        type: "raster",
        source: PRECIP_SOURCE_ID,
        paint: {
          "raster-opacity": 0.85,
          "raster-fade-duration": 200,
        },
        minzoom: DEFAULT_MIN_ZOOM,
        maxzoom: DEFAULT_MAX_ZOOM,
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [bounds, initialImageUrl]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyImageLayer = () => {
      if (map.getLayer(PRECIP_LAYER_ID)) {
        map.removeLayer(PRECIP_LAYER_ID);
      }
      if (map.getSource(PRECIP_SOURCE_ID)) {
        map.removeSource(PRECIP_SOURCE_ID);
      }

      map.addSource(PRECIP_SOURCE_ID, {
        type: "image",
        url: imageUrl,
        coordinates: [
          [bounds[0], bounds[3]],
          [bounds[2], bounds[3]],
          [bounds[2], bounds[1]],
          [bounds[0], bounds[1]],
        ],
      });
      map.addLayer({
        id: PRECIP_LAYER_ID,
        type: "raster",
        source: PRECIP_SOURCE_ID,
        paint: {
          "raster-opacity": 0.85,
          "raster-fade-duration": 200,
        },
        minzoom: DEFAULT_MIN_ZOOM,
        maxzoom: DEFAULT_MAX_ZOOM,
      });
    };

    if (!map.isStyleLoaded()) {
      map.once("load", applyImageLayer);
      return;
    }

    applyImageLayer();
  }, [imageUrl, bounds]);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      <header className="w-full border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Precipitation Overlay (MapLibre)
            </p>
            <h1 className="text-2xl font-semibold text-zinc-900">
              NWP Precipitation Preview
            </h1>
            <p className="text-sm text-zinc-600">
              Base map: OSM tiles · Overlay: /api/v1/nwp-image (layer:{" "}
              {layerType}) · Model: {model}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-600">
            <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-800">
              MapLibre GL
            </span>
            <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800">
              Bounds: "undefined"
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-6">
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="relative h-[70vh] overflow-hidden rounded-xl border border-zinc-200 shadow-sm">
              <div ref={mapContainerRef} className="h-full w-full" />
              <div className="pointer-events-none absolute right-4 top-4 rounded-md bg-white/90 px-3 py-2 text-xs text-zinc-700 shadow">
                <p className="font-semibold text-emerald-700">
                  Legend (mm per hour)
                </p>
                <div
                  className="mt-2 h-2 w-40 overflow-hidden rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #007bbb, #00008b, #008b8b, #006400, #556b2f, #8b8000, #cc8400, #b22222, #8b0000, #8b008b, #8b006b)",
                  }}
                />
                <div className="mt-1 flex justify-between text-[10px] text-zinc-500">
                  <span>0.5</span>
                  <span>30</span>
                </div>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-zinc-900">Time Slider</p>
              <p className="text-xs text-zinc-600">Select forecast frame</p>
              <div className="mt-3 flex flex-col gap-2">
                <input
                  type="range"
                  min={0}
                  max={timeFrames.length - 1}
                  step={1}
                  value={selectedFrameIdx}
                  onChange={(e) => setSelectedFrameIdx(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>{timeFrames[0]}</span>
                  <span>{timeFrames[timeFrames.length - 1]}</span>
                </div>
                <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
                  Showing frame: {selectedTime}
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-3 text-xs text-zinc-700">
              <p className="font-semibold text-zinc-900">Overlay settings</p>
              <ul className="mt-2 space-y-1">
                <li>Layer: {layerType}</li>
                <li>Model: {model}</li>
                <li>Bounds: {bounds.join(", ")}</li>
                <li>Opacity: 0.85</li>
                <li>Source: /api/v1/nwp-image</li>
              </ul>
            </div>

            <div className="border-t border-zinc-200 pt-3 text-xs text-zinc-700">
              <p className="font-semibold text-zinc-900">How to wire the API</p>
              <p className="mt-2">Configure environment variables:</p>
              <ul className="mt-2 space-y-1">
                <li>
                  NEXT_PUBLIC_API_BASE — API host (default:
                  https://www.panahon.gov.ph)
                </li>
                <li>
                  NEXT_PUBLIC_CSRF_TOKEN — token for /api/v1/nwp-image (default:
                  demo token)
                </li>
              </ul>
              <p className="mt-2 text-zinc-600">
                Image endpoint:
                /api/v1/nwp-image?url=prate&token=...&t=ISO_TIME&model=atmo&init=ISO_INIT
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
