use crate::services::fantastic::*;

use usdpl_back::nrpc::_helpers::futures::{StreamExt, FutureExt};

use super::control::ControlRuntime;

pub const VERSION: &'static str = env!("CARGO_PKG_VERSION");
pub const NAME: &'static str = env!("CARGO_PKG_NAME");

const FAN_READ_PERIOD: std::time::Duration = std::time::Duration::from_millis(1000);
const TEMPERATURE_READ_PERIOD: std::time::Duration = std::time::Duration::from_millis(2000);

pub struct FanService {
    ctrl: ControlRuntime,
}

impl FanService {
    pub fn new(runtime: ControlRuntime) -> Self {
        runtime.run();
        Self {
            ctrl: runtime,
        }
    }
}

fn once_true() -> impl std::iter::Iterator<Item = bool> {
    // iters over [true, false, false, ...]
    std::iter::once(true).chain(std::iter::repeat(false))
}

#[::nrpc::_helpers::async_trait::async_trait]
impl<'a> IFan<'a> for FanService {
    async fn echo(
            &mut self,
            input: EchoMessage,
        ) -> Result<EchoMessage, Box<dyn std::error::Error + Send>> {
            Ok(input)
        }
        async fn hello(
            &mut self,
            input: NameMessage,
        ) -> Result<HelloResponse, Box<dyn std::error::Error + Send>> {
            Ok(HelloResponse {
                phrase: format!("Hello {}", input.name)
            })
        }
        async fn version(
            &mut self,
            _input: Empty,
        ) -> Result<VersionMessage, Box<dyn std::error::Error + Send>> {
            Ok(
                VersionMessage {
                    major: 0,
                    minor: 0,
                    patch: 0,
                    //display: VERSION.to_string(),
                }
            )
        }
        async fn version_str(
            &mut self,
            _input: Empty,
        ) -> Result<VersionDisplayMessage, Box<dyn std::error::Error + Send>> {
            Ok(
                VersionDisplayMessage {
                    display: VERSION.to_owned(),
                }
            )
        }
        async fn name(
            &mut self,
            _input: Empty,
        ) -> Result<NameMessage, Box<dyn std::error::Error + Send>> {
            Ok(
                NameMessage {
                    name: NAME.to_string(),
                }
            )
        }
        async fn get_fan_rpm<'b: 'a>(
            &mut self,
            _input: Empty,
        ) -> Result<
            usdpl_back::nrpc::ServiceServerStream<'b, RpmMessage>,
            Box<dyn std::error::Error + Send>,
        > {
            let fan_clone = self.ctrl.fan_clone();
            if fan_clone.sensor().is_some() {
                let stream = usdpl_back::nrpc::_helpers::futures::stream::iter(once_true()).then(move |is_first| {
                    let fan_clone2 = fan_clone.clone();
                    tokio::task::spawn_blocking(
                        /* tokio::time::sleep(..) is not Unpin (but this is)... *grumble grumble* */
                        move || if !is_first { std::thread::sleep(FAN_READ_PERIOD); })
                    .map(move |_| {
                            if let Some(fan_sensor) = fan_clone2.sensor() {
                                match fan_sensor.read() {
                                    Ok(reading) => {
                                        log::debug!("get_fan_rpm() success: {}", reading.value);
                                        Ok(RpmMessage { rpm: reading.value as u32 })
                                    }
                                    Err(e) => {
                                        Err(usdpl_back::nrpc::ServiceError::Method(Box::<dyn std::error::Error + Send + Sync>::from(format!("Failed to read fan speed: {}", e))))
                                    }
                                }
                            } else {
                                Err(usdpl_back::nrpc::ServiceError::Method(Box::<dyn std::error::Error + Send + Sync>::from("Failed to get fan speed sensor")))
                            }
                        })
                });
                Ok(Box::new(stream))
            } else {
                Ok(Box::new(usdpl_back::nrpc::_helpers::futures::stream::empty()))
            }
        }

        async fn get_temperature<'b: 'a>(
            &mut self,
            _input: Empty,
        ) -> Result<
            usdpl_back::nrpc::ServiceServerStream<'b, TemperatureMessage>,
            Box<dyn std::error::Error + Send>,
        > {
            let sensor_clone = self.ctrl.sensor_clone();
            let stream = usdpl_back::nrpc::_helpers::futures::stream::iter(once_true()).then(move |is_first| {
                let sensor_clone2 = sensor_clone.clone();
                tokio::task::spawn_blocking(
                    /* tokio::time::sleep(..) is not Unpin (but this is)... *grumble grumble* */
                    move || if !is_first { std::thread::sleep(TEMPERATURE_READ_PERIOD); })
                .map(move |_| {
                        match sensor_clone2.read() {
                            Ok(reading) => {
                                let real_temp = reading.value as f64 / 1000.0;
                                log::debug!("get_temperature() success: {}", real_temp);
                                Ok(TemperatureMessage { temperature: real_temp })
                            },
                            Err(e) => {
                                Err(usdpl_back::nrpc::ServiceError::Method(Box::<dyn std::error::Error + Send + Sync>::from(format!("get_temperature failed to read sensor: {}", e))))
                            }
                        }
                    })
            });
            Ok(Box::new(stream))
        }

        async fn set_enable(
            &mut self,
            input: EnablementMessage,
        ) -> Result<EnablementMessage, Box<dyn std::error::Error + Send>>{
            let mut settings = self.ctrl.settings().write().await;
            let mut state = self.ctrl.state().write().await;
            // any explicit choice re-arms the watchdog
            state.tripped = false;
            if settings.enable != input.is_enabled {
                settings.enable = input.is_enabled;
                state.dirty = true;
            }
            log::debug!("set_enable({}) success", input.is_enabled);
            Ok(input)
        }
        async fn get_enable(
            &mut self,
            _input: Empty,
        ) -> Result<EnablementMessage, Box<dyn std::error::Error + Send>>{
            let is_enabled = self.ctrl.settings().read().await.enable;
            log::debug!("get_enable() success");
            Ok(EnablementMessage { is_enabled })
        }
        async fn set_interpolate(
            &mut self,
            input: EnablementMessage,
        ) -> Result<EnablementMessage, Box<dyn std::error::Error + Send>>{
            let mut settings = self.ctrl.settings().write().await;
            if settings.interpolate != input.is_enabled {
                let mut state = self.ctrl.state().write().await;
                settings.interpolate = input.is_enabled;
                state.dirty = true;
            }
            log::debug!("set_interpolate({}) success", input.is_enabled);
            Ok(input)
        }
        async fn get_interpolate(
            &mut self,
            _input: Empty,
        ) -> Result<EnablementMessage, Box<dyn std::error::Error + Send>>{
            let is_enabled = self.ctrl.settings().read().await.interpolate;
            log::debug!("get_interpolate() success");
            Ok(EnablementMessage { is_enabled })
        }
        async fn get_curve_x(
            &mut self,
            _input: Empty,
        ) -> Result<CurveMessageX, Box<dyn std::error::Error + Send>>{
            let settings = self.ctrl.settings().read().await;
            let x = settings.curve.iter().map(|p| p.x).collect();
            log::debug!("get_curve_x() success");
            Ok(CurveMessageX { x })
        }
        async fn get_curve_y(
            &mut self,
            _input: Empty,
        ) -> Result<CurveMessageY, Box<dyn std::error::Error + Send>>{
            let settings = self.ctrl.settings().read().await;
            let y = settings.curve.iter().map(|p| p.y).collect();
            log::debug!("get_curve_x() success");
            Ok(CurveMessageY { y })
        }
        async fn add_curve_point(
            &mut self,
            point: GraphPoint,
        ) -> Result<Empty, Box<dyn std::error::Error + Send>>{
            let mut settings = self.ctrl.settings().write().await;
            settings.curve.push(super::datastructs::GraphPoint {
                x: point.x,
                y: point.y
            });
            settings.sort_curve();
            let mut state = self.ctrl.state().write().await;
            state.dirty = true;
            log::debug!("add_curve_point(point: {:?}) success", point);
            Ok(Empty { ok: true })
        }
        async fn remove_curve_point(
            &mut self,
            input: IndexMessage,
        ) -> Result<Empty, Box<dyn std::error::Error + Send>>{
            let mut settings = self.ctrl.settings().write().await;
            let i = input.index as usize;
            if settings.curve.len() > i {
                settings.curve.swap_remove(i);
                settings.sort_curve();
                let mut state = self.ctrl.state().write().await;
                state.dirty = true;
                log::debug!("remove_curve_point(point: {}) success", input.index);
                Ok(Empty { ok: true })
            } else {
                log::debug!("remove_curve_point(index: {}) failed", input.index);
                Ok(Empty { ok: false })
            }
        }

        async fn set_curve(
            &mut self,
            input: JsonMessage,
        ) -> Result<Empty, Box<dyn std::error::Error + Send>> {
            let pairs: Vec<(f64, f64)> = match serde_json::from_str(&input.json) {
                Ok(pairs) => pairs,
                Err(e) => {
                    log::warn!("set_curve rejected invalid JSON: {}", e);
                    return Ok(Empty { ok: false });
                }
            };
            let curve: Vec<super::datastructs::GraphPoint> = pairs
                .into_iter()
                .map(|(x, y)| super::datastructs::GraphPoint { x, y })
                .collect();
            let mut settings = self.ctrl.settings().write().await;
            settings.curve = curve;
            settings.sort_curve();
            settings.system_profile = None;
            let mut state = self.ctrl.state().write().await;
            state.dirty = true;
            log::debug!("set_curve({} points) success", settings.curve.len());
            Ok(Empty { ok: true })
        }
        async fn set_fixed_speed(
            &mut self,
            input: RatioMessage,
        ) -> Result<RatioMessage, Box<dyn std::error::Error + Send>> {
            let value = if input.ratio.is_finite() && input.ratio >= 0.0 {
                Some(input.ratio.min(1.0))
            } else {
                None
            };
            let mut settings = self.ctrl.settings().write().await;
            let mut state = self.ctrl.state().write().await;
            state.tripped = false;
            if settings.fixed_speed != value {
                settings.fixed_speed = value;
                state.dirty = true;
            }
            log::debug!("set_fixed_speed({:?}) success", value);
            Ok(RatioMessage { ratio: value.unwrap_or(-1.0) })
        }
        async fn get_fixed_speed(
            &mut self,
            _input: Empty,
        ) -> Result<RatioMessage, Box<dyn std::error::Error + Send>> {
            let settings = self.ctrl.settings().read().await;
            Ok(RatioMessage { ratio: settings.fixed_speed.unwrap_or(-1.0) })
        }
        async fn set_system_profile(
            &mut self,
            input: NameMessage,
        ) -> Result<NameMessage, Box<dyn std::error::Error + Send>> {
            let name = input.name.trim().to_owned();
            let value = if name.is_empty() {
                None
            } else if self.ctrl.profiles().iter().any(|p| p.name == name) {
                Some(name)
            } else {
                log::warn!("set_system_profile: unknown profile `{}`", name);
                let settings = self.ctrl.settings().read().await;
                return Ok(NameMessage { name: settings.system_profile.clone().unwrap_or_default() });
            };
            let mut settings = self.ctrl.settings().write().await;
            let mut state = self.ctrl.state().write().await;
            state.tripped = false;
            if settings.system_profile != value {
                settings.system_profile = value.clone();
                state.dirty = true;
            }
            log::debug!("set_system_profile({:?}) success", value);
            Ok(NameMessage { name: value.unwrap_or_default() })
        }
        async fn get_system_profile(
            &mut self,
            _input: Empty,
        ) -> Result<NameMessage, Box<dyn std::error::Error + Send>> {
            let settings = self.ctrl.settings().read().await;
            Ok(NameMessage { name: settings.system_profile.clone().unwrap_or_default() })
        }
        async fn get_system_profiles(
            &mut self,
            _input: Empty,
        ) -> Result<JsonMessage, Box<dyn std::error::Error + Send>> {
            let fan = self.ctrl.fan_clone();
            let max_rpm = fan.rpm_range().end;
            let profiles: Vec<serde_json::Value> = self
                .ctrl
                .profiles()
                .iter()
                .map(|p| {
                    let points: Vec<[f64; 2]> = p.sample(max_rpm).iter().map(|g| [g.x, g.y]).collect();
                    serde_json::json!({
                        "name": p.name,
                        "description": p.description,
                        "points": points,
                        "from_system_files": p.from_system_files,
                    })
                })
                .collect();
            let json = serde_json::json!({
                "supported": fan.supports_system_profiles(),
                "profiles": profiles,
            });
            Ok(JsonMessage { json: json.to_string() })
        }
        async fn get_status(
            &mut self,
            _input: Empty,
        ) -> Result<JsonMessage, Box<dyn std::error::Error + Send>> {
            let fan = self.ctrl.fan_clone();
            let range = fan.rpm_range();
            let status = self.ctrl.status().read().await.clone();
            let floor: Vec<[f64; 2]> = super::logic::SAFETY_FLOOR.iter().map(|(t, r)| [*t, *r]).collect();
            let json = serde_json::json!({
                "controlling": status.controlling,
                "reason": status.reason,
                "mode": status.mode,
                "target_ratio": status.target_ratio,
                "floor_ratio": status.floor_ratio,
                "temperature": status.temperature_c,
                "device": fan.name(),
                "rpm_min": range.start,
                "rpm_max": range.end,
                "firmware_curve": fan.uses_firmware_curve(),
                "floor": floor,
            });
            Ok(JsonMessage { json: json.to_string() })
        }
}
