# Fantastic+ (FantasticPlus)

[简体中文](README.md) · **[English](README.en.md)**

> A fan-curve plugin for the Steam Deck. It **re-engineers** curve editing and profile management on top of [Fantastic](https://github.com/NGnius/Fantastic) and adds the safety layers the original never had — an independent second take on the original, not a tracking branch of it.

![version](https://img.shields.io/badge/version-0.7.0-blue)
![platform](https://img.shields.io/badge/platform-SteamOS%20%2F%20Steam%20Deck-1a9fff)
![license](https://img.shields.io/badge/license-GPL--3.0-green)

---

## Install

### From a URL (recommended)

Decky can install straight from a zip link, and the same link keeps working for upgrades:

**1. Copy this address**

~~~~
https://github.com/IceyVanci/FantasticPlus/releases/latest/download/FantasticPlus.zip
~~~~

**2. Decky Loader → ⚙ Settings → Developer → “Install Plugin from URL”**

**3. Paste the address → Install**, then restart Decky (or use “Reload plugins” in Decky settings)

**4. Back to Game Mode → Quick Access (⋯) → Fantastic+**

> You can also grab the zip from the [Releases](https://github.com/IceyVanci/FantasticPlus/releases) page and use “Install from file” — same result.

### Manual

1. Download `FantasticPlus.zip`
2. Extract into `~/homebrew/plugins/` so you end up with `~/homebrew/plugins/FantasticPlus/`
3. Restart Decky Loader

> The plugin restores the executable bit on `bin/backend` at startup, so a URL install — or an unzip that dropped the permission — needs no extra `chmod`.

---

## Quick start

1. QAM → Fantastic+
2. Move the **Mode** slider to **Manual** — the plugin stops `jupiter-fan-control` and takes the fan over (the other notches are fixed 50% / 75% / 100%)
3. Hit **✎ Edit curve** to draw one, or just tap a profile card to switch
4. To hand the fan back to SteamOS, move the slider to **System**

**Config** `~/.config/fantasticplus/fantastic.json` ・ **Log** `/tmp/fantasticplus.log`

---

## Features

### Curve editor

- Large canvas (~840×380) with a 10 °C grid, a live current-temperature marker, and a live output read-out in the corner
- **Endpoint hold**: below the first point and above the last point the value is held, never extrapolated
- **Tap empty space to add a point, tap a point to delete it**, with circular hit testing that survives window scaling
- **Linear interpolation** toggle sits under *Profiles* and is available in every mode: on = straight segments, off = steps (hold the left value)
- **The leftmost point is the fan start temperature** and is pinned to 0% (or to the floor value when it sits above 80 °C)

### Dead zone and safety floor

The curve can **never** enter the hot-and-slow dead zone:

| Temperature | Minimum fan speed |
|---|---|
| ≤ 80 °C | no floor |
| 80 → 90 °C | 40% → 60% (linear) |
| 90 → 95 °C | 60% → 100% (linear) |
| ≥ 95 °C | 100% |

- The dead zone is hatched, with a red limit line
- Whenever the curve would dip below the limit it **runs along the edge instead** and is drawn **dashed**, so you can see which part is held up by the floor
- Tapping inside the dead zone **snaps the point onto the edge** and says so — illegal points cannot be created
- The back-end clamps again on every 1 Hz control tick, so even an old saved curve cannot break the floor
- **Manual fixed speeds (50% / 75% / 100%) are bound by the same floor**: asking for 50% at 92 °C yields 80%

### Profiles

- Save several curves and switch in one tap; profiles are shown as cards right in the panel
- **First tap selects (highlight), second tap opens it for viewing / editing** — works even while the plugin is not driving the fan
- Custom profiles can be edited and deleted (the default one is protected)
- The *Profiles* dialog can create, edit and apply slots

### System curves (read-only reference)

- Two built-in SteamOS profiles, **Jupiter** and **Galileo**; selecting one makes the plugin **re-evaluate Valve’s quadratic directly** instead of using the sampled points
- The view is a **read-only reference**: hollow points plus a red “reference only, cannot be modified” note, because the back-end never reads those points
- The dead zone is labelled “applies to custom curves only” — the system algorithm is not subject to this plugin’s floor

### Misc

- Chinese / English switch (slider at the bottom of the panel)
- Fan speed shown as RPM plus a percentage, using the 7000 / 9000 RPM range of the detected model
- Atomic settings writes, with automatic backup of a corrupt config

---

## Safety

The plugin takes over the fan, so it ships with these guards:

| Guard | Behaviour |
|---|---|
| **Boot reset** | Kernel `boot_id` is used to detect a real reboot (sleep/wake does not count). After a reboot the plugin returns to **System** and keeps no takeover state or profile selection |
| **Thermal floor** | See the dead-zone table above; enforced for curves, for fixed speeds and in the editor |
| **Crash / exit hand-off** | On SIGTERM / SIGINT / SIGHUP or a panic it hands the fan back to `jupiter-fan-control.service` |
| **Write watchdog** | Five consecutive `fan1_target` write failures (e.g. SteamOS changed the interface) stop the takeover and return the fan to SteamOS |
| **Startup reconciliation** | Refuses to take over when another fan controller already owns port 44444 |
| **No automatic probing** | Installing never touches the fan; you have to pick a mode yourself |
| **Single-point guard** | With fewer than two points the back-end refuses to control the fan, so a “0% everywhere” curve cannot stall it |

In one sentence: **whatever goes wrong, the thermal control must never be left unattended.**

---

## What changed compared to the original

| Problem | Original | Fantastic+ |
|---|---|---|
| Duplicate x values in interpolation | division by zero → NaN, `NaN as u64 = 0`, **fan stops** | de-duplicated and clamped before interpolating; never emits a non-finite value |
| Dirty config data | no validation, out-of-range points lock it up | sanitised on load, corrupt file backed up |
| Settings writes | in-place overwrite, half a JSON on power loss | atomic write |
| Model detection | always 7000 RPM | 7000 / 9000 chosen by CPU model |
| `recalculate` attribute | removed in SteamOS 3.7+, log spam | degrades gracefully, relies on `fan1_target` only |
| Clicks after resizing | computed from a fixed size | `getBoundingClientRect` + clamp |
| Panel stuck on Loading | race before the back-end is ready | awaitable ready state |
| CPU enumeration every second | full scan each tick | cached fan range |
| High-temperature protection | none | dead zone + double clamping + watchdog + crash hand-off |
| Profile management | one curve | multiple slots + quick cards + read-only system curves |

---

## Coexisting with the original

The plugin id is **FantasticPlus**, and everything from the directory to the port is isolated, so both can be installed side by side:

| Item | Original Fantastic | Fantastic+ |
|---|---|---|
| Plugin directory | `~/homebrew/plugins/Fantastic` | `~/homebrew/plugins/FantasticPlus` |
| Back-end port | 44444 | **44445** |
| Config file | `~/.config/fantastic/fantastic.json` | `~/.config/fantasticplus/fantastic.json` |
| Log | `/tmp/fantastic.log` | `/tmp/fantasticplus.log` |
| Front-end storage | `fantastic.*` | `fantasticplus.*` |

> Both take over `jupiter-fan-control.service`, so **never enable fan takeover in both at once** — they will fight over the fan.

---

## Known limitations

- SteamOS actually runs a **state machine with hysteresis** (`fan_hysteresis` 700, `ec_ramp_rate` 10, a 120 s minimum run time, power feed-forward). This plugin maps temperature directly, so the dynamics will not match exactly
- It reads the CPU (`acpitz`) sensor only, while SteamOS takes the maximum of CPU / GPU / SSD
- Steam Deck only (LCD / OLED)

---

## Model support (LCD / OLED)

| Model | APU | Detection | Fan range |
|---|---|---|---|
| Steam Deck LCD | Aerith · AMD Custom APU 0405 | CPU model string | 1 – 7000 RPM |
| Steam Deck OLED | Sephiroth · AMD Custom APU 0932 | CPU model string | 1 – 9000 RPM |

- hwmon and thermal sensors are discovered **by capability** (the `fan1_input` / `fan1_target` / `fan1_label` attributes), never by a hard-coded hwmon index, so both models are found automatically
- The panel layout is identical on both models (both are 1280×800); nothing clips or stretches on OLED
- **On OLED, pick Galileo under Profiles**: Galileo is the OLED board config and Jupiter the LCD one, so the wrong choice applies the other board’s curve
- If a model’s real ceiling is below the value above, the top of the curve saturates early and the percentage is scaled against that range (display only, control is unaffected)

---

## Building from source

~~~~bash
# 1. WASM bindings (only needed when the proto changed)
cd src/rust
RUSTFLAGS="--cfg aes_compact" wasm-pack build --target web --features decky
python3 scripts/generate_embedded_wasm.py

# 2. Front-end
cd ../..
pnpm install
pnpm build                      # -> dist/index.js

# 3. Back-end (statically linked, independent of the SteamOS glibc)
cd backend-rs
cargo build --release --target x86_64-unknown-linux-musl
cp target/x86_64-unknown-linux-musl/release/fantastic-rs ../bin/backend
~~~~

The dependency paths must match `backend-rs/Cargo.toml`: [usdpl-rs](https://github.com/NGnius/usdpl-rs), [nRPC](https://github.com/NGnius/nRPC), [sysfs-nav](https://github.com/NGnius/sysfs-nav).

---

## Credits and license

- Original project: [NGnius/Fantastic](https://github.com/NGnius/Fantastic) (GPL-3.0). All original copyright notices are preserved.
- Development assistance: refactoring, debugging and documentation were done with **DeepSeek-V4.1-Flash** and the **DeepSeek Harness** agent environment.
- Dependencies: [usdpl-rs](https://github.com/NGnius/usdpl-rs), [nRPC](https://github.com/NGnius/nRPC), [sysfs-nav](https://github.com/NGnius/sysfs-nav), [decky-frontend-lib](https://github.com/SteamDeckHomebrew/decky-frontend-lib)

Released under **GPL-3.0** as well; see [LICENSE](./LICENSE).
