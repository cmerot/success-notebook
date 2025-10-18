import type { StorageAdapter } from './interface';

/**
 * Web storage adapter using IndexedDB
 * Provides persistent browser-based storage for web apps
 */
export class WebStorageAdapter implements StorageAdapter {
	private dbName: string;
	private storeName = 'keyvalue';
	private dbPromise: Promise<IDBDatabase>;

	constructor(dbName: string = 'success-notebook') {
		this.dbName = dbName;
		this.dbPromise = this.initDB();
	}

	private initDB(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, 1);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve(request.result);

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;
				if (!db.objectStoreNames.contains(this.storeName)) {
					db.createObjectStore(this.storeName);
				}
			};
		});
	}

	private async getDB(): Promise<IDBDatabase> {
		return await this.dbPromise;
	}

	private async performTransaction<T>(
		mode: IDBTransactionMode,
		callback: (store: IDBObjectStore) => IDBRequest<T>
	): Promise<T> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(this.storeName, mode);
			const store = transaction.objectStore(this.storeName);
			const request = callback(store);

			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	async get<T>(key: string): Promise<T | null> {
		const value = await this.performTransaction('readonly', (store) => store.get(key));
		return value !== undefined ? (value as T) : null;
	}

	async set<T>(key: string, value: T): Promise<void> {
		await this.performTransaction('readwrite', (store) => store.put(value, key));
	}

	async delete(key: string): Promise<void> {
		await this.performTransaction('readwrite', (store) => store.delete(key));
	}

	async clear(): Promise<void> {
		await this.performTransaction('readwrite', (store) => store.clear());
	}

	async entries(): Promise<Array<[string, unknown]>> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(this.storeName, 'readonly');
			const store = transaction.objectStore(this.storeName);
			const request = store.openCursor();
			const entries: Array<[string, unknown]> = [];

			request.onsuccess = (event) => {
				const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
				if (cursor) {
					entries.push([cursor.key as string, cursor.value]);
					cursor.continue();
				} else {
					resolve(entries);
				}
			};

			request.onerror = () => reject(request.error);
		});
	}

	async save(): Promise<void> {
		// IndexedDB auto-saves, so this is a no-op
		// Kept for interface compatibility
	}
}
