import type { Trip } from "@/domain/trip/types";
import type { CrossingRecommendation } from "@/domain/recommendation/types";
import type { StartPlace, DestinationPlace } from "@/types";

export interface TripRepository {
  get(): Trip | null;
  set(trip: Partial<Trip>): void;
  getState: () => {
    geolocationPermission: "pending" | "granted" | "denied";
    start: StartPlace | null;
    destination: DestinationPlace | null;
    tripType: Trip["tripType"];
    direction: Trip["direction"];
    recommendedCrossing: CrossingRecommendation | null;
    status: Trip["status"];
    lastEvaluatedAt: string | null;
  };
  setGeolocationPermission: (p: "pending" | "granted" | "denied") => void;
  setStart: (place: StartPlace | null) => void;
  setDestination: (place: DestinationPlace | null) => void;
  setTripType: (type: Trip["tripType"]) => void;
  setDirection: (direction: Trip["direction"]) => void;
  setRecommendedCrossing: (rec: CrossingRecommendation | null) => void;
  setStatus: (status: Trip["status"]) => void;
  complete: () => void;
  refreshActivity: () => void;
  reset: () => void;
}

function createTripRepository(): TripRepository {
  const STORAGE_KEY = "cruze-trip-legacy";

  // Initial state
  const initialState: Trip = {
    id: "",
    origin: { id: "", name: "", formattedAddress: undefined, latitude: 0, longitude: 0, country: "MX", countryCode: "", city: undefined, region: undefined, type: "current_location" },
    destination: { id: "", name: "", formattedAddress: undefined, latitude: 0, longitude: 0, country: "US", countryCode: "", city: undefined, region: undefined, type: "search" },
    tripType: "unknown",
    direction: null,
    status: "configuring",
    createdAt: new Date().toISOString(),
    lastEvaluatedAt: null,
    geolocationPermission: "pending",
    start: { id: "", name: "", formattedAddress: undefined, latitude: 0, longitude: 0, country: "MX", countryCode: "", city: undefined, region: undefined, type: "current_location" },
    recommendedCrossing: null,
    travelerProfileLevel: "trip",
  };

  // Use a mutable object to avoid TypeScript const inference issues
  const state: { current: Trip } = { current: initialState };

  // Load from localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      state.current = { ...initialState, ...JSON.parse(stored) };
    }
  } catch {
    // silent failure
  }

  function get(): Trip {
    return state.current;
  }

  function set(trip: Partial<Trip>): void {
    try {
      state.current = { ...state.current, ...trip, lastEvaluatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.current));
    } catch {
      // silent failure
    }
  }

  function getState() {
    return {
      geolocationPermission: state.current.geolocationPermission,
      start: state.current.origin,
      destination: state.current.destination,
      tripType: state.current.tripType,
      direction: state.current.direction,
      recommendedCrossing: state.current.recommendedCrossing,
      status: state.current.status,
      lastEvaluatedAt: state.current.lastEvaluatedAt,
    };
  }

  function setGeolocationPermission(p: "pending" | "granted" | "denied") {
    state.current = { ...state.current, geolocationPermission: p };
  }

  function setStart(place: StartPlace | null) {
    state.current = { ...state.current, origin: place };
  }

  function setDestination(place: DestinationPlace | null) {
    state.current = { ...state.current, destination: place };
  }

  function setTripType(type: Trip["tripType"]) {
    state.current = { ...state.current, tripType: type };
  }

  function setDirection(direction: Trip["direction"]) {
    state.current = { ...state.current, direction };
  }

  function setRecommendedCrossing(rec: CrossingRecommendation | null) {
    state.current = { ...state.current, recommendedCrossing: rec };
  }

  function setStatus(status: Trip["status"]) {
    state.current = { ...state.current, status };
  }

  function complete() {
    state.current = { ...state.current, status: "completed" };
  }

  function refreshActivity() {
    state.current = { ...state.current, lastEvaluatedAt: new Date().toISOString() };
  }

  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      state.current = { ...initialState };
    } catch {
      // silent failure
    }
  }

  return {
    get,
    set,
    getState,
    setGeolocationPermission,
    setStart,
    setDestination,
    setTripType,
    setDirection,
    setRecommendedCrossing,
    setStatus,
    complete,
    refreshActivity,
    reset,
  };
}

export const useTripRepository = createTripRepository();