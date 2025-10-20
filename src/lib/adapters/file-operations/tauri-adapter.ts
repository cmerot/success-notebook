import { save, open, confirm, message } from '@tauri-apps/plugin-dialog';
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';
import type {
	FileOperationsAdapter,
	SaveDialogOptions,
	OpenDialogOptions,
	ConfirmDialogOptions
} from './interface';

/**
 * Tauri file operations adapter
 * Uses native file system dialogs and APIs
 */
export class TauriFileOperationsAdapter implements FileOperationsAdapter {
	async showSaveDialog(options?: SaveDialogOptions): Promise<string | null> {
		const path = await save(options);
		return path;
	}

	async showOpenDialog(options?: OpenDialogOptions): Promise<string[] | null> {
		const result = await open(options);
		if (result === null) {
			return null;
		}
		// Tauri's open can return a string or string[] depending on multiple option
		return Array.isArray(result) ? result : [result];
	}

	async writeTextFile(path: string, content: string): Promise<void> {
		await writeTextFile(path, content);
	}

	async readTextFile(path: string): Promise<string> {
		return await readTextFile(path);
	}

	async confirm(message: string, options?: ConfirmDialogOptions): Promise<boolean> {
		const result = await confirm(message, options);
		return result;
	}

	async alert(msg: string, options?: ConfirmDialogOptions): Promise<void> {
		await message(msg, options);
	}
}
