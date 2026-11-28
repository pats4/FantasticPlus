// Custom curve profiles, stored in the Steam client's localStorage.
import { Point, STARTER_CURVE, sanitize } from "./curve";

export type Profile = { id: string; name: string; curve: Point[] };

const PROFILES_KEY = "fantasticplus.profiles.v1";
const ACTIVE_KEY = "fantasticplus.active.v1";

export function newId(): string {
  return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function valid(p: any): p is Profile {
  return p && typeof p.id === "string" && typeof p.name === "string" && Array.isArray(p.curve);
}

/**
 * Saved profiles, or a single "Default" profile on first run. A fresh Default starts
 * from the curve the back-end already holds, or from STARTER_CURVE when there is none.
 */
export function loadProfiles(seed?: Point[]): Profile[] {
  try {
    const raw = window.localStorage.getItem(PROFILES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const profiles = parsed.filter(valid).map((p) => ({ ...p, curve: sanitize(p.curve) }));
        if (profiles.length > 0) return profiles;
      }
    }
  } catch (e) {
    console.warn("[FantasticPlus] could not read profiles", e);
  }
  const curve = seed && seed.length >= 2 ? sanitize(seed) : sanitize(STARTER_CURVE);
  const seeded = [{ id: newId(), name: "Default", curve }];
  saveProfiles(seeded);
  return seeded;
}

export function saveProfiles(profiles: Profile[]): void {
  try {
    window.localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.warn("[FantasticPlus] could not save profiles", e);
  }
}

export function loadActive(): string | null {
  try {
    return window.localStorage.getItem(ACTIVE_KEY);
  } catch (e) {
    return null;
  }
}

export function saveActive(id: string | null): void {
  try {
    if (id == null) window.localStorage.removeItem(ACTIVE_KEY);
    else window.localStorage.setItem(ACTIVE_KEY, id);
  } catch (e) {
    // not fatal
  }
}

/** Unique, trimmed, non-empty name (case-insensitive). */
export function uniqueName(raw: string, profiles: Profile[], exceptId: string | null): string {
  const base = raw.replace(/\s+/g, " ").trim().slice(0, 24) || "Custom";
  const taken = new Set(profiles.filter((p) => p.id !== exceptId).map((p) => p.name.toLowerCase()));
  if (!taken.has(base.toLowerCase())) return base;
  let i = 2;
  while (taken.has((base + " (" + i + ")").toLowerCase())) i++;
  return base + " (" + i + ")";
}
