import { getStorageAdapter, type StorageAdapter } from '$lib/adapters/storage';
import { hasContent, type HasContentValue } from '$lib/utils/utils.js';
import { mergeEntries } from './entries';

// Storage adapter instance - lazy initialized or injected for testing
let storagePromise: Promise<StorageAdapter> | null = null;
let injectedStorage: StorageAdapter | null = null;

export async function getStorage(): Promise<StorageAdapter> {
	// If storage was injected (for testing), use it
	if (injectedStorage) {
		return injectedStorage;
	}

	// Otherwise, lazy initialize the real storage adapter
	if (!storagePromise) {
		storagePromise = getStorageAdapter();
	}
	return await storagePromise;
}

/**
 * Inject a storage adapter for testing purposes.
 * ONLY use this in tests - it bypasses the normal storage initialization.
 * @param adapter - The storage adapter to inject, or null to reset
 */
export function _setStorageAdapter(adapter: StorageAdapter | null): void {
	injectedStorage = adapter;
	// Reset the promise when injecting to ensure clean state
	if (adapter) {
		storagePromise = null;
	}
}

//
// Store Management
//

export async function clearStore(): Promise<void> {
	const storage = await getStorage();
	await storage.clear();
}

export async function dumpStore() {
	const storage = await getStorage();
	return await storage.entries();
}

export async function importStore(
	entries: [string, unknown][]
): Promise<{ imported: number; merged: number; skipped: number }> {
	const storage = await getStorage();
	let imported = 0;
	let merged = 0;
	let skipped = 0;

	for (const [key, value] of entries) {
		// Validate key is a string
		if (typeof key !== 'string') {
			skipped++;
			continue;
		}

		// Handle settings separately
		if (key.startsWith('settings:')) {
			// Settings are imported directly without merging
			await storage.set(key, value);
			imported++;
			continue;
		}

		// Handle entries (day/week/month)
		if (key.startsWith('day:') || key.startsWith('week:') || key.startsWith('month:')) {
			// Skip invalid entries
			if (!hasContent(value as HasContentValue)) {
				skipped++;
				continue;
			}

			const existing = await storage.get<typeof value>(key);

			if (existing) {
				// Merge with existing entry
				const mergedEntry = mergeEntries(existing, value);
				await storage.set(key, mergedEntry);
				merged++;
			} else {
				// Import as new entry
				await storage.set(key, value);
				imported++;
			}
			continue;
		}

		// Skip unknown key types
		skipped++;
	}

	await storage.save();
	return { imported, merged, skipped };
}
