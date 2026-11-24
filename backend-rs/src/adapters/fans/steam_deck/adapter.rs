use sysfuss::{HwMonPath, HwMonAttribute, HwMonAttributeType, HwMonAttributeItem, BasicEntityPath};
use sysfuss::{SysPath, capability::attributes, SysEntityAttributesExt};

use crate::datastructs::{Settings, GraphPoint};

const VALVE_FAN_SERVICE: &str = "jupiter-fan-control.service";

pub struct SteamDeckFan {
    hwmon: HwMonPath,
}

impl SteamDeckFan {
    pub fn maybe_find() -> Option<Self> {
        find_hwmon(crate::sys::SYSFS_ROOT).map(|hwmon| Self { hwmon })
    }

    pub fn maybe_find_thermal_zone() -> Option<BasicEntityPath> {
        find_thermal_zone(crate::sys::SYSFS_ROOT)
    }
}

impl super::super::Adapter for SteamDeckFan {
    fn on_enable_toggled(&self, settings: &Settings) {
        on_set_enable(settings, &self.hwmon)
    }

    fn control_fan(&self, settings: &Settings, sensor: &crate::adapters::traits::SensorReading) {
        enforce_jupiter_status(true);
        do_fan_control(settings, &self.hwmon, sensor.value)
    }

    fn sensor<'a: 'b, 'b>(&'a self) -> Option<&'b dyn crate::adapters::SensorAdapter> {
        Some(self)
    }
}

impl super::super::super::SensorAdapter for SteamDeckFan {
    fn read(&self) -> Result<crate::adapters::SensorReading, std::io::Error> {
        Ok(crate::adapters::SensorReading {
            value: read_fan(&self.hwmon)? as f64,
            meaning: crate::adapters::SensorType::Fan,
            name: "Steam Deck Fan",
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

fn on_set_enable(settings: &Settings, hwmon: &HwMonPath) {
    // stop/start jupiter fan control (since the client-side way of doing this was removed :( )
    enforce_jupiter_status(settings.enable);
    if let Err(e) = write_fan_recalc(hwmon, settings.enable) {
        log::error!("runtime failed to write to fan recalculate file: {}", e);
    }
}

fn enforce_jupiter_status(enabled: bool) {
    // enabled refers to whether this plugin's functionality is enabled,
    // not the jupiter fan control service
    let service_status = detect_jupiter_fan_service();
    log::debug!("fan control service is enabled? {}", service_status);
    if enabled == service_status {
        // do not run Valve's fan service along with Fantastic, since they fight
        if enabled {
            stop_fan_service();
        } else {
            start_fan_service();
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

fn write_fan_recalc(hwmon: &HwMonPath, enabled: bool) -> Result<(), std::io::Error> {
    hwmon.set(RECALCULATE_ATTR, enabled as u8)
    //write_single(format!("/sys/class/hwmon/hwmon{}/recalculate", HWMON_INDEX), enabled as u8)
}

fn write_fan_target(hwmon: &HwMonPath, rpm: u64) -> Result<(), std::io::Error> {
    hwmon.set(FAN1_TARGET_ATTR, rpm)
    //write_single(format!("/sys/class/hwmon/hwmon{}/fan1_target", HWMON_INDEX), rpm)
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

fn fan_range() -> std::ops::Range<f64> {
    let sys = sysinfo::System::new_with_specifics(
        sysinfo::RefreshKind::new().with_cpu(sysinfo::CpuRefreshKind::everything()),
    );
    if sys.cpus().is_empty() {
        1.0..7123.0
    } else {
        let cpu_name = sys.cpus()[0].brand();
        if cpu_name.contains("AMD Custom APU 0405") {
            // LCD
            1.0..7000.0
        } else if cpu_name.contains("AMD Custom APU 0932") {
            // OLED
            1.0..9000.0
        } else {
            // Hopefully never reached
            1.0..7001.0
        }
    }

}

fn do_fan_control(settings: &Settings, hwmon: &HwMonPath, thermal_zone: f64) {
    /*
        curve = self.settings["curve"]
        fan_ratio = 0 # unnecessary in Python, but stupid without
        if len(curve) == 0:
            fan_ratio = 1
        else:
            index = -1
            temperature_ratio = (thermal_zone(0) - TEMPERATURE_MINIMUM) / (TEMPERATURE_MAXIMUM - TEMPERATURE_MINIMUM)
            for i in range(len(curve)-1, -1, -1):
                if curve[i]["x"] < temperature_ratio:
                    index = i
                    break
            if self.settings["interpolate"]:
                fan_ratio = self.interpolate_fan(self, index, temperature_ratio)
            else:
                fan_ratio = self.step_fan(self, index, temperature_ratio)
        set_fan_target(int((fan_ratio * FAN_MAXIMUM) + FAN_MINIMUM))
    */
    let fan_bounds = fan_range();
    let temperature_ratio = ((thermal_zone as f64)/1000.0) / 100.0 /* temperature range in C */;
    let mut index = None;
    for i in (0..settings.curve.len()).rev() {
        if settings.curve[i].x < temperature_ratio {
            index = Some(i);
            break;
        }
    }
    let fan_ratio = if settings.interpolate {
        interpolate_fan(settings, index, temperature_ratio)
    } else {
        step_fan(settings, index, temperature_ratio)
    };
    let fan_speed: u64 = ((fan_ratio * (fan_bounds.end - fan_bounds.start)) + fan_bounds.start) as _;
    if let Err(e) = write_fan_target(hwmon, fan_speed) {
        log::error!("Failed to write to Steam Deck fan target file: {}", e);
    }
}

fn interpolate_fan(settings: &Settings, index: Option<usize>, t_ratio: f64) -> f64 {
    /*
        curve = self.settings["curve"]
        upper_point = {"x": 1.0, "y": 0.0}
        lower_point = {"x": 0.0, "y": 1.0}
        if index != -1: # guaranteed to not be empty
            lower_point = curve[index]
        if index != len(curve) - 1:
            upper_point = curve[index+1]
        #logging.debug(f"lower_point: {lower_point}, upper_point: {upper_point}")
        upper_y = 1-upper_point["y"]
        lower_y = 1-lower_point["y"]
        slope_m = (upper_y - lower_y) / (upper_point["x"] - lower_point["x"])
        y_intercept_b = lower_y - (slope_m * lower_point["x"])
        logging.debug(f"interpolation: y = {slope_m}x + {y_intercept_b}")
        return (slope_m * temperature_ratio) + y_intercept_b
    */
    let (upper, lower) = if let Some(i) = index {
        (if i != settings.curve.len() - 1 {
            settings.curve[i+1].clone()
        } else {
            GraphPoint{x: 1.0, y: 1.0}
        },
        settings.curve[i].clone())
    } else {
        (if settings.curve.is_empty() {
            GraphPoint{x: 1.0, y: 1.0}
        } else {
            settings.curve[0].clone()
        },
        GraphPoint{x: 0.0, y: 0.0})
    };
    let slope_m = (upper.y - lower.y) / (upper.x - lower.x);
    let y_intercept_b = lower.y - (slope_m * lower.x);
    log::debug!("interpolation: y = {}x + {} (between {:?} and {:?})", slope_m, y_intercept_b, upper, lower);
    (slope_m * t_ratio) + y_intercept_b
}

fn step_fan(settings: &Settings, index: Option<usize>, _t_ratio: f64) -> f64 {
    /*
        curve = self.settings["curve"]
        if index != -1:
            return 1 - curve[index]["y"]
        else:
            if len(curve) == 0:
                return 1
            else:
                return 0.5
    */
    // step fan, what are you doing?
    if let Some(index) = index {
        settings.curve[index].y
    } else {
        if settings.curve.is_empty() {
            1.0
        } else {
            0.5
        }
    }
}
