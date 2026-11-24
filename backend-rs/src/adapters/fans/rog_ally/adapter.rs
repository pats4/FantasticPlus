use sysfuss::{BasicEntityPath, HwMonAttribute, HwMonAttributeItem, HwMonAttributeType, HwMonPath, SysAttributeExt};
use sysfuss::{SysPath, SysEntityAttributesExt};

use crate::datastructs::GraphPoint;

const ASUS_CUSTOM_FAN_CURVE_HWMON_NAME: &str = "asus_custom_fan_curve";
const ASUS_REGULAR_HWMON_NAME: &str = "asus";

pub struct RogAllyFan {
    hwmon_curve: HwMonPath,
    hwmon_asus: HwMonPath,
}

impl RogAllyFan {
    pub fn maybe_find() -> Option<Self> {
        let syspath = SysPath::path(crate::sys::SYSFS_ROOT);
        match syspath.hwmon_by_name(ASUS_CUSTOM_FAN_CURVE_HWMON_NAME)
        {
            Err(e) => {
                log::error!("sysfs hwmon iter error while finding Asus ROG Ally fan curve: {}", e);
                None
            },
            Ok(hwmon_curve) => {
                match syspath.hwmon_by_name(ASUS_REGULAR_HWMON_NAME) {
                    Err(e) => {
                        log::error!("sysfs hwmon iter error while finding Asus fan: {}", e);
                        None
                    },
                    Ok(hwmon_asus) => {
                        Some(Self {
                            hwmon_curve,
                            hwmon_asus,
                        })
                    }
                }
            }
        }
    }

    // returns true when the point probably doesn't exist at all
    // (instead of it just running out of pwm# entries)
    fn set_gp(gp_i: u64, gp: &GraphPoint, basic_curve: &BasicEntityPath) -> bool {
        for pwm_i in 1..u64::MAX {
            let temp_attr = pwm_point_temp(pwm_i, gp_i);
            let pwm_attr = pwm_point_pwm(pwm_i, gp_i);
            if !(temp_attr.exists(basic_curve) && pwm_attr.exists(basic_curve)) {
                return pwm_i == 1;
            }
            let pwm_val = (gp.y * 255.0).round() as u8;
            if let Err(e) = basic_curve.set(&pwm_attr as &str, pwm_val) {
                let attr_path = pwm_attr.path(basic_curve);
                log::error!("failed to write to {}: {}", attr_path.display(), e);
            }
            let temp_val = (gp.x * 100.0).round() as u8;
            if let Err(e) = basic_curve.set(&temp_attr as &str, temp_val) {
                let attr_path = temp_attr.path(basic_curve);
                log::error!("failed to write to {}: {}", attr_path.display(), e);
            }
        }
        return false;
    }
}

impl super::super::Adapter for RogAllyFan {
    fn name(&self) -> &'static str { "ASUS ROG Ally" }

    fn set_control(&self, take_over: bool) -> std::io::Result<()> {
        let value_to_set = take_over as u8;
        let mut result = Ok(());
        for i in 1..u64::MAX {
            let attr = pwm_enable_attr_name(i);
            if self.hwmon_curve.exists(&attr) {
                if let Err(e) = self.hwmon_curve.set(attr, value_to_set) {
                    log::error!("failed to write to {}: {}", self.hwmon_curve.path_to(attr).display(), e);
                    result = Err(e);
                }
            } else {
                break;
            }
        }
        result
    }

    fn apply(&self, _command: crate::adapters::FanCommand) -> std::io::Result<()> {
        Err(std::io::Error::other("the ROG Ally takes a firmware curve"))
    }

    fn uses_firmware_curve(&self) -> bool { true }

    fn apply_curve(&self, points: &[GraphPoint]) -> std::io::Result<()> {
        let basic_curve = BasicEntityPath::new(self.hwmon_curve.as_ref());
        if points.is_empty() {
            return Err(std::io::Error::other("refusing to upload an empty fan curve"));
        }
        // The firmware has a fixed number of points per pwm channel; when the curve
        // is longer, keep the hottest points, which matter most for safety.
        let capacity = (1..64u64)
            .take_while(|i| pwm_point_temp(1, *i).exists(&basic_curve))
            .count()
            .max(1);
        let start = points.len().saturating_sub(capacity);
        for (i, gp) in points[start..].iter().enumerate() {
            Self::set_gp(i as u64 + 1, gp, &basic_curve);
        }
        // remaining firmware points ramp to full speed at 100 °C (points are 1-based
        // in asus-wmi; upstream started at 0 and never wrote the first one)
        for i in (points.len() - start + 1)..usize::MAX {
            if Self::set_gp(i as _, &GraphPoint { x: 1.0, y: 1.0 }, &basic_curve) {
                break;
            }
        }
        Ok(())
    }

    fn rpm_range(&self) -> std::ops::Range<f64> { 0.0..6000.0 }

    fn sensor<'a: 'b, 'b>(&'a self) -> Option<&'b dyn crate::adapters::SensorAdapter> {
        Some(self)
    }
}

impl super::super::super::SensorAdapter for RogAllyFan {
    fn read(&self) -> Result<crate::adapters::SensorReading, std::io::Error> {
        let mut readings = Vec::new();
        let mut last_error = None;
        for i in 1..u64::MAX {
            let attr = fan_reading_attr_name(i);
            let reading = match self.hwmon_asus.attribute::<u64>(attr) {
                Ok(reading) => reading,
                Err(sysfuss::EitherErr2::First(e1)) => {
                    log::debug!("failed to read attribute {}: {} (ok; breaking loop...)", self.hwmon_asus.path_to(attr).display(), e1);
                    last_error = Some(e1);
                    break;
                },
                Err(sysfuss::EitherErr2::Second(e2)) => {
                    log::debug!("failed to read attribute {}: {} (ok; breaking loop...)", self.hwmon_asus.path_to(attr).display(), e2);
                    last_error = Some(std::io::Error::other(e2));
                    break;
                },
            };
            readings.push(reading);
        }
        let mut reading_sum = 0;
        for reading in readings.iter() {
            reading_sum += *reading;
        }
        if readings.is_empty() {
            Err(last_error.unwrap())
        } else {
            Ok(crate::adapters::SensorReading {
                value: (reading_sum / (readings.len() as u64)) as f64,
                meaning: crate::adapters::SensorType::Fan,
                name: "ROG Ally Fan",
            })
        }

    }
}

fn pwm_enable_attr_name(index: u64) -> HwMonAttribute {
    HwMonAttribute::new(HwMonAttributeType::Pwm, index, HwMonAttributeItem::Enable)
}

fn fan_reading_attr_name(index: u64) -> HwMonAttribute {
    HwMonAttribute::new(HwMonAttributeType::Fan, index, HwMonAttributeItem::Input)
}

fn pwm_point_temp(index: u64, point_index: u64) -> String {
    format!("pwm{}_auto_point{}_temp", index, point_index)
}

fn pwm_point_pwm(index: u64, point_index: u64) -> String {
    format!("pwm{}_auto_point{}_pwm", index, point_index)
}
