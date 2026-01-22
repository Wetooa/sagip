import { useQuery } from "@tanstack/react-query";
import type { GeoJSONFeatureCollection } from "@/types/geojson";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchGeoJSON(url: string): Promise<GeoJSONFeatureCollection> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch GeoJSON: ${response.statusText}`);
  }
  return response.json();
}

export function useCensusData() {
  return useQuery({
    queryKey: ["geojson", "census"],
    queryFn: () => fetchGeoJSON(`${API_BASE_URL}/api/shared/geojson/census`),
  });
}

export function useFloodHazardData(
  returnPeriod: string,
  province?: string | null
) {
  return useQuery({
    queryKey: ["geojson", "flood-hazard", returnPeriod, province],
    queryFn: () => {
      const params = new URLSearchParams({ return_period: returnPeriod });
      if (province) {
        params.append("province", province);
      }
      return fetchGeoJSON(
        `${API_BASE_URL}/api/shared/geojson/flood-hazard?${params.toString()}`
      );
    },
    enabled: !!returnPeriod,
  });
}

export function useEvacuationCenters(cleaned: boolean = true) {
  return useQuery({
    queryKey: ["geojson", "evacuation-centers", cleaned],
    queryFn: () =>
      fetchGeoJSON(
        `${API_BASE_URL}/api/shared/geojson/evacuation-centers?cleaned=${cleaned}`
      ),
  });
}

export function useBarangaysByProvince(province: string | null) {
  return useQuery({
    queryKey: ["geojson", "barangays", province],
    queryFn: () => {
      if (!province) {
        throw new Error("Province is required");
      }
      return fetchGeoJSON(
        `${API_BASE_URL}/api/shared/geojson/barangays?province=${encodeURIComponent(province)}`
      );
    },
    enabled: !!province,
  });
}
