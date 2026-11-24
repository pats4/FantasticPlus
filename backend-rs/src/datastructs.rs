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
}

impl Settings {
    pub fn sort_curve(&mut self) {
        self.curve.sort_by(|a, b| a.x.total_cmp(&b.x))
    }
}

impl From<SettingsJson> for Settings {
    fn from(mut other: SettingsJson) -> Self {
        let mut result = match other.version {
            0 => Self {
                version: 1,
                enable: other.enable,
                interpolate: other.interpolate,
                curve: other.curve.drain(..).map(|x| GraphPoint::from_json(x, other.version)).collect(),
            },
            1 => Self {
                version: 1,
                enable: other.enable,
                interpolate: other.interpolate,
                curve: other.curve.drain(..).map(|x| GraphPoint::from_json(x, other.version)).collect(),
            },
            _ => Self {
                version: 1,
                enable: other.enable,
                interpolate: other.interpolate,
                curve: other.curve.drain(..).map(|x| GraphPoint::from_json(x, other.version)).collect(),
            }
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
        }
    }
}

#[derive(Debug, Clone)]
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
}

impl State {
    pub fn new() -> Self {
        let def = Self::default();
        Self {
            home: usdpl_back::api::dirs::home().unwrap_or(def.home),
            dirty: true,
        }
    }
}

impl Default for State {
    fn default() -> Self {
        Self {
            home: "/home/deck".into(),
            dirty: true,
        }
    }
}
