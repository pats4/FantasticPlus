use std::default::Default;
use std::convert::{Into, From};
use std::path::PathBuf;

use super::json::{SettingsJson, GraphPointJson};

#[derive(Debug, Clone)]
pub struct Settings {
    pub version: u64,
    pub enable: bool,
    pub interpolate: bool,
    pub curve: Vec<GraphPoint>,
    /// Fixed fan ratio (0..1); takes precedence over the curve.
    pub fixed_speed: Option<f64>,
    pub last_boot_id: Option<String>,
}

/// What the plugin is asked to do with the fan.
#[derive(Debug, Clone, PartialEq)]
pub enum Mode {
    Fixed(f64),
    Curve,
}

impl Settings {
    /// Sanitise the curve: sorted, clamped, no duplicate temperatures.
    pub fn sort_curve(&mut self) {
        self.curve = crate::logic::sanitize_curve(&self.curve);
    }

    pub fn mode(&self) -> Mode {
        match self.fixed_speed {
            Some(ratio) => Mode::Fixed(ratio),
            None => Mode::Curve,
        }
    }
}

fn sanitize_ratio(ratio: Option<f64>) -> Option<f64> {
    ratio.filter(|r| r.is_finite()).map(|r| r.clamp(0.0, 1.0))
}

impl From<SettingsJson> for Settings {
    fn from(mut other: SettingsJson) -> Self {
        let version = other.version;
        let mut result = Self {
            version: 2,
            enable: other.enable,
            interpolate: other.interpolate,
            curve: other.curve.drain(..).map(|x| GraphPoint::from_json(x, version)).collect(),
            fixed_speed: sanitize_ratio(other.fixed_speed),
            last_boot_id: other.last_boot_id,
        };
        result.sort_curve();
        result
    }
}

impl Into<SettingsJson> for Settings {
    #[inline]
    fn into(mut self) -> SettingsJson {
        SettingsJson {
            version: self.version,
            enable: self.enable,
            interpolate: self.interpolate,
            curve: self.curve.drain(..).map(|x| x.into()).collect(),
            fixed_speed: self.fixed_speed,
            last_boot_id: self.last_boot_id,
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct GraphPoint {
    pub x: f64,
    pub y: f64,
}

impl GraphPoint {
    #[inline]
    pub fn from_json(other: GraphPointJson, version: u64) -> Self {
        match version {
            0 => Self {
                x: other.x,
                y: 1.0 - other.y, // use bottom left as origin, instead of whacky old way of top left
            },
            1 => Self {
                x: other.x,
                y: other.y,
            },
            _ => Self {
                x: other.x,
                y: other.y,
            }
        }
    }
}

impl Into<GraphPointJson> for GraphPoint {
    #[inline]
    fn into(self) -> GraphPointJson {
        GraphPointJson {
            x: self.x,
            y: self.y,
        }
    }
}

#[derive(Debug)]
pub struct State {
    pub home: PathBuf,
    pub dirty: bool,
    /// Set by the watchdog after repeated failures; cleared by any mode change.
    pub tripped: bool,
}

impl State {
    pub fn new() -> Self {
        let def = Self::default();
        Self {
            home: user_home().unwrap_or(def.home),
            dirty: true,
            tripped: false,
        }
    }
}

/// The Deck user's home directory.
///
/// Decky passes `DECKY_USER_HOME` to plugins. usdpl's fallback parses `who`, which
/// yields `/home` itself when nobody is listed, so that result is ignored.
fn user_home() -> Option<PathBuf> {
    std::env::var_os("DECKY_USER_HOME")
        .map(PathBuf::from)
        .filter(|p| p.is_dir())
        .or_else(|| usdpl_back::api::dirs::home().filter(|p| p.parent() == Some(std::path::Path::new("/home"))))
}

impl Default for State {
    fn default() -> Self {
        Self {
            home: "/home/deck".into(),
            dirty: true,
            tripped: false,
        }
    }
}
