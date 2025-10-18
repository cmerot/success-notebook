import { save, confirm } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import type {
	FileOperationsAdapter,
	SaveDialogOptions,
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

	async writeTextFile(path: string, content: string): Promise<void> {
		await writeTextFile(path, content);
	}

	async confirm(message: string, options?: ConfirmDialogOptions): Promise<boolean> {
		const result = await confirm(message, options);
		return result;
	}
}
