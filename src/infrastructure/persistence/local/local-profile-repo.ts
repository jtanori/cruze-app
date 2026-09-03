import type { TravelerProfile, CrossingMode, VisaType } from "@/types/traveler";

export interface ProfileRepository {
  get(): TravelerProfile | null;
  set(profile: Partial<TravelerProfile>): void;
  reset(): void;
}

export class LocalProfileRepository implements ProfileRepository {
  private readonly STORAGE_KEY = "cruze-traveler";

  get(): TravelerProfile | null {
    try {
      const serialized = localStorage.getItem(this.STORAGE_KEY);
      if (!serialized) return null;
      return JSON.parse(serialized);
    } catch {
      return null;
    }
  }

  set(profile: Partial<TravelerProfile>): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ ...this.get(), ...profile, lastUpdated: new Date().toISOString() }));
    } catch {
      // silent failure
    }
  }

  reset(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch {
      // silent failure
    }
  }
}