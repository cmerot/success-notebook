import type {
	FileOperationsAdapter,
	SaveDialogOptions,
	ConfirmDialogOptions
} from './interface';

/**
 * Web file operations adapter
 * Uses browser APIs for file download and dialogs
 */
export class WebFileOperationsAdapter implements FileOperationsAdapter {
	async showSaveDialog(options?: SaveDialogOptions): Promise<string | null> {
		// In web browsers, we can't show a native save dialog in the same way
		// Instead, we'll return the default path which will be used as filename
		// The actual download will happen via a blob download
		return options?.defaultPath || 'download.json';
	}

	async writeTextFile(path: string, content: string): Promise<void> {
		// Create a blob and trigger a download
		const blob = new Blob([content], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = path; // Use path as filename
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	async confirm(message: string, options?: ConfirmDialogOptions): Promise<boolean> {
		// Use native browser confirm dialog
		// Note: Browser confirm() doesn't support custom titles or kinds
		// For a better UX, you could integrate a modal library like svelte-sonner
		const prefix = options?.title ? `${options.title}\n\n` : '';
		return window.confirm(prefix + message);
	}
}
