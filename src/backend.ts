import { init_embedded, target_usdpl } from "fantastic-wasm";
import { Fan } from "fantastic-wasm";

import { Floor, Point, DEFAULT_FLOOR } from "./curve";

/** Must match PORT in backend-rs/src/main.rs (the original Fantastic uses 44444). */
const USDPL_PORT: number = 44445;

var FAN_CLIENT: Fan | undefined = undefined;
var initPromise: Promise<void> | undefined = undefined;

// Utility

export function resolve(promise: Promise<any>, setter: any) {
    (async function () {
        let data = await promise;
        if (data != null) {
            console.debug("Got resolved", data);
            setter(data);
        } else {
            console.warn("Resolve failed:", data);
        }
    })();
}

async function initBackend() {
    await init_embedded();
    FAN_CLIENT = new Fan(USDPL_PORT);
    console.log("FANTASTICPLUS: USDPL started for framework: " + target_usdpl());
}

/** Initialise once; every caller can await readiness before the first RPC. */
export function ensureReady(): Promise<void> {
    if (initPromise == null) {
        initPromise = initBackend();
    }
    return initPromise;
}

// Back-end functions

export async function setEnabled(value: boolean): Promise<boolean> {
    return (await FAN_CLIENT!.set_enable(value)) ?? value;
}

export async function getEnabled(): Promise<boolean> {
    return (await FAN_CLIENT!.get_enable(true)) ?? false;
}

export async function setInterpolate(value: boolean): Promise<boolean> {
    return (await FAN_CLIENT!.set_interpolate(value)) ?? value;
}

export async function getInterpolate(): Promise<boolean> {
    return (await FAN_CLIENT!.get_interpolate(true)) ?? false;
}

export async function getVersion(): Promise<string> {
    return (await FAN_CLIENT!.version_str(true)) ?? "version";
}

export async function getName(): Promise<string> {
    return (await FAN_CLIENT!.name(true)) ?? "broken";
}

export async function getCurve(): Promise<Point[]> {
    var x_s = (await FAN_CLIENT!.get_curve_x(true)) ?? [];
    var y_s = (await FAN_CLIENT!.get_curve_y(true)) ?? [];
    let result: Point[] = [];
    for (let i = 0; i < x_s.length && i < y_s.length; i++) {
        result.push({ x: x_s[i], y: y_s[i] });
    }
    return result;
}

/** Replace the whole curve; also switches away from a SteamOS profile. */
export async function setCurve(points: Point[]): Promise<boolean> {
    const payload = JSON.stringify(points.map((p) => [p.x, p.y]));
    return (await FAN_CLIENT!.set_curve(payload)) ?? false;
}

/** Fixed ratio 0..1, or null to turn the fixed speed off. */
export async function setFixedSpeed(ratio: number | null): Promise<number | null> {
    const r = (await FAN_CLIENT!.set_fixed_speed(ratio == null ? -1 : ratio)) ?? -1;
    return r < 0 ? null : r;
}

export async function getFixedSpeed(): Promise<number | null> {
    const r = (await FAN_CLIENT!.get_fixed_speed(true)) ?? -1;
    return r < 0 ? null : r;
}

/** Follow a SteamOS profile; null returns to the point curve. */
export async function setSystemProfile(name: string | null): Promise<string | null> {
    const r = (await FAN_CLIENT!.set_system_profile(name ?? "")) ?? "";
    return r === "" ? null : r;
}

export async function getSystemProfile(): Promise<string | null> {
    const r = (await FAN_CLIENT!.get_system_profile(true)) ?? "";
    return r === "" ? null : r;
}

export type SystemProfile = {
    name: string;
    description: string;
    points: Point[];
    fromSystemFiles: boolean;
};

export async function getSystemProfiles(): Promise<{ supported: boolean; profiles: SystemProfile[] }> {
    try {
        const parsed = JSON.parse((await FAN_CLIENT!.get_system_profiles(true)) ?? "{}");
        return {
            supported: !!parsed.supported,
            profiles: (parsed.profiles ?? []).map((p: any) => ({
                name: String(p.name ?? ""),
                description: String(p.description ?? p.name ?? ""),
                points: (p.points ?? []).map((pair: number[]) => ({ x: pair[0], y: pair[1] })),
                fromSystemFiles: !!p.from_system_files,
            })),
        };
    } catch (e) {
        console.warn("[FantasticPlus] bad system profile payload", e);
        return { supported: false, profiles: [] };
    }
}

export type Status = {
    controlling: boolean;
    reason: string;
    mode: string;
    targetRatio: number | null;
    floorRatio: number;
    temperature: number | null;
    rpm: number | null;
    /** Last few minutes of temperatures in °C, oldest first, one per second; null = no reading. */
    history: (number | null)[];
    /** Fan speed in percent (0..100) for the same seconds as `history`, oldest first; null = no reading. */
    fanHistory: (number | null)[];
    device: string;
    rpmMin: number;
    rpmMax: number;
    firmwareCurve: boolean;
    floor: Floor;
};

export async function getStatus(): Promise<Status | null> {
    try {
        const s = JSON.parse((await FAN_CLIENT!.get_status(true)) ?? "null");
        if (!s) return null;
        return {
            controlling: !!s.controlling,
            reason: String(s.reason ?? ""),
            mode: String(s.mode ?? ""),
            targetRatio: typeof s.target_ratio === "number" ? s.target_ratio : null,
            floorRatio: Number(s.floor_ratio ?? 0),
            temperature: typeof s.temperature === "number" ? s.temperature : null,
            rpm: typeof s.rpm === "number" ? s.rpm : null,
            history: Array.isArray(s.history) ? s.history.map((t: number) => (t > 0 ? t / 10 : null)) : [],
            fanHistory: Array.isArray(s.fan_history) ? s.fan_history.map((p: number) => (p <= 100 ? p : null)) : [],
            device: String(s.device ?? ""),
            rpmMin: Number(s.rpm_min ?? 0),
            rpmMax: Number(s.rpm_max ?? 0),
            firmwareCurve: !!s.firmware_curve,
            floor: Array.isArray(s.floor) ? s.floor : DEFAULT_FLOOR,
        };
    } catch (e) {
        console.warn("[FantasticPlus] bad status payload", e);
        return null;
    }
}
