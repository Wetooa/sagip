import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { combine, parseShp, parseDbf } from "shpjs";

// Function to fix polygon geometry by ensuring rings are properly closed
function fixPolygonGeometry(feature: any): any {
  if (feature.geometry.type === "Polygon") {
    feature.geometry.coordinates = feature.geometry.coordinates.map(
      (ring: number[][]) => {
        if (ring.length > 0) {
          const first = ring[0];
          const last = ring[ring.length - 1];
          // Check if ring is closed (first coord equals last coord)
          if (first[0] !== last[0] || first[1] !== last[1]) {
            return [...ring, [first[0], first[1]]]; // Close the ring
          }
        }
        return ring;
      },
    );
  } else if (feature.geometry.type === "MultiPolygon") {
    feature.geometry.coordinates = feature.geometry.coordinates.map(
      (polygon: number[][][]) =>
        polygon.map((ring: number[][]) => {
          if (ring.length > 0) {
            const first = ring[0];
            const last = ring[ring.length - 1];
            if (first[0] !== last[0] || first[1] !== last[1]) {
              return [...ring, [first[0], first[1]]];
            }
          }
          return ring;
        }),
    );
  }
  return feature;
}

// Function to normalize properties and handle name variations
function normalizeProperties(feature: any): any {
  const props = feature.properties;
  const normalized: any = { ...props };

  // Try to find depth property with various name variations
  const depthKeys = [
    "Var",
    "VAR",
    "var",
    "DEPTH_M",
    "DEPTH",
    "depth_m",
    "depth",
    "Depth",
    "FLOOD_DEPTH",
    "FloodDepth",
    "HAZARD",
    "Hazard",
    "hazard",
  ];
  for (const key of depthKeys) {
    if (props[key] !== undefined && props[key] !== null && props[key] !== "") {
      const value =
        typeof props[key] === "string" ? parseFloat(props[key]) : props[key];
      if (!isNaN(value) && isFinite(value)) {
        normalized.DEPTH_M = value;
        break;
      }
    }
  }

  return normalized;
}

export async function GET() {
  try {
    // Check for pre-converted GeoJSON first (for faster loading)
    const jsonPath = path.join(
      process.cwd(),
      "public",
      "data",
      "cebu-flood.geojson",
    );
    if (fs.existsSync(jsonPath)) {
      const geojson = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
      return NextResponse.json(geojson, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }

    // Try to process shapefiles from data directory
    const dataDir = path.join(process.cwd(), "data");
    const shpPath = path.join(dataDir, "PH072200000_FH_5yr.shp");
    const dbfPath = path.join(dataDir, "PH072200000_FH_5yr.dbf");

    // Check if shapefile exists
    if (!fs.existsSync(shpPath) || !fs.existsSync(dbfPath)) {
      console.warn("Shapefile not found, trying cebu-flood-demo fallback");

      // Fallback to cebu-flood-demo data
      const fallbackDataDir = path.join(
        process.cwd(),
        "..",
        "cebu-flood-demo",
        "data",
      );
      const fallbackShpPath = path.join(
        fallbackDataDir,
        "PH072200000_FH_5yr.shp",
      );
      const fallbackDbfPath = path.join(
        fallbackDataDir,
        "PH072200000_FH_5yr.dbf",
      );

      if (!fs.existsSync(fallbackShpPath) || !fs.existsSync(fallbackDbfPath)) {
        return NextResponse.json(
          { error: "Shapefile not found in primary or fallback locations" },
          { status: 404 },
        );
      }

      // Use fallback paths
      const shpBuffer = fs.readFileSync(fallbackShpPath);
      const dbfBuffer = fs.readFileSync(fallbackDbfPath);
      return processShapefile(shpBuffer, dbfBuffer);
    }

    // Read the shapefile files as buffers
    const shpBuffer = fs.readFileSync(shpPath);
    const dbfBuffer = fs.readFileSync(dbfPath);
    return processShapefile(shpBuffer, dbfBuffer);
  } catch (error: unknown) {
    console.error("Error processing shapefile:", error);
    return NextResponse.json(
      {
        error: "Failed to process shapefile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

function processShapefile(shpBuffer: Buffer, dbfBuffer: Buffer): NextResponse {
  // Parse the shapefile using shpjs buffer API
  const geojson = combine([parseShp(shpBuffer), parseDbf(dbfBuffer)]);

  // If geojson is an array (multiple shapefiles), take the first one
  let featureCollection = Array.isArray(geojson) ? geojson[0] : geojson;

  // Process features: fix geometry and normalize properties
  if (featureCollection.features && Array.isArray(featureCollection.features)) {
    featureCollection.features = featureCollection.features.map(
      (feature: any) => {
        // Fix geometry
        const fixedFeature = fixPolygonGeometry(feature);
        // Normalize properties
        fixedFeature.properties = normalizeProperties(fixedFeature);
        return fixedFeature;
      },
    );

    // Debug: Log sample feature to inspect structure
    if (featureCollection.features.length > 0) {
      const sampleFeature = featureCollection.features[0];
      console.log("=== Shapefile Processing Debug ===");
      console.log("Total features:", featureCollection.features.length);
      console.log("Sample feature geometry type:", sampleFeature.geometry.type);
      console.log(
        "Sample feature properties:",
        Object.keys(sampleFeature.properties),
      );

      // Check geometry closure
      if (
        sampleFeature.geometry.type === "Polygon" &&
        sampleFeature.geometry.coordinates[0]
      ) {
        const ring = sampleFeature.geometry.coordinates[0];
        const isClosed =
          ring.length > 0 &&
          ring[0][0] === ring[ring.length - 1][0] &&
          ring[0][1] === ring[ring.length - 1][1];
        console.log(
          "Polygon ring closed:",
          isClosed,
          "Ring length:",
          ring.length,
        );
      }

      // Check for DEPTH_M property
      console.log("DEPTH_M exists:", "DEPTH_M" in sampleFeature.properties);
      console.log("DEPTH_M value:", sampleFeature.properties.DEPTH_M);
      console.log("================================");
    }
  }

  return NextResponse.json(featureCollection, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
