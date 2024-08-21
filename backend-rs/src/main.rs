mod api;
mod adapters;
mod control;
mod datastructs;
mod json;
mod sys;

use simplelog::{WriteLogger, LevelFilter};

#[allow(missing_docs)]
#[allow(dead_code)]
pub mod services {
    include!(concat!(env!("OUT_DIR"), "/mod.rs"));
}

use services::fantastic::FanServer;

const PORT: u16 = 44444;

fn main() -> Result<(), ()> {
    WriteLogger::init(
        #[cfg(debug_assertions)]{LevelFilter::Debug},
        #[cfg(not(debug_assertions))]{LevelFilter::Info},
        Default::default(),
        std::fs::File::create("/tmp/fantastic.log").unwrap()
    ).unwrap();

    log::info!("Starting back-end ({} v{})", api::NAME, api::VERSION);
    println!("Starting back-end ({} v{})", api::NAME, api::VERSION);
    usdpl_back::Server::new(PORT)
        .register(FanServer::new(
            api::FanService::new(control::ControlRuntime::new_boxed(
                adapters::fans::SteamDeckFan::maybe_find()
                    .map(|f| Box::new(f) as Box<dyn adapters::FanAdapter>)
                    .unwrap_or_else(|| Box::new(adapters::fans::DevModeFan)),
                adapters::fans::SteamDeckFan::maybe_find_thermal_zone()
                    .map(|t| Box::new(adapters::sensors::ThermalZoneSensor::new(t)) as Box<dyn adapters::SensorAdapter>)
                    .unwrap_or_else(|| Box::new(adapters::sensors::DevModeSensor))
            ))
        ))
        .run_blocking()
        .unwrap();
    Ok(())
    /*Instance::new(PORT)
        .register("echo", api::echo)
        .register("hello", api::hello)
        .register("version", api::version)
        .register("name", api::name)
        .register("get_fan_rpm", api::get_fan_rpm)
        .register("get_temperature", api::get_temperature)
        .register("set_enable", api::set_enable_gen(&runtime))
        .register("get_enable", api::get_enable_gen(&runtime))
        .register("set_interpolate", api::set_interpolate_gen(&runtime))
        .register("get_interpolate", api::get_interpolate_gen(&runtime))
        .register("get_curve", api::get_curve_gen(&runtime))
        .register("add_curve_point", api::add_curve_point_gen(&runtime))
        .register("remove_curve_point", api::remove_curve_point_gen(&runtime))
        .run_blocking()*/
    //Ok(())
    //println!("Hello, world!");
}
