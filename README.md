# FantasticPlus

[![build](https://github.com/pats4/FantasticPlus/actions/workflows/build.yml/badge.svg)](https://github.com/pats4/FantasticPlus/actions/workflows/build.yml)
[![release](https://img.shields.io/github/v/release/pats4/FantasticPlus)](https://github.com/pats4/FantasticPlus/releases/latest)
[![license](https://img.shields.io/badge/license-GPL--3.0-green)](LICENSE)

> **Unofficial fork.** FantasticPlus is an independent fork of Fantastic; it is not made or supported by NGnius. Please report problems [here](https://github.com/pats4/FantasticPlus/issues), not upstream.

<!-- ![FantasticPlus panel](assets/screenshot.png) -->

Fan control for the Steam Deck, as a [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader)
plugin. Draw your own fan curves, switch between profiles and pin the fan to a fixed
speed, all with a thermal safety floor that keeps the Deck from overheating whatever
you choose.

FantasticPlus is built on [Fantastic](https://git.ngram.ca/NG-SD-Plugins/Fantastic)
by NGnius and is **built entirely from the source in this repository**: no prebuilt
binaries are stored here, and every release is compiled by GitHub Actions.

## Install

1. In Game Mode, open Decky's settings (⚙) → **Developer** → **Install Plugin from URL**
   (turn on *Developer mode* in Decky's general settings first if you don't see it).
2. Paste:
   ```
   https://github.com/pats4/FantasticPlus/releases/latest/download/FantasticPlus.zip
   ```
3. Open the Quick Access menu (`…`) → **FantasticPlus**.

The same link always points at the newest release, so repeating these steps
updates the plugin. You can also download the zip from
[Releases](https://github.com/pats4/FantasticPlus/releases) and use
*Install Plugin from ZIP file*.

## Using it

**Mode** decides who drives the fan:

| Mode | What happens |
|---|---|
| **SteamOS** | The plugin does nothing; SteamOS controls the fan as usual. |
| **Profile** | The selected profile below drives the fan. |
| **50% / 75% / 100%** | Fixed speed (raised automatically when the Deck gets hot). |

**Profiles** are listed as cards in the panel:

- Tap a card to select it; tap the selected card again to edit it.
- In the editor, tap empty space to add a point and tap a point to remove it.
  Changes are only applied when you press **Save**.
- **Manage profiles** lets you create, rename and delete profiles.

**Graph**: under *Current Temperature*, a small graph shows temperature (blue,
°C on the left) and fan speed (orange, % on the right) for the last minute; tap it
to switch to the last 5 minutes. It is kept in memory only (300 readings, under
1 KB) and starts empty after a reboot or wake from sleep.

**Linear Interpolation** draws straight lines between points; turn it off for
steps that hold each point's speed until the next one.

## Safety

The plugin takes the fan away from SteamOS, so it is built to fail safe:

- **Thermal safety floor**, always on, in every mode:

  | Temperature | Minimum fan speed |
  |---|---|
  | up to 80 °C | none |
  | 80 → 90 °C | 40% → 60% |
  | 90 → 95 °C | 60% → 100% |
  | 95 °C and above | 100% |

  The editor shades this zone, moves points you place inside it onto its edge,
  and shows a dashed line wherever the floor holds your curve up.
- **SteamOS gets the fan back** when you choose SteamOS mode, when Decky stops or
  reloads the plugin, if the back-end crashes or is killed, and after every reboot.
- **Watchdog**: five failed fan writes or temperature reads in a row hand the fan
  back to SteamOS until you choose a mode again.
- **Incomplete curves are ignored**: a profile needs at least two points before it
  can drive the fan.
- **No fighting**: if the original Fantastic plugin is running, FantasticPlus
  refuses to take over.
- **Robust settings**: curves are cleaned before use, settings are saved
  atomically, and a damaged settings file is set aside instead of crashing.

## Troubleshooting

- **Logs**: `/tmp/fantasticplus.log` (back-end) and `/tmp/fantasticplus.py.log`
  (plugin loader).
- **Settings**: the mode and running curve are in
  `~/.config/fantasticplus/fantastic.json` (delete it to start over); profiles are
  stored by the Steam client itself.
- **"SteamOS has the fan" in the panel**: the line below it gives the reason, for
  example a profile with fewer than two points or the watchdog having tripped.
- **Stuck on "Loading..."**: the back-end did not start; check the logs above.
- Running alongside the original **Fantastic** is fine as long as only one of
  them controls the fan (they use different ports, folders and settings).

## Supported devices

The Steam Deck LCD and OLED are supported; the fan range (7000 or 9000 RPM) is detected automatically.

> Not yet tested on real hardware. On first use, keep an eye on temperatures and
> the log, and please [open an issue](https://github.com/pats4/FantasticPlus/issues)
> if anything looks wrong.

## Building and verifying

```bash
./build.sh    # -> out/FantasticPlus.zip and out/SHA256SUMS
```

`build.sh` fetches NGnius's [usdpl-rs](https://git.ngram.ca/NG-SD-Plugins/usdpl-rs),
[nRPC](https://git.ngram.ca/NGnius/nRPC) and [sysfs-nav](https://git.ngram.ca/NGnius/sysfs-nav)
at pinned commits (`scripts/fetch-deps.sh`), runs the back-end tests, and builds
the static back-end, the WASM bridge and the front-end. The requirements are listed
at the top of the script, and [the workflow](.github/workflows/build.yml) shows a
complete setup. Each release lists its `SHA256SUMS` and links to the Actions run
that built it.

To publish a release: **Actions → build → Run workflow**, enter a tag such as
`v0.8.1`.

To see everything that differs from the last official Fantastic:

```bash
git fetch https://git.ngram.ca/NG-SD-Plugins/Fantastic.git main
git diff FETCH_HEAD -- backend-rs src main.py
```

## Credits and license

- [Fantastic](https://git.ngram.ca/NG-SD-Plugins/Fantastic) and its libraries by
  NGnius. Its full commit history is kept in this repository.

Licensed under the [GNU GPL v3](LICENSE), like Fantastic.
