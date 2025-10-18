/**
 * Storage adapter interface
 * Provides a unified API for persistent key-value storage
 * that works in both Tauri and web environments
 */
export interface StorageAdapter {
	/**
	 * Get a value from storage
	 * @param key The key to retrieve
	 * @returns The value associated with the key, or null if not found
	 */
	get<T>(key: string): Promise<T | null>;

	/**
	 * Set a value in storage
	 * @param key The key to set
	 * @param value The value to store
	 */
	set<T>(key: string, value: T): Promise<void>;

	/**
	 * Remove a key from storage
	 * @param key The key to remove
	 */
	delete(key: string): Promise<void>;

	/**
	 * Clear all entries from storage
	 */
	clear(): Promise<void>;

	/**
	 * Get all entries from storage
	 * @returns Array of [key, value] tuples
	 */
	entries(): Promise<Array<[string, unknown]>>;

	/**
	 * Save/persist changes to storage
	 * (No-op for some storage backends that auto-save)
	 */
	save(): Promise<void>;
}
