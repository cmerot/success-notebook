use tauri::{AppHandle, command, Runtime};

use crate::models::*;
use crate::Result;
use crate::StatusbarExt;

#[command]
pub(crate) async fn ping<R: Runtime>(
    app: AppHandle<R>,
    payload: PingRequest,
) -> Result<PingResponse> {
    app.statusbar().ping(payload)
}

#[command]
pub(crate) async fn set_dark<R: Runtime>(
    app: AppHandle<R>,
) -> Result<SetDarkResponse> {
    app.statusbar().set_dark()
}

#[command]
pub(crate) async fn set_light<R: Runtime>(
    app: AppHandle<R>,
) -> Result<SetLightResponse> {
    app.statusbar().set_light()
}
