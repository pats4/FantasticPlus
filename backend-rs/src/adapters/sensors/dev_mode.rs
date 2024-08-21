pub struct DevModeSensor;

impl super::Adapter for DevModeSensor {
    fn read(&self) -> Result<super::Reading, std::io::Error> {
        log::info!("read invoked");
        return Ok(super::Reading {
            value: 42_000.0,
            meaning: super::super::SensorType::Temperature,
            name: "DevModeSensor",
        })
    }
}
