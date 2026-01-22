import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface EvacuationCenterRoute {
  rank: number;
  route: {
    code: string;
    routes: Array<{
      geometry: {
        type: "LineString";
        coordinates: [number, number][];
      };
      distance: number;
      duration: number;
      [key: string]: any;
    }>;
    [key: string]: any;
  } | null;
  evacuation_center: {
    id?: string;
    name?: string;
    capacity?: number;
    [key: string]: any;
  };
  route_duration_seconds: number | null;
  route_distance_meters: number | null;
}

export interface NearestEvacuationCentersResponse {
  code: string;
  centers: EvacuationCenterRoute[];
}

async function fetchNearestEvacuationCenters(
  latitude: number,
  longitude: number,
  vehicleType: string = "driving",
  cleaned: boolean = true
): Promise<NearestEvacuationCentersResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    vehicle_type: vehicleType,
    cleaned: cleaned.toString(),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/shared/routing/nearest-evacuation-center?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch nearest evacuation centers: ${response.statusText}`);
  }

  return response.json();
}

export function useNearestEvacuationCenters(
  latitude: number | null,
  longitude: number | null,
  vehicleType: string = "driving",
  cleaned: boolean = true
) {
  return useQuery({
    queryKey: ["routing", "nearest-evacuation-centers", latitude, longitude, vehicleType, cleaned],
    queryFn: () => {
      if (latitude === null || longitude === null) {
        throw new Error("Latitude and longitude are required");
      }
      return fetchNearestEvacuationCenters(latitude, longitude, vehicleType, cleaned);
    },
    enabled: latitude !== null && longitude !== null,
  });
}
