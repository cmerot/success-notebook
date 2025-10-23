import { invoke } from '@tauri-apps/api/core'

export async function ping(value: string): Promise<string | null> {
  return await invoke<{value?: string}>('plugin:statusbar|ping', {
    payload: {
      value,
    },
  }).then((r) => (r.value ? r.value : null));
}

export async function setDark(): Promise<string | null> {
  return await invoke<{res?: string}>('plugin:statusbar|set_dark')
    .then((r) => (r.res ? r.res : null));
}

export async function setLight(): Promise<string | null> {
  return await invoke<{res?: string}>('plugin:statusbar|set_light')
    .then((r) => (r.res ? r.res : null));
}
