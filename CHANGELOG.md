# Changelog

Each release's notes on GitHub are taken from its section here.

## v0.9.1

**Fix: the back-end now starts.** In v0.9.0 the back-end never started, because Decky runs the plugin's start-up code on the plugin class rather than an instance. The panel stayed on "Loading..." and SteamOS kept the fan. Nothing was harmed.

**Only your Deck's SteamOS profile is offered.** The back-end reads `/sys/class/dmi/id/board_name` and lists only *SteamOS LCD (Jupiter)* on an LCD Deck or *SteamOS OLED (Galileo)* on an OLED, so you can't pick the wrong one by mistake. Both are still listed if the board isn't recognised. If you had saved the other board's profile, the plugin goes back to your own curve.

## v0.9.0

**Temperature graph.** Under *Current Temperature*, a small graph shows the last minute; tap it to switch to the last 5 minutes. It is kept in memory only (300 readings, about 1 KB): nothing is written to disk, and it starts empty after a reboot or wake from sleep. It uses the readings the fan control already takes every second, so it adds no sensor reads.

**Lighter on resources**
- The panel now checks with the back-end only while the Quick Access menu is showing, with one small request every 2 s. With the menu closed, during games, it makes no requests at all.
- The two background feeds for temperature and fan speed, which never stopped once opened, are gone. Each one kept a back-end thread busy and read the sensors a second time.
- Smaller back-end: the `sysinfo` library and the libraries it pulled in are removed. LCD and OLED Decks are now told apart by reading `/proc/cpuinfo`.

Fan speed and temperature in the panel now refresh every 2 s; the fan speed used to refresh every second.

## v0.8.0

Rebuilt from source on upstream Fantastic: mode slider (SteamOS, Profile, 50/75/100%), profiles, a large curve editor, SteamOS LCD and OLED profiles, and an always-on thermal safety floor.
