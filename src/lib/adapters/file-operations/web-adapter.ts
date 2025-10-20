import type {
	FileOperationsAdapter,
	SaveDialogOptions,
	OpenDialogOptions,
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

	async showOpenDialog(options?: OpenDialogOptions): Promise<string[] | null> {
		return new Promise((resolve) => {
			const input = document.createElement('input');
			input.type = 'file';
			input.multiple = options?.multiple || false;

			// Set file type filters if provided
			if (options?.filters && options.filters.length > 0) {
				const accept = options.filters
					.flatMap((filter) => filter.extensions.map((ext) => `.${ext}`))
					.join(',');
				input.accept = accept;
			}

			input.onchange = async (e) => {
				const files = (e.target as HTMLInputElement).files;
				if (!files || files.length === 0) {
					resolve(null);
					return;
				}

				// For web, we'll store the file contents in memory using FileReader
				// and return a pseudo-path that we can use to retrieve the content later
				const paths: string[] = [];
				for (let i = 0; i < files.length; i++) {
					const file = files[i];
					// Store file in a temporary map for later retrieval
					const fileId = `web-file-${Date.now()}-${i}`;
					this.fileCache.set(fileId, file);
					paths.push(fileId);
				}
				resolve(paths);
			};

			input.oncancel = () => {
				resolve(null);
			};

			input.click();
		});
	}

	// Cache for storing File objects selected via file input
	private fileCache = new Map<string, File>();

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

	async readTextFile(path: string): Promise<string> {
		// For web, the "path" is actually a file ID in our cache
		const file = this.fileCache.get(path);
		if (!file) {
			throw new Error(`File not found: ${path}`);
		}

		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				// Clean up the cache after reading
				this.fileCache.delete(path);
				resolve(reader.result as string);
			};
			reader.onerror = () => {
				reject(new Error('Failed to read file'));
			};
			reader.readAsText(file);
		});
	}

	async confirm(message: string, options?: ConfirmDialogOptions): Promise<boolean> {
		// Use native browser confirm dialog
		// Note: Browser confirm() doesn't support custom titles or kinds
		// For a better UX, you could integrate a modal library like svelte-sonner
		const prefix = options?.title ? `${options.title}\n\n` : '';
		return window.confirm(prefix + message);
	}

	async alert(message: string, options?: ConfirmDialogOptions): Promise<void> {
		// Use native browser alert dialog
		const prefix = options?.title ? `${options.title}\n\n` : '';
		window.alert(prefix + message);
	}
}
