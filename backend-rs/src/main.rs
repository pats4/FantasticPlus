mod api;
mod adapters;
mod control;
mod datastructs;
mod json;
mod logic;
mod sys;

use std::sync::Arc;

use simplelog::{WriteLogger, LevelFilter};

#[allow(missing_docs)]
#[allow(dead_code)]
pub mod services {
    include!(concat!(env!("OUT_DIR"), "/mod.rs"));
}

use services::fantastic::FanServer;

/// Distinct from the original Fantastic (44444) so both can be installed.
const PORT: u16 = 44445;
const LOG_PATH: &str = "/tmp/fantasticplus.log";

/// Hand the fan back to SteamOS on SIGTERM/SIGINT/SIGHUP and on any panic, so the
/// fan is never left at a fixed speed with jupiter-fan-control stopped.
fn install_hand_back(fan: Arc<Box<dyn adapters::FanAdapter>>) {
    let panic_fan = fan.clone();
    let default_hook = std::panic::take_hook();
    std::panic::set_hook(Box::new(move |info| {
        log::error!("panic: {}", info);
        control::hand_back(panic_fan.as_ref().as_ref());
        default_hook(info);
        // a dead control thread must not keep "owning" the fan; main.py restarts us
        std::process::exit(101);
    }));
    use signal_hook::consts::{SIGHUP, SIGINT, SIGTERM};
    match signal_hook::iterator::Signals::new([SIGTERM, SIGINT, SIGHUP]) {
        Ok(mut signals) => {
            std::thread::spawn(move || {
                if let Some(signal) = signals.forever().next() {
                    log::info!("received signal {}; handing the fan back", signal);
                    control::hand_back(fan.as_ref().as_ref());
                    std::process::exit(0);
                }
            });
        }
        Err(e) => log::error!("could not install signal handlers: {}", e),
    }
}

fn main() -> Result<(), ()> {
    WriteLogger::init(
        #[cfg(debug_assertions)]{LevelFilter::Debug},
        #[cfg(not(debug_assertions))]{LevelFilter::Info},
        Default::default(),
        std::fs::File::create(LOG_PATH).map_err(|e| eprintln!("cannot create {}: {}", LOG_PATH, e))?
    ).map_err(|e| eprintln!("logger: {}", e))?;

    log::info!("Starting back-end ({} v{})", api::NAME, api::VERSION);
    println!("Starting back-end ({} v{})", api::NAME, api::VERSION);
    let runtime = control::ControlRuntime::new_boxed(
        adapters::fans::SteamDeckFan::maybe_find()
            .map(|f| Box::new(f) as Box<dyn adapters::FanAdapter>)
            .unwrap_or_else(|| Box::new(adapters::fans::DevModeFan)),
        adapters::fans::SteamDeckFan::maybe_find_thermal_zone()
            .map(|t| Box::new(adapters::sensors::ThermalZoneSensor::new(t)) as Box<dyn adapters::SensorAdapter>)
            .or_else(
                || adapters::sensors::ThermalZoneSensor::new_if_exists("/sys/thermal/thermal_zone0")
                    .map(|t| Box::new(t) as Box<dyn adapters::SensorAdapter>)
            )
            .unwrap_or_else(|| Box::new(adapters::sensors::DevModeSensor))
    );
    install_hand_back(runtime.fan_clone());
    let result = usdpl_back::Server::new(PORT)
        .register(FanServer::new(api::FanService::new(runtime)))
        .run_blocking();
    if let Err(e) = result {
        log::error!("server stopped: {}", e);
        return Err(());
    }
    Ok(())
}
