use std::default::Default;
use std::fmt::Display;
use std::io::Write;

use serde::{Serialize, Deserialize};

//use super::datastructs::{Settings, GraphPoint};

#[derive(Serialize, Deserialize)]
#[serde(default)]
pub struct SettingsJson {
    pub version: u64,
    pub enable: bool,
    pub interpolate: bool,
    pub curve: Vec<GraphPointJson>,
    /// Fixed fan ratio (0..1); overrides the curve and system profile when set.
    pub fixed_speed: Option<f64>,
    /// Name of a SteamOS profile to follow instead of the point curve.
    pub system_profile: Option<String>,
    /// Kernel boot id at the time the settings were last saved.
    pub last_boot_id: Option<String>,
}

#[derive(Serialize, Deserialize, Default)]
#[serde(default)]
pub struct GraphPointJson {
    pub x: f64,
    pub y: f64,
}

impl Default for SettingsJson {
    fn default() -> Self {
        Self {
            version: 2,
            enable: false,
            interpolate: true,
            curve: Vec::new(),
            fixed_speed: None,
            system_profile: None,
            last_boot_id: None,
        }
    }
}

impl SettingsJson {
    /// Write to a temporary file and rename it over the target, so a power loss can
    /// never leave half a JSON document behind.
    pub fn save<P: AsRef<std::path::Path>>(&self, path: P) -> Result<(), JsonError> {
        let path = path.as_ref();
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent).map_err(JsonError::Io)?;
        }
        let tmp = path.with_extension("json.tmp");
        {
            let mut file = std::fs::File::create(&tmp).map_err(JsonError::Io)?;
            serde_json::to_writer_pretty(&mut file, &self).map_err(JsonError::Serde)?;
            file.flush().map_err(JsonError::Io)?;
            file.sync_all().map_err(JsonError::Io)?;
        }
        std::fs::rename(&tmp, path).map_err(JsonError::Io)
    }

    pub fn open<P: AsRef<std::path::Path>>(path: P) -> Result<Self, JsonError> {
        let mut file = std::fs::File::open(path).map_err(JsonError::Io)?;
        serde_json::from_reader(&mut file).map_err(JsonError::Serde)
    }

    /// Open the settings, falling back to defaults. A file that exists but cannot be
    /// parsed is moved aside to `*.corrupt` so it is not silently overwritten.
    pub fn open_or_default<P: AsRef<std::path::Path>>(path: P) -> Self {
        let path = path.as_ref();
        match Self::open(path) {
            Ok(settings) => settings,
            Err(JsonError::Io(e)) => {
                if e.kind() != std::io::ErrorKind::NotFound {
                    log::error!("could not read {}: {}", path.display(), e);
                }
                Self::default()
            }
            Err(JsonError::Serde(e)) => {
                let backup = path.with_extension("json.corrupt");
                log::error!("{} is not valid ({}); moving it to {}", path.display(), e, backup.display());
                if let Err(e) = std::fs::rename(path, &backup) {
                    log::error!("could not back up corrupt settings: {}", e);
                }
                Self::default()
            }
        }
    }
}

#[derive(Debug)]
pub enum JsonError {
    Serde(serde_json::Error),
    Io(std::io::Error),
}

impl Display for JsonError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            Self::Serde(e) => (e as &dyn Display).fmt(f),
            Self::Io(e) => (e as &dyn Display).fmt(f),
        }
    }
}
