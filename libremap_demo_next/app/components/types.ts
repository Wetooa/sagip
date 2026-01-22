export interface TyphoonPoint {
  date: string;
  coordinates: [number, number];
  wind: number;
  pressure: number;
  basin: string;
  forecast: boolean;
  rank: number;
  code: string;
  description: string;
  spline?: [number, number][];
}

export interface TyphoonData {
  id: string;
  name: string;
  title: string;
  description: string;
  season: string;
  type: string;
  max: number;
  forecast: number;
  ja: number;
  ph: string;
  agencies: string;
  track: TyphoonPoint[];
  place?: string;
  startDate?: string;
  endDate?: string;
}

export interface PrecipSample {
  valueMmHr: number | null;
  colorHex: string;
  timestamp: string;
  location: [number, number];
}

export type MapStyle = "satellite" | "normal";

export interface StormSummary {
  id: string;
  name: string;
  basin?: string;
  startDate?: string;
  endDate?: string;
}
