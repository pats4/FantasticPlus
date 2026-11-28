use crate::services::fantastic::*;

use super::control::ControlRuntime;

pub const VERSION: &'static str = env!("CARGO_PKG_VERSION");
pub const NAME: &'static str = env!("CARGO_PKG_NAME");

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

#[::nrpc::_helpers::async_trait::async_trait]
impl<'a> IFan<'a> for FanService {
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

    async fn set_enable(
        &mut self,
        input: EnablementMessage,
    ) -> Result<EnablementMessage, Box<dyn std::error::Error + Send>> {
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
    ) -> Result<EnablementMessage, Box<dyn std::error::Error + Send>> {
        let is_enabled = self.ctrl.settings().read().await.enable;
        log::debug!("get_enable() success");
        Ok(EnablementMessage { is_enabled })
    }

    async fn set_interpolate(
        &mut self,
        input: EnablementMessage,
    ) -> Result<EnablementMessage, Box<dyn std::error::Error + Send>> {
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
    ) -> Result<EnablementMessage, Box<dyn std::error::Error + Send>> {
        let is_enabled = self.ctrl.settings().read().await.interpolate;
        log::debug!("get_interpolate() success");
        Ok(EnablementMessage { is_enabled })
    }

    async fn get_curve_x(
        &mut self,
        _input: Empty,
    ) -> Result<CurveMessageX, Box<dyn std::error::Error + Send>> {
        let settings = self.ctrl.settings().read().await;
        let x = settings.curve.iter().map(|p| p.x).collect();
        log::debug!("get_curve_x() success");
        Ok(CurveMessageX { x })
    }

    async fn get_curve_y(
        &mut self,
        _input: Empty,
    ) -> Result<CurveMessageY, Box<dyn std::error::Error + Send>> {
        let settings = self.ctrl.settings().read().await;
        let y = settings.curve.iter().map(|p| p.y).collect();
        log::debug!("get_curve_y() success");
        Ok(CurveMessageY { y })
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

    async fn get_status(
        &mut self,
        _input: Empty,
    ) -> Result<JsonMessage, Box<dyn std::error::Error + Send>> {
        let fan = self.ctrl.fan_clone();
        let range = fan.rpm_range();
        // one sysfs read, only while the panel is open and polling
        let rpm = fan.sensor().and_then(|s| s.read().ok()).map(|r| r.value);
        let floor: Vec<[f64; 2]> = super::logic::SAFETY_FLOOR.iter().map(|(t, r)| [*t, *r]).collect();
        let status = self.ctrl.status().read().await;
        let (history, fan_history): (Vec<u16>, Vec<u8>) = status.history.iter().unzip();
        let json = serde_json::json!({
            "controlling": status.controlling,
            "reason": status.reason,
            "mode": status.mode,
            "target_ratio": status.target_ratio,
            "floor_ratio": status.floor_ratio,
            "temperature": status.temperature_c,
            "rpm": rpm,
            "history": history,
            "fan_history": fan_history,
            "device": fan.name(),
            "rpm_min": range.start,
            "rpm_max": range.end,
            "floor": floor,
        });
        drop(status);
        Ok(JsonMessage { json: json.to_string() })
    }
}
