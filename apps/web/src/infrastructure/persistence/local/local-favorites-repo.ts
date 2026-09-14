export interface FavoritesRepository {
  get(): string[];
  add(id: string): void;
  remove(id: string): void;
  isFavorite(id: string): boolean;
  getOrdered(): string[];
}

export class LocalFavoritesRepository implements FavoritesRepository {
  private readonly STORAGE_KEY = "cruze-favorites-legacy";

  get(): string[] {
    try {
      const serialized = localStorage.getItem(this.STORAGE_KEY);
      if (!serialized) return [];
      return JSON.parse(serialized);
    } catch {
      return [];
    }
  }

  add(id: string): void {
    try {
      const current = this.get();
      if (!current.includes(id)) {
        const ordered = [...new Set([id, ...current])];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ordered));
      }
    } catch {
      // silent failure
    }
  }

  remove(id: string): void {
    try {
      const current = this.get();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(current.filter((fid) => fid !== id)));
    } catch {
      // silent failure
    }
  }

  isFavorite(id: string): boolean {
    return this.get().includes(id);
  }

  getOrdered(): string[] {
    return this.get();
  }
}