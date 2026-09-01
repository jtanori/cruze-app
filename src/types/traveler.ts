export type CrossingMode = "walking" | "personal_vehicle" | "commercial_vehicle" | "public_transport";

export type VisaType = "none" | "b1_b2" | "h1b" | "f1" | "global_entry" | "fmm" | "resident";

export interface TravelerProfile {
  crossingMode: CrossingMode;
  hasSentri: boolean;
  usVisaType: VisaType | null;
  mxVisaType: VisaType | null;
  passportCountry: string | null;
}

export const CROSSING_MODES: Array<{ id: CrossingMode; labelKey: string }> = [
  { id: "walking", labelKey: "viaje.walking" },
  { id: "personal_vehicle", labelKey: "viaje.personalVehicle" },
  { id: "commercial_vehicle", labelKey: "viaje.commercialVehicle" },
  { id: "public_transport", labelKey: "viaje.publicTransport" },
];

export const US_VISA_TYPES: Array<{ id: VisaType; labelKey: string }> = [
  { id: "b1_b2", labelKey: "viaje.visa.b1b2" },
  { id: "h1b", labelKey: "viaje.visa.h1b" },
  { id: "f1", labelKey: "viaje.visa.f1" },
  { id: "global_entry", labelKey: "viaje.visa.globalEntry" },
  { id: "none", labelKey: "viaje.visa.none" },
];

export const MX_VISA_TYPES: Array<{ id: VisaType; labelKey: string }> = [
  { id: "fmm", labelKey: "viaje.visa.fmm" },
  { id: "resident", labelKey: "viaje.visa.resident" },
  { id: "none", labelKey: "viaje.visa.none" },
];

export const COMMON_PASSPORT_COUNTRIES = [
  "Mexico",
  "United States",
  "Spain",
  "Colombia",
  "China",
  "India",
  "Japan",
  "Germany",
  "United Kingdom",
  "Brazil",
  "Canada",
  "South Korea",
  "France",
  "Argentina",
  "Cuba",
  "Guatemala",
  "Honduras",
  "El Salvador",
  "Nicaragua",
  "Costa Rica",
];
