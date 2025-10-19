import { getStorageAdapter, type StorageAdapter } from '$lib/adapters/storage';
import { startOfWeek, type CalendarDate, startOfMonth, parseDate } from '@internationalized/date';
import type { DayFormType, WeekFormType, MonthFormType } from '$lib/schemas';

// Initialize the storage adapter - automatically selects Tauri or Web implementation
const storagePromise = getStorageAdapter();

async function getStorage(): Promise<StorageAdapter> {
	return await storagePromise;
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

// Helper function to check if an entry is empty (has no meaningful content)
export function isEntryEmpty<T>(entry: T): boolean {
	// Null or undefined is empty
	if (entry === null || entry === undefined) {
		return true;
	}

	// Empty string (after trim) is empty
	if (typeof entry === 'string') {
		return entry.trim() === '';
	}

	// Empty array is empty
	if (Array.isArray(entry)) {
		// Array is empty if it has no items, or all items are empty
		return entry.length === 0 || entry.every((item) => isEntryEmpty(item));
	}

	// For objects
	if (typeof entry === 'object') {
		// Objects with a 'text' property are empty if text is empty
		if ('text' in entry) {
			return typeof entry.text === 'string' && entry.text.trim() === '';
		}

		// Objects are empty if all their values are empty
		return Object.values(entry).every((value) => isEntryEmpty(value));
	}

	// Other types (numbers, booleans) are not empty
	return false;
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
		url: string;
		type: 'day' | 'week' | 'month';
		entry: DayFormType | WeekFormType | MonthFormType;
	}[]
> {
	const storage = await getStorage();
	const allEntries = await storage.entries();

	// Sorted by date and none day/week/month entries removed
	const entries: {
		date: CalendarDate;
		url: string;
		type: 'day' | 'week' | 'month';
		entry: DayFormType | WeekFormType | MonthFormType;
	}[] = [];

	for (const [key, value] of allEntries) {
		if (typeof key === 'string') {
			if (key.startsWith('day:')) {
				const dateString = key.replace('day:', '');
				const date = parseDate(dateString);
				const url = `${date.year}/${String(date.month).padStart(2, '0')}/${String(date.day).padStart(2, '0')}`;
				entries.push({ date, url, type: 'day', entry: value as DayFormType });
			} else if (key.startsWith('week:')) {
				const dateString = key.replace('week:', '');
				const date = parseDate(dateString);
				const url = `${date.year}/${String(date.month).padStart(2, '0')}/${String(date.day).padStart(2, '0')}/week`;
				entries.push({ date, url, type: 'week', entry: value as WeekFormType });
			} else if (key.startsWith('month:')) {
				const dateString = key.replace('month:', '');
				const date = parseDate(dateString);
				const url = `${date.year}/${String(date.month).padStart(2, '0')}/${String(date.day).padStart(2, '0')}/month`;
				entries.push({ date, url, type: 'month', entry: value as MonthFormType });
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
	return entries.filter((e) => !isEntryEmpty(e.entry));
}
