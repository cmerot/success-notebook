/**
 * File operations adapter interface
 * Provides a unified API for file download/save operations
 * that works in both Tauri and web environments
 */

export interface SaveDialogOptions {
	/**
	 * File type filters
	 */
	filters?: Array<{
		name: string;
		extensions: string[];
	}>;
	/**
	 * Default file path/name
	 */
	defaultPath?: string;
}

export interface ConfirmDialogOptions {
	/**
	 * Dialog title
	 */
	title?: string;
	/**
	 * Dialog kind/type
	 */
	kind?: 'info' | 'warning' | 'error';
}

export interface OpenDialogOptions {
	/**
	 * File type filters
	 */
	filters?: Array<{
		name: string;
		extensions: string[];
	}>;
	/**
	 * Allow multiple file selection
	 */
	multiple?: boolean;
}

export interface FileOperationsAdapter {
	/**
	 * Show a save file dialog
	 * @param options Dialog options
	 * @returns Selected file path, or null if cancelled
	 */
	showSaveDialog(options?: SaveDialogOptions): Promise<string | null>;

	/**
	 * Show an open file dialog
	 * @param options Dialog options
	 * @returns Array of selected file paths, or null if cancelled
	 */
	showOpenDialog(options?: OpenDialogOptions): Promise<string[] | null>;

	/**
	 * Write text to a file
	 * @param path File path to write to
	 * @param content Text content to write
	 */
	writeTextFile(path: string, content: string): Promise<void>;

	/**
	 * Read text from a file
	 * @param path File path to read from
	 * @returns File content as string
	 */
	readTextFile(path: string): Promise<string>;

	/**
	 * Show a confirmation dialog
	 * @param message The confirmation message
	 * @param options Dialog options
	 * @returns true if confirmed, false otherwise
	 */
	confirm(message: string, options?: ConfirmDialogOptions): Promise<boolean>;

	/**
	 * Show an alert dialog
	 * @param message The alert message
	 * @param options Dialog options
	 */
	alert(message: string, options?: ConfirmDialogOptions): Promise<void>;
}
