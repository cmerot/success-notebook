import type { StorageAdapter } from './interface';

/**
 * Detects if the app is running in a Tauri environment
 * @returns true if running in Tauri, false otherwise
 */
function isTauriEnvironment(): boolean {
	// Check if window.__TAURI_INTERNALS__ exists (Tauri v2) or window.__TAURI__ (Tauri v1)
	return (
		typeof window !== 'undefined' &&
		('__TAURI_INTERNALS__' in window || '__TAURI__' in window)
	);
}

/**
 * Creates and returns the appropriate storage adapter based on the runtime environment
 * - Tauri: Uses file-based storage via @tauri-apps/plugin-store
 * - Web: Uses IndexedDB for browser-based storage
 */
async function createStorageAdapter(): Promise<StorageAdapter> {
	if (isTauriEnvironment()) {
		// Dynamic import to avoid bundling Tauri dependencies in web builds
		const { TauriStorageAdapter } = await import('./tauri-adapter');
		return new TauriStorageAdapter();
	} else {
		const { WebStorageAdapter } = await import('./web-adapter');
		return new WebStorageAdapter();
	}
}

// Create a singleton instance
let storageInstance: Promise<StorageAdapter> | null = null;

/**
 * Gets the storage adapter singleton instance
 * Automatically selects the correct adapter based on runtime environment
 */
export async function getStorageAdapter(): Promise<StorageAdapter> {
	if (!storageInstance) {
		storageInstance = createStorageAdapter();
	}
	return storageInstance;
}

// Re-export the interface for type checking
export type { StorageAdapter } from './interface';
