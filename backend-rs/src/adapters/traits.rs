pub trait FanAdapter: Send + Sync {
    /// Human-readable device name for the UI.
    fn name(&self) -> &'static str;
    /// Take the fan over (`true`) or hand it back to the system controller (`false`).
    fn set_control(&self, take_over: bool) -> std::io::Result<()>;
    /// Apply a per-tick target as a fraction of the fan's speed range (0..=1), already
    /// raised to the thermal safety floor. Only called while in control.
    fn apply(&self, ratio: f64) -> std::io::Result<()>;
    /// Speed range in RPM used to convert ratios.
    fn rpm_range(&self) -> std::ops::Range<f64> { 0.0..1.0 }
    /// Get fan speed sensor
    fn sensor<'a: 'b, 'b>(&'a self) -> Option<&'b dyn SensorAdapter> { None }
}

pub trait SensorAdapter: Send + Sync {
    /// Read sensor value
    fn read(&self) -> Result<SensorReading, std::io::Error>;
}

#[derive(Debug, Clone, Copy)]
pub struct SensorReading {
    /// Temperature in milli-degrees Celsius, or fan speed in RPM.
    pub value: f64,
}
