import type { Place, TripDirection, CrossingRecommendation, CrossingLane, CrossingFacts } from "@/types";
import {
  findCandidateCrossings,
  haversineDistance,
} from "./border-data";

interface RecommendationInput {
  start: Place;
  destination: Place;
  direction: TripDirection;
}

/** Mock lane data per crossing */
const MOCK_LANES: Record<string, CrossingLane[]> = {
  "san-ysidro": [
    { name: "Ready Lane", waitTime: 15, isOpen: true, trend: "stable" },
    { name: "SENTRI", waitTime: 4, isOpen: true, trend: "improving" },
    { name: "Standard", waitTime: 22, isOpen: true, trend: "worsening" },
  ],
  "otay-mesa": [
    { name: "Ready Lane", waitTime: 18, isOpen: true, trend: "improving" },
    { name: "SENTRI", waitTime: 5, isOpen: true, trend: "stable" },
    { name: "Standard", waitTime: 28, isOpen: true, trend: "stable" },
  ],
  tecate: [
    { name: "Standard", waitTime: 10, isOpen: true, trend: "stable" },
  ],
  "calexico-west": [
    { name: "Ready Lane", waitTime: 12, isOpen: true, trend: "stable" },
    { name: "Standard", waitTime: 18, isOpen: true, trend: "stable" },
  ],
  "calexico-east": [
    { name: "Ready Lane", waitTime: 14, isOpen: true, trend: "improving" },
    { name: "SENTRI", waitTime: 6, isOpen: true, trend: "stable" },
    { name: "Standard", waitTime: 22, isOpen: true, trend: "stable" },
  ],
  "san-luis": [
    { name: "Ready Lane", waitTime: 10, isOpen: true, trend: "stable" },
    { name: "Standard", waitTime: 16, isOpen: true, trend: "stable" },
  ],
  "nogales-mariposa": [
    { name: "SENTRI", waitTime: 8, isOpen: true, trend: "improving" },
    { name: "Standard", waitTime: 20, isOpen: true, trend: "stable" },
  ],
  "nogales-decongestion": [
    { name: "Standard", waitTime: 25, isOpen: true, trend: "stable" },
  ],
  "el-paso-ysleta": [
    { name: "Ready Lane", waitTime: 12, isOpen: true, trend: "stable" },
    { name: "SENTRI", waitTime: 5, isOpen: true, trend: "improving" },
    { name: "Standard", waitTime: 19, isOpen: true, trend: "stable" },
  ],
  "el-paso-stanton": [
    { name: "Standard", waitTime: 23, isOpen: true, trend: "stable" },
  ],
  "el-paso-bridge-of-americas": [
    { name: "Standard", waitTime: 27, isOpen: true, trend: "worsening" },
  ],
  "laredo-north": [
    { name: "Ready Lane", waitTime: 15, isOpen: true, trend: "stable" },
    { name: "Standard", waitTime: 21, isOpen: true, trend: "stable" },
  ],
  hidalgo: [
    { name: "SENTRI", waitTime: 7, isOpen: true, trend: "improving" },
    { name: "Standard", waitTime: 17, isOpen: true, trend: "stable" },
  ],
  brownsville: [
    { name: "Standard", waitTime: 24, isOpen: true, trend: "stable" },
  ],
};

/** Mock facts per crossing */
const MOCK_FACTS: Record<string, CrossingFacts> = {
  "san-ysidro": { hours: "Open 24 hours", pedestrianAccess: true, commercialAccess: true },
  "otay-mesa": { hours: "Open 24 hours", pedestrianAccess: false, commercialAccess: true },
  tecate: { hours: "6:00 AM – 10:00 PM", pedestrianAccess: true, commercialAccess: true },
  "calexico-west": { hours: "Open 24 hours", pedestrianAccess: true, commercialAccess: false },
  "calexico-east": { hours: "Open 24 hours", pedestrianAccess: false, commercialAccess: true },
  "san-luis": { hours: "Open 24 hours", pedestrianAccess: true, commercialAccess: true },
  "nogales-mariposa": { hours: "Open 24 hours", pedestrianAccess: true, commercialAccess: true },
  "nogales-decongestion": { hours: "6:00 AM – 10:00 PM", pedestrianAccess: false, commercialAccess: true },
  "el-paso-ysleta": { hours: "Open 24 hours", pedestrianAccess: true, commercialAccess: true },
  "el-paso-stanton": { hours: "Open 24 hours", pedestrianAccess: false, commercialAccess: true },
  "el-paso-bridge-of-americas": { hours: "Open 24 hours", pedestrianAccess: true, commercialAccess: false },
  "laredo-north": { hours: "Open 24 hours", pedestrianAccess: false, commercialAccess: true },
  hidalgo: { hours: "Open 24 hours", pedestrianAccess: true, commercialAccess: true },
  brownsville: { hours: "Open 24 hours", pedestrianAccess: true, commercialAccess: true },
};

/** Main recommendation function — contract for future real implementation */
export async function recommendCrossing(
  input: RecommendationInput
): Promise<CrossingRecommendation> {
  return mockRecommendation(input);
}

/** Mock recommendation implementation with route-dependent data */
function mockRecommendation(
  input: RecommendationInput
): CrossingRecommendation {
  const { start, destination, direction } = input;

  const candidates = findCandidateCrossings(start, destination, direction);

  if (candidates.length === 0) {
    return {
      crossingId: "unknown",
      crossingName: "No crossing found",
      mexicanCity: "",
      usCity: "",
      mexicanState: "",
      usState: "",
      mexicanAddress: "",
      usAddress: "",
      corridor: "",
      coordinates: { lat: 0, lng: 0 },
      waitTime: 0,
      totalJourneyTime: 0,
      score: 0,
      reason: {
        headline: "No crossings available",
        detail: "Could not find crossings for this route",
      },
      confidence: "low",
      generatedAt: new Date().toISOString(),
      lanes: [],
      facts: { hours: "Unknown", pedestrianAccess: false, commercialAccess: false },
      alternatives: [],
    };
  }

  const crossingsWithScores = candidates.map((crossing) => {
    const distToStart = haversineDistance({ lat: start.latitude, lng: start.longitude }, crossing.coordinates);
    const distToDest = haversineDistance({ lat: destination.latitude, lng: destination.longitude }, crossing.coordinates);

    const approachTime = Math.round(distToStart * 1.2);
    const departureTime = Math.round(distToDest * 0.8);
    const waitTime = generateRouteDependentWait(
      crossing.id,
      start,
      destination
    );
    const totalTime = approachTime + waitTime + departureTime;

    return {
      crossing,
      approachTime,
      departureTime,
      waitTime,
      totalTime,
    };
  });

  crossingsWithScores.sort((a, b) => a.totalTime - b.totalTime);

  const best = crossingsWithScores[0];
  const secondBest = crossingsWithScores[1];
  const alternatives = crossingsWithScores.slice(1).map((item) => ({
    crossingId: item.crossing.id,
    crossingName: item.crossing.name,
    mexicanCity: item.crossing.mexicanCity,
    usCity: item.crossing.usCity,
    mexicanState: item.crossing.mexicanState,
    usState: item.crossing.usState,
    waitTime: item.waitTime,
    totalJourneyTime: item.totalTime,
    deltaMinutes: item.totalTime - best.totalTime,
  }));

  const confidence = best.totalTime < 120 ? "high" : "medium";

  const deltaVsNext = secondBest ? secondBest.totalTime - best.totalTime : 0;
  const headline = secondBest
    ? `Fastest overall`
    : "Best crossing for your route";
  const detail = secondBest
    ? `${deltaVsNext} min faster than ${secondBest.crossing.name}`
    : undefined;

  return {
    crossingId: best.crossing.id,
    crossingName: best.crossing.name,
    mexicanCity: best.crossing.mexicanCity,
    usCity: best.crossing.usCity,
    mexicanState: best.crossing.mexicanState,
    usState: best.crossing.usState,
    mexicanAddress: best.crossing.mexicanAddress,
    usAddress: best.crossing.usAddress,
    corridor: best.crossing.corridor,
    coordinates: best.crossing.coordinates,
    waitTime: best.waitTime,
    totalJourneyTime: best.totalTime,
    score: 100 - Math.min(best.totalTime / 2, 50),
    reason: {
      headline,
      detail,
    },
    confidence,
    generatedAt: new Date().toISOString(),
    lanes: MOCK_LANES[best.crossing.id] || [{ name: "Standard", waitTime: best.waitTime, isOpen: true }],
    facts: MOCK_FACTS[best.crossing.id] || { hours: "Open 24 hours", pedestrianAccess: true, commercialAccess: true },
    alternatives,
  };
}

/** Generate route-dependent mock wait times */
function generateRouteDependentWait(
  crossingId: string,
  start: Place,
  destination: Place
): number {
  const baseWaits: Record<string, number> = {
    "san-ysidro": 15,
    "otay-mesa": 21,
    tecate: 28,
    "calexico-west": 18,
    "calexico-east": 22,
    "nogales-mariposa": 20,
    "nogales-decongestion": 25,
    "san-luis": 16,
    "el-paso-ysleta": 19,
    "el-paso-stanton": 23,
    "el-paso-bridge-of-americas": 27,
    "laredo-north": 21,
    hidalgo: 17,
    brownsville: 24,
  };

  const baseWait = baseWaits[crossingId] || 20;

  const timeOfDay = new Date().getHours();
  let timeMultiplier = 1;
  if (timeOfDay >= 7 && timeOfDay <= 9) timeMultiplier = 1.4;
  else if (timeOfDay >= 16 && timeOfDay <= 18) timeMultiplier = 1.3;
  else if (timeOfDay >= 22 || timeOfDay <= 5) timeMultiplier = 0.7;

  const startDistFromBorder = Math.abs(start.latitude - 32) + Math.abs(start.longitude + 117);
  const destDistFromBorder = Math.abs(destination.latitude - 32) + Math.abs(destination.longitude + 117);
  const routeComplexity = (startDistFromBorder + destDistFromBorder) / 200;

  const finalWait = Math.round(
    baseWait * timeMultiplier * (1 + routeComplexity * 0.2)
  );

  return Math.max(5, Math.min(finalWait, 60));
}
