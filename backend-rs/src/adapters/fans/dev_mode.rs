pub struct DevModeFan;

impl super::Adapter for DevModeFan {
    fn name(&self) -> &'static str { "Development mode (no fan found)" }

    fn set_control(&self, take_over: bool) -> std::io::Result<()> {
        log::info!("set_control({}) invoked", take_over);
        Ok(())
    }

    fn apply(&self, command: crate::adapters::FanCommand) -> std::io::Result<()> {
        log::info!("apply({:?}) invoked", command);
        Ok(())
    }
}
