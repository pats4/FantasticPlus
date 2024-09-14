use sysfuss::BasicEntityPath;
use sysfuss::SysEntityAttributesExt;

pub struct ThermalZoneSensor {
    zone: BasicEntityPath,
}

impl ThermalZoneSensor {
    pub fn new<P: AsRef<std::path::Path>>(zone_path: P) -> Self {
        Self { zone: BasicEntityPath::new(zone_path) }
    }

    pub fn new_if_exists<P: AsRef<std::path::Path>>(zone_path: P) -> Option<Self> {
        if zone_path.as_ref().exists() {
            Some(Self { zone: BasicEntityPath::new(zone_path) })
        } else {
            None
        }
    }
}

impl super::Adapter for ThermalZoneSensor {
    fn read(&self) -> Result<super::Reading, std::io::Error> {
        Ok(super::Reading {
            value: read_thermal_zone(&self.zone)? as f64,
            meaning: super::super::SensorType::Temperature,
            name: "thermal_zone",
        })
    }
}

fn read_thermal_zone(entity: &BasicEntityPath) -> std::io::Result<u64> {
    match entity.attribute("temp".to_owned()) {
        Ok(x) => Ok(x),
        Err(sysfuss::EitherErr2::First(e)) => {
            log::error!("Failed read_thermal_zone(): {}", e);
            Err(e)
        },
        Err(sysfuss::EitherErr2::Second(e)) => {
            log::error!("Failed read_thermal_zone(): {}", e);
            Err(std::io::Error::other(e))
        },
    }
}
