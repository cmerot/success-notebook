use serde::de::DeserializeOwned;
use tauri::{plugin::PluginApi, AppHandle, Runtime};

use crate::models::*;

pub fn init<R: Runtime, C: DeserializeOwned>(
  app: &AppHandle<R>,
  _api: PluginApi<R, C>,
) -> crate::Result<Statusbar<R>> {
  Ok(Statusbar(app.clone()))
}

/// Access to the statusbar APIs.
pub struct Statusbar<R: Runtime>(AppHandle<R>);

impl<R: Runtime> Statusbar<R> {
  pub fn ping(&self, payload: PingRequest) -> crate::Result<PingResponse> {
    Ok(PingResponse {
      value: payload.value,
    })
  }

  pub fn set_dark(&self) -> crate::Result<SetDarkResponse> {
    Ok(SetDarkResponse {
      res: Some("dark ok".to_string()),
    })
  }

  pub fn set_light(&self) -> crate::Result<SetLightResponse> {
    Ok(SetLightResponse {
      res: Some("light ok".to_string()),
    })
  }
}
