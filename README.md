# FantasticPlus

Steam Deck fan control for [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader),
built **from source** on top of the last official
[Fantastic](https://git.ngram.ca/NG-SD-Plugins/Fantastic) by NGnius
(main @ `924f1aa`, 0.6.0-alpha1). The full upstream history is kept in this
repository, so every change can be reviewed with:

```bash
git diff 924f1aa -- backend-rs src main.py
```

Nothing in this repository is a prebuilt binary. Release zips are produced by the
[build workflow](.github/workflows/build.yml) from the tagged source, and `SHA256SUMS`
is published next to each zip.

> This is not the binary-only "FantasticPlus" by IceyVanci; it replaces it.

## Features

| | Fantastic (upstream) | FantasticPlus |
|---|---|---|
| Modes | on/off | **SteamOS · Profile · 50% · 75% · 100%** slider |
| Curves | one | **any number of profiles**, quick cards in the panel |
| Editor | small canvas, every tap saved | **large editor**, draft until Save, live temperature and output |
| SteamOS profiles | – | **Jupiter (LCD) and Galileo (OLED)**: Valve's formula, read from `/usr/share/jupiter-fan-control` |
| Thermal safety floor | – | **always on**, for curves, fixed speeds and SteamOS profiles |
| Hand-back to SteamOS | – | on exit, SIGTERM/SIGINT/SIGHUP, panic, crash and reboot |
| ROG Ally | firmware curve | firmware curve, with the floor applied |

### Thermal safety floor

The fan can never be made slower than this, whatever the curve or mode says:

| Temperature | Minimum fan speed |
|---|---|
| ≤ 80 °C | none |
| 80 → 90 °C | 40% → 60% |
| 90 → 95 °C | 60% → 100% |
| ≥ 95 °C | 100% |

The editor shades the dead zone, lifts taps inside it onto its edge, and draws the
part of a curve that the floor holds up as a dashed line.

### Safety behaviour

- **Curves with fewer than 2 points** never control the fan; SteamOS keeps it.
- **Watchdog**: 5 failed ticks in a row (fan write or temperature read) hand the fan
  back to SteamOS until you pick a mode again.
- **Hand-back**: on exit, on SIGTERM/SIGINT/SIGHUP and on a panic the back-end sets
  `fan1_target` to 0 (EC control) and starts `jupiter-fan-control`. If the back-end
  is killed outright, `main.py` notices, restarts SteamOS's service and then the
  back-end (with back-off, at most 5 times in a row).
- **Reboot**: after a real reboot (kernel `boot_id` changes; sleep does not count)
  the plugin starts in SteamOS mode.
- **Original Fantastic**: if its back-end is running (port 44444), FantasticPlus
  refuses to take over so the two never fight.
- **Clean data**: curves are sorted, clamped and de-duplicated before use (upstream
  divided by zero on two points at the same temperature and wrote 0 RPM);
  settings are written atomically and a corrupt file is moved to `*.corrupt`.

### SteamOS profiles

Selecting *SteamOS LCD (Jupiter)* or *SteamOS OLED (Galileo)* makes the back-end run
a port of Valve's `jupiter-fan-control` logic: CPU and GPU quadratic curves, the
OLED's APU-power feed-forward (24 s average), 700 RPM output hysteresis, the 120 s
minimum on-time and the higher minimum while charging. The curve shown in the panel
is sampled at idle power and is for reference only. Differences from SteamOS: the SSD
sensor is not used, temperatures are not averaged, and the loop runs at 1 Hz.

## Coexisting with Fantastic

| | Fantastic | FantasticPlus |
|---|---|---|
| Plugin folder | `~/homebrew/plugins/Fantastic` | `~/homebrew/plugins/FantasticPlus` |
| Back-end port | 44444 | 44445 |
| Settings | `~/.config/fantastic/fantastic.json` | `~/.config/fantasticplus/fantastic.json` |
| Logs | `/tmp/fantastic.log` | `/tmp/fantasticplus.log`, `/tmp/fantasticplus.py.log` |

## Install

Download `FantasticPlus.zip` from the [releases](https://github.com/pats4/FantasticPlus/releases)
(or the `FantasticPlus` artifact of a [build run](https://github.com/pats4/FantasticPlus/actions)),
then in Decky: *Settings → Developer → Install plugin from ZIP file*.

## Build from source

```bash
./build.sh   # -> out/FantasticPlus.zip and out/SHA256SUMS
```

`build.sh` checks out NGnius's
[usdpl-rs](https://git.ngram.ca/NG-SD-Plugins/usdpl-rs),
[nRPC](https://git.ngram.ca/NGnius/nRPC) and
[sysfs-nav](https://git.ngram.ca/NGnius/sysfs-nav) at pinned commits into `deps/`
(see `scripts/fetch-deps.sh`), runs the back-end tests, then builds the static
back-end, the WASM bridge and the front-end. Requirements are listed at the top of
`build.sh`; the workflow file shows a complete setup on Ubuntu.

## Status

The back-end logic is unit tested and the RPC interface was exercised end to end
against the built binary in Chromium. It has **not yet been tested on real Steam
Deck or ROG Ally hardware**; check `/tmp/fantasticplus.log` on first use and keep an
eye on temperatures.

## License

GNU GPLv3, like Fantastic. Original code © NGnius.
