use crate::datastructs::Settings;

pub trait FanAdapter: Send + Sync {
    /// Handle fan enable UI toggle
    fn on_enable_toggled(&self, settings: &Settings);
    /// Apply fan settings to fan (probably through udev/sysfs)
    fn control_fan(&self, settings: &Settings, sensor: &SensorReading);
    /// Get fan speed sensor
    fn sensor<'a: 'b, 'b>(&'a self) -> Option<&'b dyn SensorAdapter> { None }
}

pub trait SensorAdapter: Send + Sync {
    /// Read sensor value
    fn read(&self) -> Result<SensorReading, std::io::Error>;
}

#[derive(Debug, Clone, Copy)]
pub struct SensorReading {
    pub value: f64,
    pub meaning: SensorType,
    pub name: &'static str,
}

#[derive(Debug, Clone, Copy)]
pub enum SensorType {
    Temperature, // milli-degrees Celcius
    Fan, // revolutions per minute (RPM)
    #[allow(dead_code)]
    Unknown,
}
