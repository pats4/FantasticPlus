// Custom curve profiles, stored in the Steam client's localStorage.
import { Point, STARTER_CURVE, sanitize } from "./curve";

export type Profile = { id: string; name: string; curve: Point[] };

const PROFILES_KEY = "fantasticplus.profiles.v1";
const ACTIVE_KEY = "fantasticplus.active.v1";
/** Active-profile value used for a SteamOS profile, e.g. "system:jupiter". */
export const SYSTEM_PREFIX = "system:";

export function newId(): string {
  return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function valid(p: any): p is Profile {
  return p && typeof p.id === "string" && typeof p.name === "string" && Array.isArray(p.curve);
}

function sameCurve(a: Point[], b: Point[]): boolean {
  return a.length === b.length && a.every((p, i) => p.x === b[i].x && p.y === b[i].y);
}

/**
 * Saved profiles, or a single "Default" profile on first run. Default starts as a
 * copy of the board's SteamOS profile (Galileo on an OLED Deck, Jupiter on an LCD Deck),
 * so a fresh install behaves like stock until the user edits it.
 */
export function loadProfiles(seed?: Point[], systemCurve?: Point[]): Profile[] {
  const fallback = systemCurve && systemCurve.length >= 2 ? sanitize(systemCurve) : null;
  try {
    const raw = window.localStorage.getItem(PROFILES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        let profiles = parsed.filter(valid).map((p) => ({ ...p, curve: sanitize(p.curve) }));
        // older versions seeded Default from STARTER_CURVE; move an untouched one to the SteamOS copy
        if (fallback && profiles.length === 1 && profiles[0].name === "Default" && sameCurve(profiles[0].curve, sanitize(STARTER_CURVE))) {
          profiles = [{ ...profiles[0], curve: fallback }];
          saveProfiles(profiles);
        }
        if (profiles.length > 0) return profiles;
      }
    }
  } catch (e) {
    console.warn("[FantasticPlus] could not read profiles", e);
  }
  const curve = seed && seed.length >= 2 ? sanitize(seed) : fallback ?? sanitize(STARTER_CURVE);
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
export function uniqueName(raw: string, profiles: Profile[], exceptId: string | null, reserved: string[] = []): string {
  const base = raw.replace(/\s+/g, " ").trim().slice(0, 24) || "Custom";
  const taken = new Set(
    profiles.filter((p) => p.id !== exceptId).map((p) => p.name.toLowerCase()).concat(reserved.map((r) => r.toLowerCase())),
  );
  if (!taken.has(base.toLowerCase())) return base;
  let i = 2;
  while (taken.has((base + " (" + i + ")").toLowerCase())) i++;
  return base + " (" + i + ")";
}
