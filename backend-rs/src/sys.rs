use sysfuss::{SysPath, capability::attributes, SysEntityAttributesExt};
use sysfuss::{BasicEntityPath, HwMonPath, HwMonAttribute, HwMonAttributeType, HwMonAttributeItem};

const HWMON_INDEX: u64 = 5;

pub const RECALCULATE_ATTR: HwMonAttribute = HwMonAttribute::custom("recalculate");
pub const FAN1_INPUT_ATTR: HwMonAttribute = HwMonAttribute::new(HwMonAttributeType::Fan, 1, HwMonAttributeItem::Input);
pub const FAN1_LABEL_ATTR: HwMonAttribute = HwMonAttribute::new(HwMonAttributeType::Fan, 1, HwMonAttributeItem::Label);
pub const FAN1_TARGET_ATTR: HwMonAttribute = HwMonAttribute::custom("fan1_target");

const HWMON_NEEDS: [HwMonAttribute; 3] = [
    //RECALCULATE_ATTR,
    FAN1_INPUT_ATTR,
    FAN1_TARGET_ATTR,
    FAN1_LABEL_ATTR,
];

pub fn read_fan(hwmon: &HwMonPath) -> Option<u64> {
    match hwmon.attribute(FAN1_INPUT_ATTR){
        Ok(x) => Some(x),
        Err(e) => {
            log::error!("Failed read_fan(): {}", e);
            None
        },
    }
}

pub fn read_thermal_zone(entity: &BasicEntityPath) -> Option<u64> {
    match entity.attribute("temp".to_owned()) {
        Ok(x) => Some(x),
        Err(e) => {
            log::error!("Failed read_thermal_zone(): {}", e);
            None
        },
    }
}

pub fn write_fan_recalc(hwmon: &HwMonPath, enabled: bool) -> Result<(), std::io::Error> {
    hwmon.set(RECALCULATE_ATTR, enabled as u8)
    //write_single(format!("/sys/class/hwmon/hwmon{}/recalculate", HWMON_INDEX), enabled as u8)
}

pub fn write_fan_target(hwmon: &HwMonPath, rpm: u64) -> Result<(), std::io::Error> {
    hwmon.set(FAN1_TARGET_ATTR, rpm)
    //write_single(format!("/sys/class/hwmon/hwmon{}/fan1_target", HWMON_INDEX), rpm)
}

pub fn find_hwmon<P: AsRef<std::path::Path>>(path: P) -> HwMonPath {
    let syspath = SysPath::path(path);
    match syspath.hwmon(attributes(HWMON_NEEDS.into_iter()))
    {
        Err(e) => {
            log::error!("sysfs hwmon iter error: {}", e);
            syspath.hwmon_by_index(HWMON_INDEX)
        },
        Ok(mut iter) => {
            let entity = iter.next()
                .unwrap_or_else(|| {
                    log::error!("sysfs hwmon iter empty: [no capable results]");
                    syspath.hwmon_by_index(HWMON_INDEX)
                });
            log::info!("Found fan hwmon {}", entity.as_ref().display());
            entity
        }
    }
}

pub fn find_thermal_zone<P: AsRef<std::path::Path>>(path: P) -> BasicEntityPath {
    let syspath = SysPath::path(path);
    match syspath.class("thermal",
        |ent: &BasicEntityPath| ent.exists(&"temp".to_owned()) && ent.exists(&"type".to_owned()) && ent.attribute("type".to_owned()).map(|val: String| val.to_lowercase() != "processor").unwrap_or(false))
    {
        Err(e) => {
            log::error!("sysfs thermal class iter error: {}", e);
            BasicEntityPath::new("/sys/class/thermal/thermal_zone0")
        },
        Ok(mut iter) => {
            let entity = iter.next()
                .unwrap_or_else(|| {
                    log::error!("sysfs thermal class iter empty: [no capable results]");
                    BasicEntityPath::new("/sys/class/thermal/thermal_zone0")
                });
            log::info!("Found thermal zone {}", entity.as_ref().display());
            entity
        }
    }
}
