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

export type EvacuationCenterType =
  | "Campus"
  | "Sports Center"
  | "Shelter"
  | "Church"
  | "Barangay Hall"
  | "Hospital"
  | "Field";

export function getEvacuationCenterIcon(
  type: string | undefined | null
): LucideIcon {
  const normalizedType = type?.toLowerCase().trim();
  
  switch (normalizedType) {
    case "campus":
      return School;
    case "sports center":
      return Activity;
    case "shelter":
      return Home;
    case "church":
      return Church;
    case "barangay hall":
      return Building2;
    case "hospital":
      return Hospital;
    case "field":
      return Trees;
    default:
      return MapPin;
  }
}

export function getEvacuationCenterIconColor(type: string | undefined | null): string {
  const normalizedType = type?.toLowerCase().trim();
  
  switch (normalizedType) {
    case "campus":
      return "#3b82f6"; // Blue
    case "sports center":
      return "#ef4444"; // Red
    case "shelter":
      return "#10b981"; // Green
    case "church":
      return "#8b5cf6"; // Purple
    case "barangay hall":
      return "#f59e0b"; // Amber
    case "hospital":
      return "#ec4899"; // Pink
    case "field":
      return "#22c55e"; // Green
    default:
      return "#6b7280"; // Gray
  }
}
