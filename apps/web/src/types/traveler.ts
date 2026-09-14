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
  { id: "walking", labelKey: "trip.walking" },
  { id: "personal_vehicle", labelKey: "trip.personalVehicle" },
  { id: "commercial_vehicle", labelKey: "trip.commercialVehicle" },
  { id: "public_transport", labelKey: "trip.publicTransport" },
];

export const ACCESS_TYPES: Array<{ id: AccessType; labelKey: string }> = [
  { id: "standard", labelKey: "trip.access.standard" },
  { id: "readyLane", labelKey: "trip.access.readyLane" },
  { id: "sentri", labelKey: "trip.access.sentri" },
];

export const DOCUMENT_CATEGORIES: Array<{ id: DocumentCategory; labelKey: string }> = [
  { id: "passport", labelKey: "trip.document.passport" },
  { id: "visa", labelKey: "trip.document.visa" },
  { id: "usCitizen", labelKey: "trip.document.usCitizen" },
  { id: "unknown", labelKey: "trip.document.unknown" },
];

export const TRUSTED_TRAVELER: Array<{ id: TrustedTraveler; labelKey: string }> = [
  { id: "none", labelKey: "trip.trusted.none" },
  { id: "sentri", labelKey: "trip.trusted.sentri" },
  { id: "globalEntry", labelKey: "trip.trusted.globalEntry" },
];
