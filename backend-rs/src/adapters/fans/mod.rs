mod dev_mode;
pub use dev_mode::DevModeFan;

mod steam_deck;
pub use steam_deck::SteamDeckFan;

pub(self) use super::FanAdapter as Adapter;
