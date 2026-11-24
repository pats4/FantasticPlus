//! Fan control

use std::sync::Arc;
//use std::collections::HashMap;
use tokio::sync::RwLock;

use std::thread;
use std::time::{Duration, Instant};

use super::datastructs::{Settings, State};
use super::json::SettingsJson;

pub struct ControlRuntime {
    settings: Arc<RwLock<Settings>>,
    state: Arc<RwLock<State>>,
    fan_adapter: Arc<Box<dyn crate::adapters::FanAdapter + 'static>>,
    sensor_adapter: Arc<Box<dyn crate::adapters::SensorAdapter + 'static>>,
}

impl ControlRuntime {
    #[allow(dead_code)]
    pub fn new<F: crate::adapters::FanAdapter + 'static, S: crate::adapters::SensorAdapter + 'static>(fan: F, sensor: S) -> Self {
        Self::new_boxed(Box::new(fan), Box::new(sensor))
    }

    pub(crate) fn new_boxed(fan: Box<dyn crate::adapters::FanAdapter + 'static>, sensor: Box<dyn crate::adapters::SensorAdapter + 'static>) -> Self {
        let new_state = State::new();
        let settings_p = settings_path(&new_state.home);
        Self {
            settings: Arc::new(RwLock::new(super::json::SettingsJson::open(settings_p).unwrap_or_default().into())),
            state: Arc::new(RwLock::new(new_state)),
            fan_adapter: Arc::new(fan),
            sensor_adapter: Arc::new(sensor),
        }
    }

    pub(crate) fn settings_clone(&self) -> Arc<RwLock<Settings>> {
        self.settings.clone()
    }

    pub(crate) fn state_clone(&self) -> Arc<RwLock<State>> {
        self.state.clone()
    }

    pub(crate) fn settings(&self) -> &'_ RwLock<Settings> {
        &self.settings
    }

    pub(crate) fn state(&self) -> &'_ RwLock<State> {
        &self.state
    }

    pub(crate) fn sensor_clone(&self) -> Arc<Box<dyn crate::adapters::SensorAdapter>> {
        self.sensor_adapter.clone()
    }

    pub(crate) fn fan_clone(&self) -> Arc<Box<dyn crate::adapters::FanAdapter>> {
        self.fan_adapter.clone()
    }

    pub fn run(&self) -> thread::JoinHandle<()> {
        let runtime_settings = self.settings_clone();
        let runtime_state = self.state_clone();
        let runtime_fan = self.fan_adapter.clone();
        let runtime_sensor = self.sensor_adapter.clone();
        thread::spawn(move || {
            let sleep_duration = Duration::from_millis(1000);
            let mut start_time = Instant::now();
            loop {
                if Instant::now().duration_since(start_time).as_secs_f64() * 0.95 > sleep_duration.as_secs_f64() {
                    // resumed from sleep; do fan re-init
                    log::debug!("Detected resume from sleep, overriding fan again");
                    {
                        let settings = runtime_settings.blocking_read();
                        if settings.enable {
                            runtime_fan.on_enable_toggled(&settings);
                        }
                    }
                }
                start_time = Instant::now();
                { // save to file
                    let state = runtime_state.blocking_read();
                    if state.dirty {
                        // save settings to file
                        let settings = runtime_settings.blocking_read();
                        let settings_json: SettingsJson = settings.clone().into();
                        if let Err(e) = settings_json.save(settings_path(&state.home)) {
                            log::error!("SettingsJson.save({}) error: {}", settings_path(&state.home).display(), e);
                        }
                        runtime_fan.on_enable_toggled(&settings);
                        drop(state);
                        let mut state = runtime_state.blocking_write();
                        state.dirty = false;
                    }
                }
                { // fan control
                    let settings = runtime_settings.blocking_read();
                    if settings.enable {
                        match runtime_sensor.read() {
                            Err(e) => log::error!("Failed to read sensor for control_fan input: {}", e),
                            Ok(reading) => {
                                runtime_fan.control_fan(&settings, &reading);
                            }
                        }
                    }
                }
                thread::sleep(sleep_duration);
            }
        })
    }
}

fn settings_path<P: AsRef<std::path::Path>>(home: P) -> std::path::PathBuf {
    home.as_ref().join(".config/fantastic/fantastic.json")
}
