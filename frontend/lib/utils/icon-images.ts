import {
  School,
  Activity,
  Home,
  Church,
  Building2,
  Hospital,
  Trees,
  MapPin,
  LucideIcon,
} from "lucide-react";
import { getEvacuationCenterIcon, getEvacuationCenterIconColor } from "./evacuation-icons";

// Cache for generated icon images
const iconImageCache = new Map<string, ImageData>();

/**
 * Get the SVG path data for a Lucide icon component
 * Since we can't directly render React components to canvas,
 * we'll use the SVG path data that matches the Lucide icons
 */
function getIconPath(type: string | undefined | null): string {
  const normalizedType = type?.toLowerCase().trim() || "unknown";

  switch (normalizedType) {
    case "campus":
      return "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20";
    case "sports center":
      return "M22 12h-4l-3 9L9 3l-3 9H2";
    case "shelter":
      return "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z";
    case "church":
      return "M18 22h-3a2 2 0 0 1-2-2v-6l-5-5V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6l-5 5v6a2 2 0 0 1-2 2h-3";
    case "barangay hall":
      return "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z M6 12h12 M10 6h4 M10 10h4 M10 14h4 M10 18h4";
    case "hospital":
      return "M12 6v12 M17 12H7 M3 12h18 M3 6h18v12H3z";
    case "field":
      return "M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z M7 16v0 M13 7v.2A3 3 0 0 0 14.1 13v0H18v0h0a3 3 0 0 0 1-5.8V7a3 3 0 0 0-6 0Z M15 13v0 M12 22v-6";
    default:
      return "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5";
  }
}

/**
 * Generate an icon image for MapLibre from an evacuation center type
 * Creates a circular icon with the Lucide icon rendered inside
 */
export function generateEvacuationCenterIconImage(
  type: string | undefined | null,
  size: number = 36
): ImageData {
  const normalizedType = type?.toLowerCase().trim() || "unknown";
  const cacheKey = `${normalizedType}-${size}`;

  // Check cache first
  if (iconImageCache.has(cacheKey)) {
    return iconImageCache.get(cacheKey)!;
  }

  const iconColor = getEvacuationCenterIconColor(type);
  const iconPath = getIconPath(type);

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  // Draw circular background
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 3, 0, 2 * Math.PI);
  ctx.fill();

  // Draw border
  ctx.strokeStyle = iconColor;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Draw icon in the center
  const iconSize = size * 0.55; // Icon takes up 55% of the circle
  
  // Draw the SVG path directly using canvas 2D API
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.scale(iconSize / 24, iconSize / 24);
  ctx.translate(-12, -12);

  // Parse and draw the SVG path
  const path2D = new Path2D(iconPath);
  ctx.strokeStyle = iconColor;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke(path2D);
  ctx.restore();

  // Get ImageData
  const imageData = ctx.getImageData(0, 0, size, size);

  // Cache the result
  iconImageCache.set(cacheKey, imageData);

  return imageData;
}

/**
 * Load all evacuation center icon images into MapLibre's image cache
 * This should be called once when the map is ready
 */
export async function loadEvacuationCenterIcons(
  map: maplibregl.Map,
  types: string[]
): Promise<void> {
  const uniqueTypes = Array.from(new Set(types.map((t) => t?.toLowerCase().trim() || "unknown")));
  
  const loadPromises = uniqueTypes.map(async (type) => {
    const imageId = `evac-icon-${type}`;
    
    // Skip if already loaded
    if (map.hasImage(imageId)) {
      return;
    }

    const imageData = generateEvacuationCenterIconImage(type);
    
    // Convert ImageData to ImageBitmap for MapLibre
    const imageBitmap = await createImageBitmap(imageData);
    map.addImage(imageId, imageBitmap);
  });

  await Promise.all(loadPromises);
}

/**
 * Get the icon image ID for a given evacuation center type
 * This ID is used in MapLibre's icon-image property
 */
export function getEvacuationCenterIconId(type: string | undefined | null): string {
  const normalizedType = type?.toLowerCase().trim() || "unknown";
  return `evac-icon-${normalizedType}`;
}
