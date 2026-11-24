//! SteamOS (`jupiter-fan-control`) board profiles.
//!
//! The installed YAML files are preferred so a SteamOS update to Valve's curves is
//! picked up; the built-in copies in [`crate::logic`] are used when they are missing.

use serde_yaml::Value;

use crate::logic::{ValveController, ValveProfile};

const CONFIG_DIR: &str = "/usr/share/jupiter-fan-control";

/// All known profiles, read from SteamOS where possible.
pub fn load() -> Vec<ValveProfile> {
    vec![
        load_one("jupiter-config.yaml", ValveProfile::jupiter_builtin()),
        load_one("galileo-config.yaml", ValveProfile::galileo_builtin()),
    ]
}

fn load_one(file: &str, builtin: ValveProfile) -> ValveProfile {
    let path = std::path::Path::new(CONFIG_DIR).join(file);
    match std::fs::read_to_string(&path) {
        Ok(text) => match parse(&text, &builtin) {
            Ok(profile) => {
                log::info!("loaded SteamOS fan profile {}", path.display());
                profile
            }
            Err(e) => {
                log::warn!("could not use {} ({}); using built-in {}", path.display(), e, builtin.name);
                builtin
            }
        },
        Err(e) => {
            log::info!("{} unavailable ({}); using built-in {}", path.display(), e, builtin.name);
            builtin
        }
    }
}

fn num(v: &Value, key: &str) -> Result<f64, String> {
    v.get(key)
        .and_then(|x| x.as_f64().or_else(|| x.as_i64().map(|i| i as f64)))
        .filter(|x| x.is_finite())
        .ok_or_else(|| format!("missing or invalid `{}`", key))
}

fn controller(device: &Value) -> Result<ValveController, String> {
    let max_temp = num(device, "max_temp")?;
    match device.get("type").and_then(Value::as_str) {
        Some("quadratic") => Ok(ValveController {
            a: num(device, "A")?,
            b: num(device, "B")?,
            c: num(device, "C")?,
            t_threshold: num(device, "T_threshold")?,
            feed_forward: None,
            max_temp,
        }),
        Some("ffquad") => Ok(ValveController {
            a: num(device, "A_quad")?,
            b: num(device, "B_quad")?,
            c: num(device, "C_quad")?,
            t_threshold: num(device, "T_threshold").unwrap_or(0.0),
            feed_forward: Some((num(device, "A_ff")?, num(device, "B_ff")?)),
            max_temp,
        }),
        other => Err(format!("unsupported controller type {:?}", other)),
    }
}

/// Parse a jupiter-fan-control YAML file into a profile named like `builtin`.
pub fn parse(text: &str, builtin: &ValveProfile) -> Result<ValveProfile, String> {
    let doc: Value = serde_yaml::from_str(text).map_err(|e| e.to_string())?;
    let devices = doc
        .get("devices")
        .and_then(Value::as_sequence)
        .ok_or("missing `devices`")?;
    let find = |nice: &str| {
        devices
            .iter()
            .find(|d| d.get("nice_name").and_then(Value::as_str) == Some(nice))
            .ok_or(format!("missing {} device", nice))
            .and_then(controller)
    };
    let profile = ValveProfile {
        name: builtin.name.clone(),
        description: builtin.description.clone(),
        min_speed: num(&doc, "fan_min_speed")?,
        threshold_speed: num(&doc, "fan_threshold_speed")?,
        max_speed: num(&doc, "fan_max_speed")?,
        min_time_on_s: num(&doc, "fan_min_time_on").unwrap_or(0.0),
        hysteresis: num(&doc, "fan_hysteresis").unwrap_or(0.0),
        cpu: find("CPU")?,
        gpu: find("GPU")?,
        from_system_files: true,
    };
    if !(profile.max_speed > profile.threshold_speed && profile.threshold_speed >= profile.min_speed) {
        return Err("fan speed limits are inconsistent".into());
    }
    Ok(profile)
}

#[cfg(test)]
mod tests {
    use super::*;

    // Hand-written fixtures in the jupiter-fan-control format, holding the values
    // shipped in jupiter-fan-control 20260902.1.
    const JUPITER: &str = include_str!("../testdata/jupiter-config.yaml");
    const GALILEO: &str = include_str!("../testdata/galileo-config.yaml");

    #[test]
    fn parses_shipped_files_like_builtins() {
        let mut j = parse(JUPITER, &ValveProfile::jupiter_builtin()).unwrap();
        j.from_system_files = false;
        assert_eq!(j, ValveProfile::jupiter_builtin());
        let mut g = parse(GALILEO, &ValveProfile::galileo_builtin()).unwrap();
        g.from_system_files = false;
        assert_eq!(g, ValveProfile::galileo_builtin());
    }

    #[test]
    fn rejects_garbage() {
        assert!(parse("devices: 3", &ValveProfile::jupiter_builtin()).is_err());
        assert!(parse(":::", &ValveProfile::jupiter_builtin()).is_err());
    }
}
