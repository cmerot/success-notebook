import { getStorageAdapter, type StorageAdapter } from '$lib/adapters/storage';
import { startOfWeek, type CalendarDate, startOfMonth, parseDate } from '@internationalized/date';
import type { DayFormType, WeekFormType, MonthFormType } from '$lib/schemas';
import { hasContent, type HasContentValue } from '$lib/utils/utils.js';

// Storage adapter instance - lazy initialized or injected for testing
let storagePromise: Promise<StorageAdapter> | null = null;
let injectedStorage: StorageAdapter | null = null;

async function getStorage(): Promise<StorageAdapter> {
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
// Management
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

//
// Load API
//

export async function loadDayEntry(date: CalendarDate): Promise<DayFormType | null> {
	const storage = await getStorage();
	const key = `day:${date.toString()}`;
	const entry = await storage.get<DayFormType>(key);
	return entry ?? null;
}

export async function loadWeekEntry(date: CalendarDate): Promise<WeekFormType | null> {
	const storage = await getStorage();
	const key = `week:${startOfWeek(date, navigator.language).toString()}`;
	const entry = await storage.get<WeekFormType>(key);
	return entry ?? null;
}

export async function loadMonthEntry(date: CalendarDate): Promise<MonthFormType | null> {
	const storage = await getStorage();
	const key = `month:${startOfMonth(date).toString()}`;
	const entry = await storage.get<MonthFormType>(key);
	return entry ?? null;
}

//
// Save API
//

// Helper function to recursively clean empty strings from entries
function cleanEntry<T>(entry: T): T {
	if (typeof entry === 'string') {
		return entry.trim() as T;
	}

	if (Array.isArray(entry)) {
		return entry
			.map((item) => cleanEntry(item))
			.filter((item) => {
				// Remove empty strings
				if (typeof item === 'string') {
					return item.trim() !== '';
				}
				// Remove objects where the text property is empty
				if (typeof item === 'object' && item !== null && 'text' in item) {
					return typeof item.text === 'string' && item.text.trim() !== '';
				}
				return true;
			}) as T;
	}

	if (entry && typeof entry === 'object') {
		const cleaned: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(entry)) {
			cleaned[key] = cleanEntry(value);
		}
		return cleaned as T;
	}

	return entry;
}

export async function saveDayEntry(date: CalendarDate, entry: DayFormType): Promise<void> {
	const storage = await getStorage();
	const key = `day:${date.toString()}`;
	const cleanedEntry = cleanEntry(entry);
	await storage.set(key, cleanedEntry);
	await storage.save();
}

export async function saveWeekEntry(date: CalendarDate, entry: WeekFormType): Promise<void> {
	const storage = await getStorage();
	const key = `week:${startOfWeek(date, navigator.language).toString()}`;
	const cleanedEntry = cleanEntry(entry);
	await storage.set(key, cleanedEntry);
	await storage.save();
}

export async function saveMonthEntry(date: CalendarDate, entry: MonthFormType): Promise<void> {
	const storage = await getStorage();
	const key = `month:${startOfMonth(date).toString()}`;
	const cleanedEntry = cleanEntry(entry);
	await storage.set(key, cleanedEntry);
	await storage.save();
}

//
// Export API
//

export async function getAllEntries(): Promise<
	{
		date: CalendarDate;
		type: 'day' | 'week' | 'month';
		entry: DayFormType | WeekFormType | MonthFormType;
	}[]
> {
	const storage = await getStorage();
	const allEntries = await storage.entries();

	// Sorted by date and none day/week/month entries removed
	const entries: {
		date: CalendarDate;
		type: 'day' | 'week' | 'month';
		entry: DayFormType | WeekFormType | MonthFormType;
	}[] = [];

	for (const [key, value] of allEntries) {
		if (typeof key === 'string') {
			if (key.startsWith('day:')) {
				const dateString = key.replace('day:', '');
				const date = parseDate(dateString);
				entries.push({ date, type: 'day', entry: value as DayFormType });
			} else if (key.startsWith('week:')) {
				const dateString = key.replace('week:', '');
				const date = parseDate(dateString);
				entries.push({ date, type: 'week', entry: value as WeekFormType });
			} else if (key.startsWith('month:')) {
				const dateString = key.replace('month:', '');
				const date = parseDate(dateString);
				entries.push({ date, type: 'month', entry: value as MonthFormType });
			}
		}
	}

	// Sort by date using compare method, then by type (month < week < day)
	entries.sort((a, b) => {
		const dateCompare = a.date.compare(b.date);
		if (dateCompare !== 0) {
			return dateCompare;
		}

		// If dates are equal, sort by type: month < week < day
		const typeOrder = { month: 0, week: 1, day: 2 };
		return typeOrder[a.type] - typeOrder[b.type];
	});

	// Filter out empty entries
	return entries.filter((e) => hasContent(e.entry));
}
