export type CrossingMode = "walking" | "personal_vehicle" | "commercial_vehicle" | "public_transport";

export type AccessType = "standard" | "readyLane" | "sentri";

export type DocumentCategory = "passport" | "visa" | "usCitizen" | "unknown";

export type TrustedTraveler = "none" | "sentri" | "globalEntry";

export interface TravelerProfile {
  crossingMode: CrossingMode;
  accessType: AccessType;
  documentCategory: DocumentCategory;
  trustedTraveler: TrustedTraveler;
}

export const CROSSING_MODES: Array<{ id: CrossingMode; labelKey: string }> = [
  { id: "walking", labelKey: "viaje.walking" },
  { id: "personal_vehicle", labelKey: "viaje.personalVehicle" },
  { id: "commercial_vehicle", labelKey: "viaje.commercialVehicle" },
  { id: "public_transport", labelKey: "viaje.publicTransport" },
];

export const ACCESS_TYPES: Array<{ id: AccessType; labelKey: string }> = [
  { id: "standard", labelKey: "viaje.access.standard" },
  { id: "readyLane", labelKey: "viaje.access.readyLane" },
  { id: "sentri", labelKey: "viaje.access.sentri" },
];

export const DOCUMENT_CATEGORIES: Array<{ id: DocumentCategory; labelKey: string }> = [
  { id: "passport", labelKey: "viaje.document.passport" },
  { id: "visa", labelKey: "viaje.document.visa" },
  { id: "usCitizen", labelKey: "viaje.document.usCitizen" },
  { id: "unknown", labelKey: "viaje.document.unknown" },
];

export const TRUSTED_TRAVELER: Array<{ id: TrustedTraveler; labelKey: string }> = [
  { id: "none", labelKey: "viaje.trusted.none" },
  { id: "sentri", labelKey: "viaje.trusted.sentri" },
  { id: "globalEntry", labelKey: "viaje.trusted.globalEntry" },
];
