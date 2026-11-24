use crate::datastructs::GraphPoint;

/// A command for one control tick, already raised to the thermal safety floor.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum FanCommand {
    /// Fraction of the fan's speed range (0..=1).
    Ratio(f64),
    /// Absolute target in RPM (used by the SteamOS profiles).
    Rpm(f64),
}

/// Extra readings used by the SteamOS profiles.
#[derive(Debug, Clone, Copy, Default)]
pub struct ExtraInputs {
    /// GPU temperature in °C.
    pub gpu_temp_c: Option<f64>,
    /// Averaged APU power in watts.
    pub apu_power_w: Option<f64>,
    /// True while the battery is charging.
    pub charging: bool,
}

pub trait FanAdapter: Send + Sync {
    /// Human-readable device name for the UI.
    fn name(&self) -> &'static str;
    /// Take the fan over (`true`) or hand it back to the system controller (`false`).
    fn set_control(&self, take_over: bool) -> std::io::Result<()>;
    /// Apply a per-tick target. Only called while in control.
    fn apply(&self, command: FanCommand) -> std::io::Result<()>;
    /// Fans driven by a firmware curve (ROG Ally) take the whole effective curve
    /// instead of per-tick targets.
    fn uses_firmware_curve(&self) -> bool { false }
    /// Upload an effective (already floored) curve; only used when
    /// `uses_firmware_curve` is true.
    fn apply_curve(&self, _points: &[GraphPoint]) -> std::io::Result<()> {
        Err(std::io::Error::other("this fan does not take a firmware curve"))
    }
    /// Whether the SteamOS (Valve) profiles make sense for this device.
    fn supports_system_profiles(&self) -> bool { false }
    /// Speed range in RPM used to convert ratios.
    fn rpm_range(&self) -> std::ops::Range<f64> { 0.0..1.0 }
    /// Readings for the SteamOS profiles.
    fn extra_inputs(&self) -> ExtraInputs { ExtraInputs::default() }
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
    #[allow(dead_code)]
    pub meaning: SensorType,
    #[allow(dead_code)]
    pub name: &'static str,
}

#[derive(Debug, Clone, Copy)]
pub enum SensorType {
    Temperature, // milli-degrees Celcius
    Fan, // revolutions per minute (RPM)
    #[allow(dead_code)]
    Unknown,
}
