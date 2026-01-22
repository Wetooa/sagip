export interface HealthRiskData {
  regression_score: number;
  risk_level: "low" | "medium" | "high";
}

export interface HealthRisks {
  [sickness: string]: HealthRiskData;
}

export interface BarangayProperties {
  ID_0?: number;
  ISO?: string;
  NAME_0?: string;
  ID_1?: number;
  NAME_1?: string;
  ID_2?: number;
  NAME_2?: string;
  ID_3?: number;
  NAME_3?: string;
  NL_NAME_3?: string;
  VARNAME_3?: string;
  TYPE_3?: string;
  ENGTYPE_3?: string;
  PROVINCE?: string;
  REGION?: string;
  health_risks?: HealthRisks;
  [key: string]: any;
}

export interface GeoJSONFeature {
  type: "Feature";
  properties: BarangayProperties | Record<string, any>;
  geometry: {
    type: string;
    coordinates: any;
  };
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export type SicknessType = 
  | "leptospirosis"
  | "dengue_chikungunya"
  | "acute_bloody_diarrhea_cholera_typhoid";

export const SICKNESS_COLORS: Record<SicknessType, string> = {
  leptospirosis: "#ef4444",
  dengue_chikungunya: "#3b82f6",
  acute_bloody_diarrhea_cholera_typhoid: "#f97316",
};

export const SICKNESS_NAMES: Record<SicknessType, string> = {
  leptospirosis: "Leptospirosis",
  dengue_chikungunya: "Dengue/Chikungunya",
  acute_bloody_diarrhea_cholera_typhoid: "Acute Bloody Diarrhea/Cholera/Typhoid",
};
