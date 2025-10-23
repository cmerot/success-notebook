const COMMANDS: &[&str] = &["ping", "set_dark", "set_light"];

fn main() {
  tauri_plugin::Builder::new(COMMANDS)
    .android_path("android")
    .ios_path("ios")
    .build();
}
