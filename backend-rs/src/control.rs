//! Fan control loop.
//!
//! Once a second the loop decides whether the plugin should be driving the fan and,
//! if so, with which target. Every target passes through the thermal safety floor
//! in [`crate::logic`]. Whenever the plugin cannot or should not control the fan,
//! the fan is handed back to SteamOS rather than left at its last speed.

use std::sync::Arc;
use std::thread;
use std::time::{Duration, Instant};

use tokio::sync::RwLock;

use super::adapters::{FanAdapter, FanCommand, SensorAdapter};
use super::datastructs::{GraphPoint, Mode, Settings, State};
use super::json::SettingsJson;
use super::logic::{self, ValveInputs, ValveProfile, ValveState};

/// Consecutive failed ticks (sensor read or fan write) before giving the fan back.
const MAX_FAILURES: u32 = 5;
/// A firmware curve (ROG Ally) is re-uploaded at least this often, in ticks.
const CURVE_REFRESH_TICKS: u32 = 60;
/// Port of the original Fantastic back-end; both plugins must not drive the fan.
const ORIGINAL_FANTASTIC_PORT: u16 = 44444;

/// What the control loop is doing right now, for the UI.
#[derive(Debug, Clone, Default)]
pub struct Status {
    pub controlling: bool,
    pub reason: String,
    pub mode: String,
    pub target_ratio: Option<f64>,
    pub floor_ratio: f64,
    pub temperature_c: Option<f64>,
    /// The last few minutes of temperatures and fan speeds, one per control tick.
    pub history: History,
}

/// Seconds of history kept in memory (one sample per tick).
pub const HISTORY_LEN: usize = 300;

/// Marks a missing fan reading in [`History`].
pub const NO_FAN: u8 = 255;

/// Fixed-size rings of temperatures (tenths of a °C, 0 = missing) and fan speeds
/// (percent of the fan's range, [`NO_FAN`] = missing). Memory only and
/// allocation-free (900 bytes): it is lost when the back-end restarts.
#[derive(Debug, Clone)]
pub struct History {
    temp: [u16; HISTORY_LEN],
    fan: [u8; HISTORY_LEN],
    head: usize,
    len: usize,
}

impl Default for History {
    fn default() -> Self {
        Self { temp: [0; HISTORY_LEN], fan: [NO_FAN; HISTORY_LEN], head: 0, len: 0 }
    }
}

impl History {
    pub fn push(&mut self, temp_c: Option<f64>, fan_percent: Option<f64>) {
        self.temp[self.head] = temp_c.map(|t| (t * 10.0).round().clamp(1.0, 2000.0) as u16).unwrap_or(0);
        self.fan[self.head] = fan_percent
            .filter(|p| p.is_finite())
            .map(|p| p.round().clamp(0.0, 100.0) as u8)
            .unwrap_or(NO_FAN);
        self.head = (self.head + 1) % HISTORY_LEN;
        self.len = (self.len + 1).min(HISTORY_LEN);
    }

    pub fn clear(&mut self) {
        self.head = 0;
        self.len = 0;
    }

    /// `(temperature, fan)` pairs, oldest first.
    pub fn iter(&self) -> impl Iterator<Item = (u16, u8)> + '_ {
        let start = (self.head + HISTORY_LEN - self.len) % HISTORY_LEN;
        (0..self.len).map(move |i| {
            let j = (start + i) % HISTORY_LEN;
            (self.temp[j], self.fan[j])
        })
    }
}

pub struct ControlRuntime {
    settings: Arc<RwLock<Settings>>,
    state: Arc<RwLock<State>>,
    status: Arc<RwLock<Status>>,
    fan_adapter: Arc<Box<dyn FanAdapter + 'static>>,
    sensor_adapter: Arc<Box<dyn SensorAdapter + 'static>>,
    profiles: Arc<Vec<ValveProfile>>,
}

/// One tick's decision.
enum Decision {
    /// Leave (or hand) the fan to SteamOS, with a reason for the UI.
    Idle(String),
    /// Drive the fan with a per-tick command.
    Command(FanCommand, f64),
    /// Upload a whole (already floored) curve to firmware.
    Curve(Vec<GraphPoint>),
}

impl ControlRuntime {
    #[allow(dead_code)]
    pub fn new<F: FanAdapter + 'static, S: SensorAdapter + 'static>(fan: F, sensor: S) -> Self {
        Self::new_boxed(Box::new(fan), Box::new(sensor))
    }

    pub(crate) fn new_boxed(fan: Box<dyn FanAdapter + 'static>, sensor: Box<dyn SensorAdapter + 'static>) -> Self {
        let new_state = State::new();
        let settings_p = settings_path(&new_state.home);
        let mut settings: Settings = SettingsJson::open_or_default(&settings_p).into();
        // A real reboot (not sleep) always starts on the SteamOS controller.
        let boot_id = current_boot_id();
        if boot_id.is_some() && settings.last_boot_id != boot_id {
            if settings.enable {
                log::info!("reboot detected; returning the fan to SteamOS");
            }
            settings.enable = false;
        }
        settings.last_boot_id = boot_id;
        let profiles = crate::system_profiles::load();
        // A SteamOS profile saved earlier that doesn't fit this board (e.g. the LCD
        // curve on an OLED) falls back to the point curve instead of idling.
        if let Some(name) = settings.system_profile.clone() {
            if !profiles.iter().any(|p| p.name == name) {
                log::warn!("saved SteamOS profile `{}` does not fit this device; using the curve", name);
                settings.system_profile = None;
            }
        }
        Self {
            settings: Arc::new(RwLock::new(settings)),
            state: Arc::new(RwLock::new(new_state)),
            status: Arc::new(RwLock::new(Status::default())),
            fan_adapter: Arc::new(fan),
            sensor_adapter: Arc::new(sensor),
            profiles: Arc::new(profiles),
        }
    }

    pub(crate) fn settings(&self) -> &'_ RwLock<Settings> {
        &self.settings
    }

    pub(crate) fn state(&self) -> &'_ RwLock<State> {
        &self.state
    }

    pub(crate) fn status(&self) -> &'_ RwLock<Status> {
        &self.status
    }

    pub(crate) fn profiles(&self) -> &'_ [ValveProfile] {
        &self.profiles
    }

    pub(crate) fn sensor_clone(&self) -> Arc<Box<dyn SensorAdapter>> {
        self.sensor_adapter.clone()
    }

    pub(crate) fn fan_clone(&self) -> Arc<Box<dyn FanAdapter>> {
        self.fan_adapter.clone()
    }

    pub fn run(&self) -> thread::JoinHandle<()> {
        let settings = self.settings.clone();
        let state = self.state.clone();
        let status = self.status.clone();
        let fan = self.fan_adapter.clone();
        let sensor = self.sensor_adapter.clone();
        let profiles = self.profiles.clone();
        thread::spawn(move || {
            let sleep_duration = Duration::from_millis(1000);
            let mut start_time = Instant::now();
            let mut controlling = false;
            let mut failures: u32 = 0;
            let mut valve = ValveState::default();
            let mut valve_profile: Option<String> = None;
            let mut uploaded: Option<Vec<GraphPoint>> = None;
            let mut ticks_since_upload: u32 = 0;
            loop {
                if start_time.elapsed().as_secs_f64() * 0.95 > sleep_duration.as_secs_f64() * 2.0 {
                    // resumed from sleep: the EC may have reset, so take the fan over again
                    log::debug!("Detected resume from sleep, overriding fan again");
                    controlling = false;
                    uploaded = None;
                    // the readings before sleep would join up with the ones after it
                    status.blocking_write().history.clear();
                }
                start_time = Instant::now();

                save_if_dirty(&settings, &state);
                let current = settings.blocking_read().clone();
                let tripped = state.blocking_read().tripped;
                let temperature = sensor.read().map(|r| r.value / 1000.0);
                let temp_c = temperature.as_ref().ok().copied().filter(|t| t.is_finite());

                let decision = if !current.enable {
                    Decision::Idle("SteamOS is controlling the fan".into())
                } else if tripped {
                    Decision::Idle("Stopped after repeated fan errors; SteamOS has the fan. Pick a mode again to retry.".into())
                } else if let Some(t) = temp_c {
                    decide(&current, t, fan.as_ref().as_ref(), &profiles, &mut valve, &mut valve_profile)
                } else {
                    failures += 1;
                    log::error!("temperature read failed ({}/{}): {:?}", failures, MAX_FAILURES, temperature.err());
                    Decision::Idle("Cannot read the temperature".into())
                };

                let mut reason = String::new();
                let mut target = None;
                match decision {
                    Decision::Idle(why) => {
                        // a missing temperature only hands back once it keeps failing
                        let transient = current.enable && !tripped && temp_c.is_none() && failures < MAX_FAILURES;
                        if controlling && !transient {
                            hand_back(fan.as_ref().as_ref());
                            controlling = false;
                            uploaded = None;
                        }
                        reason = why;
                    }
                    decision => {
                        if !controlling {
                            if original_fantastic_running() {
                                reason = "The original Fantastic plugin is running; disable or uninstall it first.".into();
                            } else {
                                match fan.set_control(true) {
                                    Ok(()) => {
                                        log::info!("took over the fan");
                                        controlling = true;
                                    }
                                    Err(e) => {
                                        failures += 1;
                                        log::error!("could not take over the fan ({}/{}): {}", failures, MAX_FAILURES, e);
                                        hand_back(fan.as_ref().as_ref());
                                        reason = format!("Could not take over the fan: {}", e);
                                    }
                                }
                            }
                        }
                        if controlling {
                            let result = match decision {
                                Decision::Command(command, ratio) => {
                                    target = Some(ratio);
                                    fan.apply(command)
                                }
                                Decision::Curve(points) => {
                                    target = temp_c.and_then(|t| logic::eval_curve(&points, true, t / 100.0));
                                    ticks_since_upload += 1;
                                    if uploaded.as_ref() != Some(&points) || ticks_since_upload >= CURVE_REFRESH_TICKS {
                                        ticks_since_upload = 0;
                                        let r = fan.apply_curve(&points);
                                        if r.is_ok() {
                                            uploaded = Some(points);
                                        }
                                        r
                                    } else {
                                        Ok(())
                                    }
                                }
                                Decision::Idle(_) => unreachable!(),
                            };
                            match result {
                                Ok(()) => failures = 0,
                                Err(e) => {
                                    failures += 1;
                                    log::error!("fan write failed ({}/{}): {}", failures, MAX_FAILURES, e);
                                }
                            }
                        }
                    }
                }

                if failures >= MAX_FAILURES {
                    log::error!("{} consecutive failures; handing the fan back to SteamOS", failures);
                    state.blocking_write().tripped = true;
                    if controlling {
                        hand_back(fan.as_ref().as_ref());
                        controlling = false;
                        uploaded = None;
                    }
                    failures = 0;
                    reason = "Stopped after repeated fan errors; SteamOS has the fan. Pick a mode again to retry.".into();
                }

                {
                    let mut s = status.blocking_write();
                    s.controlling = controlling;
                    s.reason = reason;
                    s.mode = match current.mode() {
                        Mode::Fixed(r) => format!("fixed {:.0}%", r * 100.0),
                        Mode::System(name) => format!("system {}", name),
                        Mode::Curve => "curve".into(),
                    };
                    s.target_ratio = target;
                    s.temperature_c = temp_c;
                    s.history.push(temp_c, fan_percent(fan.as_ref().as_ref()));
                    s.floor_ratio = temp_c.map(logic::floor_at).unwrap_or(0.0);
                }
                thread::sleep(sleep_duration);
            }
        })
    }
}

/// The fan's measured speed as a percentage of its range: one sysfs read per tick.
fn fan_percent(fan: &dyn FanAdapter) -> Option<f64> {
    let range = fan.rpm_range();
    if range.end <= range.start {
        return None;
    }
    let rpm = fan.sensor()?.read().ok()?.value;
    Some((rpm - range.start).max(0.0) / (range.end - range.start) * 100.0)
}

/// Work out this tick's target for an enabled plugin.
fn decide(
    settings: &Settings,
    temp_c: f64,
    fan: &dyn FanAdapter,
    profiles: &[ValveProfile],
    valve: &mut ValveState,
    valve_profile: &mut Option<String>,
) -> Decision {
    let firmware = fan.uses_firmware_curve();
    match settings.mode() {
        Mode::Fixed(ratio) => {
            if firmware {
                Decision::Curve(logic::effective_points(&[
                    GraphPoint { x: 0.0, y: ratio },
                    GraphPoint { x: 1.0, y: ratio },
                ]))
            } else {
                let r = logic::apply_floor(ratio, temp_c);
                Decision::Command(FanCommand::Ratio(r), r)
            }
        }
        Mode::System(name) => {
            if !fan.supports_system_profiles() {
                return Decision::Idle(format!("SteamOS profiles are not available on {}", fan.name()));
            }
            let Some(profile) = profiles.iter().find(|p| p.name == name) else {
                return Decision::Idle(format!("Unknown SteamOS profile `{}`", name));
            };
            if valve_profile.as_deref() != Some(name.as_str()) {
                *valve = ValveState::default();
                *valve_profile = Some(name.clone());
            }
            let extra = fan.extra_inputs();
            let inputs = ValveInputs {
                cpu_temp_c: temp_c,
                gpu_temp_c: extra.gpu_temp_c,
                apu_power_w: extra.apu_power_w.unwrap_or(0.0),
            };
            let now = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .map(|d| d.as_secs_f64())
                .unwrap_or(0.0);
            let rpm = valve.step(profile, profile.demand(&inputs), extra.charging, now);
            let max_rpm = fan.rpm_range().end;
            // the hotter of the CPU and GPU decides the floor
            let hottest = inputs.gpu_temp_c.map(|g| g.max(temp_c)).unwrap_or(temp_c);
            let rpm = rpm.max(logic::floor_at(hottest) * max_rpm);
            Decision::Command(FanCommand::Rpm(rpm), (rpm / max_rpm).clamp(0.0, 1.0))
        }
        Mode::Curve => {
            if settings.curve.len() < 2 {
                return Decision::Idle("The curve needs at least 2 points; SteamOS keeps the fan".into());
            }
            if firmware {
                Decision::Curve(logic::effective_points(&settings.curve))
            } else {
                match logic::curve_target(&settings.curve, settings.interpolate, temp_c) {
                    Some(r) => Decision::Command(FanCommand::Ratio(r), r),
                    None => Decision::Idle("The curve could not be evaluated; SteamOS keeps the fan".into()),
                }
            }
        }
    }
}

/// Give the fan back to SteamOS, logging (not propagating) failures.
pub fn hand_back(fan: &dyn FanAdapter) {
    match fan.set_control(false) {
        Ok(()) => log::info!("returned fan control to SteamOS"),
        Err(e) => log::error!("failed to restore SteamOS fan control: {}", e),
    }
}

fn save_if_dirty(settings: &RwLock<Settings>, state: &RwLock<State>) {
    let st = state.blocking_read();
    if !st.dirty {
        return;
    }
    let settings_json: SettingsJson = settings.blocking_read().clone().into();
    let path = settings_path(&st.home);
    if let Err(e) = settings_json.save(&path) {
        log::error!("SettingsJson.save({}) error: {}", path.display(), e);
    }
    drop(st);
    state.blocking_write().dirty = false;
}

fn original_fantastic_running() -> bool {
    let addr = std::net::SocketAddr::from(([127, 0, 0, 1], ORIGINAL_FANTASTIC_PORT));
    std::net::TcpStream::connect_timeout(&addr, Duration::from_millis(200)).is_ok()
}

fn current_boot_id() -> Option<String> {
    std::fs::read_to_string("/proc/sys/kernel/random/boot_id")
        .ok()
        .map(|s| s.trim().to_owned())
        .filter(|s| !s.is_empty())
}

fn settings_path<P: AsRef<std::path::Path>>(home: P) -> std::path::PathBuf {
    home.as_ref().join(".config/fantasticplus/fantastic.json")
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::adapters::ExtraInputs;

    #[test]
    fn history_ring_keeps_the_newest_in_order() {
        let mut h = History::default();
        assert_eq!(h.iter().count(), 0);
        h.push(Some(40.04), Some(42.4));
        h.push(None, None);
        h.push(Some(f64::INFINITY), Some(150.0));
        assert_eq!(h.iter().collect::<Vec<_>>(), vec![(400, 42), (0, NO_FAN), (2000, 100)]);
        for i in 0..(HISTORY_LEN + 5) {
            h.push(Some(i as f64 / 10.0 + 1.0), Some(50.0));
        }
        let v: Vec<u16> = h.iter().map(|(t, _)| t).collect();
        assert_eq!(v.len(), HISTORY_LEN);
        assert_eq!(v[0], 15); // the three early readings and the first five of the run were overwritten
        assert_eq!(*v.last().unwrap(), (HISTORY_LEN + 4) as u16 + 10);
        h.clear();
        assert_eq!(h.iter().count(), 0);
    }

    struct MockFan {
        firmware: bool,
        deck: bool,
    }

    impl FanAdapter for MockFan {
        fn name(&self) -> &'static str { "mock" }
        fn set_control(&self, _take_over: bool) -> std::io::Result<()> { Ok(()) }
        fn apply(&self, _command: FanCommand) -> std::io::Result<()> { Ok(()) }
        fn uses_firmware_curve(&self) -> bool { self.firmware }
        fn supports_system_profiles(&self) -> bool { self.deck }
        fn rpm_range(&self) -> std::ops::Range<f64> { 1.0..7000.0 }
        fn extra_inputs(&self) -> ExtraInputs { ExtraInputs::default() }
    }

    fn settings(curve: &[(f64, f64)]) -> Settings {
        Settings {
            version: 2,
            enable: true,
            interpolate: true,
            curve: curve.iter().map(|(x, y)| GraphPoint { x: *x, y: *y }).collect(),
            fixed_speed: None,
            system_profile: None,
            last_boot_id: None,
        }
    }

    fn run(s: &Settings, temp: f64, fan: &MockFan) -> Decision {
        let profiles = vec![ValveProfile::jupiter_builtin(), ValveProfile::galileo_builtin()];
        decide(s, temp, fan, &profiles, &mut ValveState::default(), &mut None)
    }

    const DECK: MockFan = MockFan { firmware: false, deck: true };
    const ALLY: MockFan = MockFan { firmware: true, deck: false };

    #[test]
    fn short_curve_hands_back() {
        assert!(matches!(run(&settings(&[]), 50.0, &DECK), Decision::Idle(_)));
        assert!(matches!(run(&settings(&[(0.5, 0.0)]), 50.0, &DECK), Decision::Idle(_)));
    }

    #[test]
    fn fixed_speed_is_floored() {
        let mut s = settings(&[]);
        s.fixed_speed = Some(0.5);
        match run(&s, 92.5, &DECK) {
            Decision::Command(FanCommand::Ratio(r), _) => assert!((r - 0.8).abs() < 1e-9),
            _ => panic!("expected a ratio"),
        }
    }

    #[test]
    fn zero_curve_is_floored_when_hot() {
        match run(&settings(&[(0.3, 0.0), (1.0, 0.0)]), 96.0, &DECK) {
            Decision::Command(FanCommand::Ratio(r), _) => assert_eq!(r, 1.0),
            _ => panic!("expected a ratio"),
        }
    }

    #[test]
    fn system_profile_rpm_respects_floor_and_valve() {
        let mut s = settings(&[]);
        s.system_profile = Some("jupiter".into());
        match run(&s, 80.0, &DECK) {
            Decision::Command(FanCommand::Rpm(rpm), _) => assert!((rpm - 4999.0).abs() < 2.0),
            _ => panic!("expected rpm"),
        }
        s.system_profile = Some("nope".into());
        assert!(matches!(run(&s, 80.0, &DECK), Decision::Idle(_)));
    }

    #[test]
    fn ally_gets_floored_firmware_curve_and_no_system_profiles() {
        match run(&settings(&[(0.3, 0.0), (1.0, 0.0)]), 50.0, &ALLY) {
            Decision::Curve(points) => {
                let at95 = logic::eval_curve(&points, true, 0.95).unwrap();
                assert!(at95 >= 1.0 - 1e-9);
            }
            _ => panic!("expected a curve"),
        }
        let mut s = settings(&[]);
        s.system_profile = Some("jupiter".into());
        assert!(matches!(run(&s, 50.0, &ALLY), Decision::Idle(_)));
    }
}
