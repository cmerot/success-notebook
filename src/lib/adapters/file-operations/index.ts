import type { FileOperationsAdapter } from './interface';

/**
 * Detects if the app is running in a Tauri environment
 * @returns true if running in Tauri, false otherwise
 */
function isTauriEnvironment(): boolean {
	// Check if window.__TAURI_INTERNALS__ exists (Tauri v2) or window.__TAURI__ (Tauri v1)
	return (
		typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window)
	);
}

/**
 * Creates and returns the appropriate file operations adapter based on the runtime environment
 * - Tauri: Uses native file system dialogs and APIs
 * - Web: Uses browser download APIs and native confirm dialogs
 */
async function createFileOperationsAdapter(): Promise<FileOperationsAdapter> {
	if (isTauriEnvironment()) {
		// Dynamic import to avoid bundling Tauri dependencies in web builds
		const { TauriFileOperationsAdapter } = await import('./tauri-adapter');
		return new TauriFileOperationsAdapter();
	} else {
		const { WebFileOperationsAdapter } = await import('./web-adapter');
		return new WebFileOperationsAdapter();
	}
}

// Create a singleton instance
let fileOpsInstance: Promise<FileOperationsAdapter> | null = null;

/**
 * Gets the file operations adapter singleton instance
 * Automatically selects the correct adapter based on runtime environment
 */
export async function getFileOperationsAdapter(): Promise<FileOperationsAdapter> {
	if (!fileOpsInstance) {
		fileOpsInstance = createFileOperationsAdapter();
	}
	return fileOpsInstance;
}

// Re-export the interface and types for convenience
export type {
	FileOperationsAdapter,
	SaveDialogOptions,
	OpenDialogOptions,
	ConfirmDialogOptions
} from './interface';
