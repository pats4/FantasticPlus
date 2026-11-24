pub struct DevModeFan;

impl super::Adapter for DevModeFan {
    fn on_enable_toggled(&self, settings: &crate::datastructs::Settings) {
        log::info!("on_enable_toggled invoked with settings {:?}", settings);
    }

    fn control_fan(&self, settings: &crate::datastructs::Settings, sensor: &crate::adapters::traits::SensorReading) {
        log::info!("control_fan invoked with settings {:?} and sensor {:?}", settings, sensor);
    }
}
