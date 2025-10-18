import { Store } from '@tauri-apps/plugin-store';
import type { StorageAdapter } from './interface';

/**
 * Tauri storage adapter using @tauri-apps/plugin-store
 * Provides persistent file-based storage for desktop apps
 */
export class TauriStorageAdapter implements StorageAdapter {
	private storePromise: Promise<Store>;

	constructor(fileName: string = 'success-notebook.json') {
		this.storePromise = Store.load(fileName);
	}

	private async getStore(): Promise<Store> {
		return await this.storePromise;
	}

	async get<T>(key: string): Promise<T | null> {
		const store = await this.getStore();
		const value = await store.get<T>(key);
		return value ?? null;
	}

	async set<T>(key: string, value: T): Promise<void> {
		const store = await this.getStore();
		await store.set(key, value);
	}

	async delete(key: string): Promise<void> {
		const store = await this.getStore();
		await store.delete(key);
	}

	async clear(): Promise<void> {
		const store = await this.getStore();
		await store.clear();
	}

	async entries(): Promise<Array<[string, unknown]>> {
		const store = await this.getStore();
		return await store.entries();
	}

	async save(): Promise<void> {
		const store = await this.getStore();
		await store.save();
	}
}
