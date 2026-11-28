use std::sync::atomic::{AtomicBool, AtomicU32, Ordering};

use sysfuss::{HwMonPath, HwMonAttribute, HwMonAttributeType, HwMonAttributeItem, BasicEntityPath};
use sysfuss::{SysPath, capability::attributes, SysEntityAttributesExt};

const VALVE_FAN_SERVICE: &str = "jupiter-fan-control.service";
/// Re-check that jupiter-fan-control is still stopped every this many ticks.
const SERVICE_CHECK_TICKS: u32 = 10;

pub struct SteamDeckFan {
    hwmon: HwMonPath,
    rpm_range: std::ops::Range<f64>,
    ticks: AtomicU32,
    recalc_missing_logged: AtomicBool,
}

impl SteamDeckFan {
    pub fn maybe_find() -> Option<Self> {
        find_hwmon(crate::sys::SYSFS_ROOT).map(|hwmon| {
            Self {
                hwmon,
                // computed once: upstream enumerated every CPU on every tick
                rpm_range: fan_range(),
                ticks: AtomicU32::new(0),
                recalc_missing_logged: AtomicBool::new(false),
            }
        })
    }

    pub fn maybe_find_thermal_zone() -> Option<BasicEntityPath> {
        find_thermal_zone(crate::sys::SYSFS_ROOT)
    }

    fn write_recalc(&self, enabled: bool) {
        // SteamOS 3.7+ removed `recalculate`; only fan1_target is required then.
        if !self.hwmon.as_ref().join("recalculate").exists() {
            if !self.recalc_missing_logged.swap(true, Ordering::Relaxed) {
                log::info!("no `recalculate` attribute; depending on fan1_target alone");
            }
            return;
        }
        if let Err(e) = self.hwmon.set(RECALCULATE_ATTR, enabled as u8) {
            log::error!("failed to write fan recalculate: {}", e);
        }
    }
}

impl super::super::Adapter for SteamDeckFan {
    fn name(&self) -> &'static str { "Steam Deck" }

    fn set_control(&self, take_over: bool) -> std::io::Result<()> {
        if take_over {
            stop_fan_service();
            self.write_recalc(true);
            if detect_jupiter_fan_service() {
                return Err(std::io::Error::other("jupiter-fan-control is still running"));
            }
        } else {
            self.write_recalc(false);
            // 0 returns the fan to the EC's own control on current BIOSes, exactly what
            // jupiter-fan-control does on exit, in case the service fails to start.
            if let Err(e) = self.hwmon.set(FAN1_TARGET_ATTR, 0u64) {
                log::error!("failed to reset fan1_target: {}", e);
            }
            start_fan_service();
            if !detect_jupiter_fan_service() {
                log::error!("{} did not start after hand-back", VALVE_FAN_SERVICE);
            }
        }
        Ok(())
    }

    fn apply(&self, ratio: f64) -> std::io::Result<()> {
        let tick = self.ticks.fetch_add(1, Ordering::Relaxed);
        if tick % SERVICE_CHECK_TICKS == 0 && detect_jupiter_fan_service() {
            log::warn!("{} was restarted by something else; stopping it again", VALVE_FAN_SERVICE);
            stop_fan_service();
        }
        let range = &self.rpm_range;
        let rpm = range.start + ratio.clamp(0.0, 1.0) * (range.end - range.start);
        let rpm = if rpm.is_finite() { rpm.max(range.start).round() as u64 } else { range.end as u64 };
        self.hwmon.set(FAN1_TARGET_ATTR, rpm)
    }

    fn rpm_range(&self) -> std::ops::Range<f64> { self.rpm_range.clone() }

    fn sensor<'a: 'b, 'b>(&'a self) -> Option<&'b dyn crate::adapters::SensorAdapter> {
        Some(self)
    }
}

impl super::super::super::SensorAdapter for SteamDeckFan {
    fn read(&self) -> Result<crate::adapters::SensorReading, std::io::Error> {
        Ok(crate::adapters::SensorReading {
            value: read_fan(&self.hwmon)? as f64,
        })
    }
}

const RECALCULATE_ATTR: HwMonAttribute = HwMonAttribute::custom("recalculate");
const FAN1_INPUT_ATTR: HwMonAttribute = HwMonAttribute::new(HwMonAttributeType::Fan, 1, HwMonAttributeItem::Input);
const FAN1_LABEL_ATTR: HwMonAttribute = HwMonAttribute::new(HwMonAttributeType::Fan, 1, HwMonAttributeItem::Label);
const FAN1_TARGET_ATTR: HwMonAttribute = HwMonAttribute::custom("fan1_target");

const HWMON_NEEDS: [HwMonAttribute; 3] = [
    //RECALCULATE_ATTR,
    FAN1_INPUT_ATTR,
    FAN1_TARGET_ATTR,
    FAN1_LABEL_ATTR,
];

fn find_hwmon<P: AsRef<std::path::Path>>(path: P) -> Option<HwMonPath> {
    let syspath = SysPath::path(path);
    match syspath.hwmon(attributes(HWMON_NEEDS.into_iter()))
    {
        Err(e) => {
            log::error!("sysfs hwmon iter error while finding Steam Deck fan: {}", e);
            None
        },
        Ok(mut iter) => {
            if let Some(entity) = iter.next() {
                log::info!("Found Steam Deck fan hwmon {}", entity.as_ref().display());
                Some(entity)
            } else {
                log::error!("sysfs hwmon iter empty while finding Steam Deck fan: [no capable results]");
                None
            }
        }
    }
}

fn find_thermal_zone<P: AsRef<std::path::Path>>(path: P) -> Option<BasicEntityPath> {
    let syspath = SysPath::path(path);
    match syspath.class("thermal",
        |ent: &BasicEntityPath| ent.exists(&"temp".to_owned()) && ent.exists(&"type".to_owned()) && ent.attribute("type".to_owned()).map(|val: String| val.to_lowercase() != "processor").unwrap_or(false))
    {
        Err(e) => {
            log::error!("sysfs thermal class iter error while finding Steam Deck thermal zone: {}", e);
            None
        },
        Ok(mut iter) => {
            if let Some(entity) = iter.next() {
                log::info!("Found thermal zone {}", entity.as_ref().display());
                Some(entity)
            } else {
                log::error!("sysfs thermal class iter empty while finding Steam Deck thermal zone: [no capable results]");
                None
            }
        }
    }
}

fn detect_jupiter_fan_service() -> bool {
    match std::process::Command::new("systemctl")
        .args(["is-active", VALVE_FAN_SERVICE])
        .output() {
        Ok(cmd) => String::from_utf8_lossy(&cmd.stdout).trim() == "active",
        Err(e) => {
            log::error!("`systemctl is-active {}` err: {}", VALVE_FAN_SERVICE, e);
            false
        }
    }
}

fn start_fan_service() {
    match std::process::Command::new("systemctl")
        .args(["start", VALVE_FAN_SERVICE])
        .output() {
        Err(e) => log::error!("`systemctl start {}` err: {}", VALVE_FAN_SERVICE, e),
        Ok(out) => log::debug!("started `{}`:\nstdout:{}\nstderr:{}", VALVE_FAN_SERVICE, String::from_utf8_lossy(&out.stdout), String::from_utf8_lossy(&out.stderr)),
    }
}

fn stop_fan_service() {
    match std::process::Command::new("systemctl")
        .args(["stop", VALVE_FAN_SERVICE])
        .output() {
        Err(e) => log::error!("`systemctl stop {}` err: {}", VALVE_FAN_SERVICE, e),
        Ok(out) => log::debug!("stopped `{}`:\nstdout:{}\nstderr:{}", VALVE_FAN_SERVICE, String::from_utf8_lossy(&out.stdout), String::from_utf8_lossy(&out.stderr)),
    }
}

fn read_fan(hwmon: &HwMonPath) -> std::io::Result<u64> {
    match hwmon.attribute(FAN1_INPUT_ATTR){
        Ok(x) => Ok(x),
        Err(sysfuss::EitherErr2::First(e)) => {
            log::error!("Failed Steam Deck read_fan(): {}", e);
            Err(e)
        },
        Err(sysfuss::EitherErr2::Second(e)) => {
            log::error!("Failed Steam Deck read_fan(): {}", e);
            Err(std::io::Error::other(e))
        },
    }
}

/// CPU model from /proc/cpuinfo (tells the LCD and OLED Decks apart).
fn cpu_model() -> Option<String> {
    let info = std::fs::read_to_string("/proc/cpuinfo").ok()?;
    info.lines()
        .find(|l| l.starts_with("model name"))
        .and_then(|l| l.split_once(':'))
        .map(|(_, v)| v.trim().to_owned())
}

fn fan_range() -> std::ops::Range<f64> {
    match cpu_model() {
        None => 1.0..7123.0,
        // LCD
        Some(name) if name.contains("AMD Custom APU 0405") => 1.0..7000.0,
        // OLED
        Some(name) if name.contains("AMD Custom APU 0932") => 1.0..9000.0,
        // Hopefully never reached
        Some(_) => 1.0..7001.0,
    }
}
