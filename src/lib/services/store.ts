import { getStorageAdapter, type StorageAdapter } from '$lib/adapters/storage';
import type { DayFormType, WeekFormType, MonthFormType } from '$lib/schemas';
import { hasContent, type HasContentValue } from '$lib/utils/utils.js';

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

// Helper type guard for objects with text property
function hasTextProperty(value: unknown): value is { text: unknown } {
	return value !== null && typeof value === 'object' && 'text' in value;
}

// Helper function to merge two entries, preferring non-empty values from the new entry
function mergeEntries<T>(existing: T, imported: T): T {
	// If either is null/undefined, return the other
	if (existing === null || existing === undefined) return imported;
	if (imported === null || imported === undefined) return existing;

	// For strings, prefer non-empty imported value
	if (typeof existing === 'string' && typeof imported === 'string') {
		return imported.trim() !== '' ? imported : existing;
	}

	// For arrays, merge and deduplicate
	if (Array.isArray(existing) && Array.isArray(imported)) {
		const merged = [...existing];
		for (const item of imported) {
			// For objects with text property, check for duplicates
			if (hasTextProperty(item)) {
				const itemText = item.text;
				const existingItem = merged.find((m) => {
					return hasTextProperty(m) && m.text === itemText;
				});
				if (!existingItem && hasContent(item as HasContentValue)) {
					merged.push(item);
				}
			} else if (hasContent(item as HasContentValue) && !merged.includes(item)) {
				merged.push(item);
			}
		}
		return merged as T;
	}

	// For objects, merge recursively
	if (existing && typeof existing === 'object' && imported && typeof imported === 'object') {
		const merged = { ...existing } as Record<string, unknown>;
		for (const [key, value] of Object.entries(imported as Record<string, unknown>)) {
			if (key in merged) {
				merged[key] = mergeEntries(merged[key], value);
			} else {
				merged[key] = value;
			}
		}
		return merged as T;
	}

	// For other types, prefer imported value if not empty
	return hasContent(imported as HasContentValue) ? imported : existing;
}

export async function importStore(
	entries: [string, DayFormType | WeekFormType | MonthFormType][]
): Promise<{ imported: number; merged: number; skipped: number }> {
	const storage = await getStorage();
	let imported = 0;
	let merged = 0;
	let skipped = 0;

	for (const [key, value] of entries) {
		// Skip non-entry keys or invalid entries
		if (
			typeof key !== 'string' ||
			(!key.startsWith('day:') && !key.startsWith('week:') && !key.startsWith('month:')) ||
			!hasContent(value as HasContentValue)
		) {
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
	}

	await storage.save();
	return { imported, merged, skipped };
}
