export interface TyphoonPoint {
  date: string;
  coordinates: [number, number];
  wind: number;
  pressure: number;
  description?: string;
  spline?: [number, number][];
}

export interface TyphoonData {
  id: string;
  name: string;
  title: string;
  description?: string;
  season?: string;
  track: TyphoonPoint[];
  max?: number;
  place?: string;
  startDate?: string;
  endDate?: string;
}
