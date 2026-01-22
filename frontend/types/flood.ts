export interface FloodFeatureProperties {
  [key: string]: string | number | null;
}

export interface FloodFeature {
  type: "Feature";
  geometry: {
    type: string;
    coordinates: any;
  };
  properties: FloodFeatureProperties;
}

export interface FloodGeoJSON {
  type: "FeatureCollection";
  features: FloodFeature[];
}
