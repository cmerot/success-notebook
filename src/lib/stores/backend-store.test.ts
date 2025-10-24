import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CalendarDate } from '@internationalized/date';
import type { StorageAdapter } from '$lib/adapters/storage';
import type { DayFormType, WeekFormType, MonthFormType } from '$lib/schemas';
import {
	clearStore,
	dumpStore,
	importStore,
	loadDayEntry,
	loadWeekEntry,
	loadMonthEntry,
	saveDayEntry,
	saveWeekEntry,
	saveMonthEntry,
	getAllEntries,
	_setStorageAdapter
} from './backend-store';

// Create a mock storage instance that we'll control
let mockStorageInstance: StorageAdapter;
let storageData: Map<string, unknown>;

describe('backend-store', () => {
	beforeEach(() => {
		// Reset storage data
		storageData = new Map();

		// Create mock storage adapter
		mockStorageInstance = {
			get: vi.fn(async (key: string) => {
				const value = storageData.get(key);
				return value !== undefined ? value : null;
			}),
			set: vi.fn(async (key: string, value: unknown) => {
				storageData.set(key, value);
			}),
			delete: vi.fn(async (key: string) => {
				storageData.delete(key);
			}),
			clear: vi.fn(async () => {
				storageData.clear();
			}),
			entries: vi.fn(async () => Array.from(storageData.entries())),
			save: vi.fn(async () => {})
		} as StorageAdapter;

		// Inject the mock storage adapter
		_setStorageAdapter(mockStorageInstance);
	});

	afterEach(() => {
		// Reset the injected storage
		_setStorageAdapter(null);
		vi.clearAllMocks();
	});

	describe('clearStore', () => {
		it('should clear all entries from storage', async () => {
			storageData.set('day:2025-01-15', { data: 'test' });
			storageData.set('week:2025-01-13', { data: 'test' });

			await clearStore();

			expect(mockStorageInstance.clear).toHaveBeenCalledOnce();
			expect(storageData.size).toBe(0);
		});
	});

	describe('dumpStore', () => {
		it('should return all entries from storage', async () => {
			const testData: [string, unknown][] = [
				['day:2025-01-15', { data: 'day1' }],
				['week:2025-01-13', { data: 'week1' }]
			];
			testData.forEach(([key, value]) => storageData.set(key, value));

			const result = await dumpStore();

			expect(mockStorageInstance.entries).toHaveBeenCalledOnce();
			expect(result).toHaveLength(2);
			expect(result).toEqual(expect.arrayContaining(testData));
		});

		it('should return empty array when storage is empty', async () => {
			const result = await dumpStore();

			expect(result).toEqual([]);
		});
	});

	describe('loadDayEntry', () => {
		it('should load a day entry by date', async () => {
			const date = new CalendarDate(2025, 1, 15);
			const entry: DayFormType = {
				start: {
					mood: { text: '😊', icon: 'smile' },
					grateful: 'Test',
					desire: '',
					goal: '',
					todoList: [],
					toRelaxList: []
				},
				end: {
					mood: { text: '😊', icon: 'smile' },
					achievements: ''
				}
			};
			storageData.set('day:2025-01-15', entry);

			const result = await loadDayEntry(date);

			expect(mockStorageInstance.get).toHaveBeenCalledWith('day:2025-01-15');
			expect(result).toEqual(entry);
		});

		it('should return null when entry does not exist', async () => {
			const date = new CalendarDate(2025, 1, 15);

			const result = await loadDayEntry(date);

			expect(result).toBeNull();
		});
	});

	describe('loadWeekEntry', () => {
		it('should load a week entry by date', async () => {
			const date = new CalendarDate(2025, 1, 15);
			const entry: WeekFormType = {
				start: {
					mantra: 'Weekly mantra',
					routines: [],
					goals: []
				},
				end: { achievements: '' }
			};
			// Week starting depends on locale
			// For en-US locale (Sunday start): 2025-01-12
			// For other locales (Monday start): 2025-01-13
			storageData.set('week:2025-01-12', entry);

			const result = await loadWeekEntry(date);

			expect(mockStorageInstance.get).toHaveBeenCalledWith('week:2025-01-12');
			expect(result).toEqual(entry);
		});

		it('should return null when entry does not exist', async () => {
			const date = new CalendarDate(2025, 1, 15);

			const result = await loadWeekEntry(date);

			expect(result).toBeNull();
		});
	});

	describe('loadMonthEntry', () => {
		it('should load a month entry by date', async () => {
			const date = new CalendarDate(2025, 1, 15);
			const entry: MonthFormType = {
				start: {
					mantra: 'Monthly mantra',
					routines: [],
					goals: []
				},
				end: { achievements: '' }
			};
			storageData.set('month:2025-01-01', entry);

			const result = await loadMonthEntry(date);

			expect(mockStorageInstance.get).toHaveBeenCalledWith('month:2025-01-01');
			expect(result).toEqual(entry);
		});

		it('should return null when entry does not exist', async () => {
			const date = new CalendarDate(2025, 1, 15);

			const result = await loadMonthEntry(date);

			expect(result).toBeNull();
		});
	});

	describe('saveDayEntry', () => {
		it('should save a day entry with cleaned data', async () => {
			const date = new CalendarDate(2025, 1, 15);
			const entry: DayFormType = {
				start: {
					mood: { text: '😊', icon: 'smile' },
					grateful: '  Test  ',
					desire: '',
					goal: '',
					todoList: [{ text: 'Task 1', completed: false }],
					toRelaxList: []
				},
				end: {
					mood: { text: '😊', icon: 'smile' },
					achievements: ''
				}
			};

			await saveDayEntry(date, entry);

			expect(mockStorageInstance.set).toHaveBeenCalledWith(
				'day:2025-01-15',
				expect.objectContaining({
					start: expect.objectContaining({
						grateful: 'Test' // Whitespace trimmed
					})
				})
			);
			expect(mockStorageInstance.save).toHaveBeenCalledOnce();
		});

		it('should remove empty items from arrays when cleaning', async () => {
			const date = new CalendarDate(2025, 1, 15);
			const entry: DayFormType = {
				start: {
					mood: { text: '😊', icon: 'smile' },
					grateful: '',
					desire: '',
					goal: '',
					todoList: [
						{ text: 'Valid task', completed: false },
						{ text: '', completed: false },
						{ text: '  ', completed: true }
					],
					toRelaxList: []
				},
				end: {
					mood: { text: '😊', icon: 'smile' },
					achievements: ''
				}
			};

			await saveDayEntry(date, entry);

			const savedEntry = storageData.get('day:2025-01-15') as DayFormType;
			// Empty and whitespace-only tasks should be removed
			expect(savedEntry.start.todoList).toHaveLength(1);
			expect(savedEntry.start.todoList[0].text).toBe('Valid task');
		});
	});

	describe('saveWeekEntry', () => {
		it('should save a week entry', async () => {
			const date = new CalendarDate(2025, 1, 15);
			const entry: WeekFormType = {
				start: {
					mantra: 'Week mantra',
					routines: [],
					goals: []
				},
				end: { achievements: '' }
			};

			await saveWeekEntry(date, entry);

			expect(mockStorageInstance.set).toHaveBeenCalledWith('week:2025-01-12', entry);
			expect(mockStorageInstance.save).toHaveBeenCalledOnce();
		});
	});

	describe('saveMonthEntry', () => {
		it('should save a month entry', async () => {
			const date = new CalendarDate(2025, 1, 15);
			const entry: MonthFormType = {
				start: {
					mantra: 'Month mantra',
					routines: [],
					goals: []
				},
				end: { achievements: '' }
			};

			await saveMonthEntry(date, entry);

			expect(mockStorageInstance.set).toHaveBeenCalledWith('month:2025-01-01', entry);
			expect(mockStorageInstance.save).toHaveBeenCalledOnce();
		});
	});

	describe('importStore', () => {
		it('should import new entries', async () => {
			const entries: [string, DayFormType][] = [
				[
					'day:2025-01-15',
					{
						start: {
							mood: { text: '😊', icon: 'smile' },
							grateful: 'Existing',
							desire: '',
							goal: '',
							todoList: [],
							toRelaxList: []
						},
						end: { mood: { text: '😊', icon: 'smile' }, achievements: '' }
					}
				]
			];

			const result = await importStore(entries);

			expect(result).toEqual({ imported: 1, merged: 0, skipped: 0 });
			expect(mockStorageInstance.set).toHaveBeenCalledWith('day:2025-01-15', entries[0][1]);
			expect(mockStorageInstance.save).toHaveBeenCalledOnce();
		});

		it('should merge with existing entries', async () => {
			const existing: DayFormType = {
				start: {
					mood: { text: '😊', icon: 'smile' },
					grateful: 'Existing',
					desire: '',
					goal: '',
					todoList: [],
					toRelaxList: []
				},
				end: { mood: { text: '😊', icon: 'smile' }, achievements: '' }
			};
			storageData.set('day:2025-01-15', existing);

			const entries: [string, DayFormType][] = [
				[
					'day:2025-01-15',
					{
						start: {
							mood: { text: '😊', icon: 'smile' },
							grateful: 'New',
							desire: '',
							goal: '',
							todoList: [],
							toRelaxList: []
						},
						end: { mood: { text: '😃', icon: 'happy' }, achievements: 'Achievement' }
					}
				]
			];

			const result = await importStore(entries);

			expect(result).toEqual({ imported: 0, merged: 1, skipped: 0 });
			const savedEntry = storageData.get('day:2025-01-15') as DayFormType;
			// New non-empty values should override existing
			expect(savedEntry.start.grateful).toBe('New');
			expect(savedEntry.end.achievements).toBe('Achievement');
		});

		it('should skip invalid entries', async () => {
			const entries: [string, unknown][] = [
				['invalid-key', { data: 'test' }],
				['day:2025-01-15', null],
				[
					'day:2025-01-16',
					{
						start: {
							mood: { text: '😊', icon: 'smile' },
							grateful: '',
							desire: '',
							goal: '',
							todoList: [],
							toRelaxList: []
						},
						end: { mood: { text: '', icon: '' }, achievements: '' }
					}
				]
			];

			const result = await importStore(entries as [string, DayFormType][]);

			expect(result.skipped).toBeGreaterThan(0);
		});

		it('should merge arrays without duplicates', async () => {
			const existing: DayFormType = {
				start: {
					mood: { text: '😊', icon: 'smile' },
					grateful: '',
					desire: '',
					goal: '',
					todoList: [
						{ text: 'Existing task', completed: false },
						{ text: 'Common task', completed: false }
					],
					toRelaxList: []
				},
				end: { mood: { text: '', icon: '' }, achievements: '' }
			};
			storageData.set('day:2025-01-15', existing);

			const entries: [string, DayFormType][] = [
				[
					'day:2025-01-15',
					{
						start: {
							mood: { text: '😊', icon: 'smile' },
							grateful: '',
							desire: '',
							goal: '',
							todoList: [
								{ text: 'Common task', completed: false },
								{ text: 'New task', completed: false }
							],
							toRelaxList: []
						},
						end: { mood: { text: '', icon: '' }, achievements: '' }
					}
				]
			];

			const result = await importStore(entries);

			expect(result).toEqual({ imported: 0, merged: 1, skipped: 0 });
			const savedEntry = storageData.get('day:2025-01-15') as DayFormType;
			// Should have all 3 tasks without duplicating "Common task"
			expect(savedEntry.start.todoList).toHaveLength(3);
			const texts = savedEntry.start.todoList.map((t) => t.text);
			expect(texts).toContain('Existing task');
			expect(texts).toContain('Common task');
			expect(texts).toContain('New task');
		});
	});

	describe('getAllEntries', () => {
		it('should return all entries sorted by date and type', async () => {
			const dayEntry: DayFormType = {
				start: {
					mood: { text: '😊', icon: 'smile' },
					grateful: 'Test',
					desire: '',
					goal: '',
					todoList: [],
					toRelaxList: []
				},
				end: { mood: { text: '', icon: '' }, achievements: '' }
			};

			const weekEntry: WeekFormType = {
				start: {
					mantra: 'Week mantra',
					routines: [],
					goals: []
				},
				end: { achievements: '' }
			};

			const monthEntry: MonthFormType = {
				start: {
					mantra: 'Month mantra',
					routines: [],
					goals: []
				},
				end: { achievements: '' }
			};

			storageData.set('day:2025-01-15', dayEntry);
			storageData.set('week:2025-01-12', weekEntry);
			storageData.set('month:2025-01-01', monthEntry);
			storageData.set('other:key', { data: 'test' }); // Should be filtered out

			const result = await getAllEntries();

			expect(result).toHaveLength(3);
			// Verify sorting: month < week < day for same date, and by date
			expect(result[0].type).toBe('month');
			expect(result[1].type).toBe('week');
			expect(result[2].type).toBe('day');
		});

		it('should filter out entries without content', async () => {
			const emptyEntry: DayFormType = {
				start: {
					mood: { text: '', icon: '' },
					grateful: '',
					desire: '',
					goal: '',
					todoList: [],
					toRelaxList: []
				},
				end: { mood: { text: '', icon: '' }, achievements: '' }
			};

			const validEntry: DayFormType = {
				start: {
					mood: { text: '😊', icon: 'smile' },
					grateful: 'Something',
					desire: '',
					goal: '',
					todoList: [],
					toRelaxList: []
				},
				end: { mood: { text: '', icon: '' }, achievements: '' }
			};

			storageData.set('day:2025-01-15', emptyEntry);
			storageData.set('day:2025-01-16', validEntry);

			const result = await getAllEntries();

			expect(result).toHaveLength(1);
			expect(result[0].date.toString()).toBe('2025-01-16');
		});

		it('should return empty array when no entries exist', async () => {
			const result = await getAllEntries();

			expect(result).toEqual([]);
		});

		it('should handle multiple entries on the same date', async () => {
			// This shouldn't normally happen, but test the sorting logic
			const dayEntry: DayFormType = {
				start: {
					mood: { text: '😊', icon: 'smile' },
					grateful: 'Day',
					desire: '',
					goal: '',
					todoList: [],
					toRelaxList: []
				},
				end: { mood: { text: '', icon: '' }, achievements: '' }
			};

			const weekEntry: WeekFormType = {
				start: {
					mantra: 'Week mantra',
					routines: [],
					goals: [{ text: 'Goal', completion: 0 }]
				},
				end: { achievements: '' }
			};

			storageData.set('day:2025-01-13', dayEntry);
			storageData.set('week:2025-01-13', weekEntry);

			const result = await getAllEntries();

			expect(result).toHaveLength(2);
			// For same date: week should come before day
			expect(result[0].type).toBe('week');
			expect(result[1].type).toBe('day');
		});

		it('should handle entries with only end section content', async () => {
			const entryWithEndOnly: DayFormType = {
				start: {
					mood: { text: '', icon: '' },
					grateful: '',
					desire: '',
					goal: '',
					todoList: [],
					toRelaxList: []
				},
				end: { mood: { text: '', icon: '' }, achievements: 'Completed something' }
			};

			storageData.set('day:2025-01-15', entryWithEndOnly);

			const result = await getAllEntries();

			expect(result).toHaveLength(1);
			expect(result[0].entry).toEqual(entryWithEndOnly);
		});
	});

	describe('mergeEntries behavior', () => {
		it('should prefer non-empty strings from imported entry', async () => {
			const existing: DayFormType = {
				start: {
					mood: { text: '😊', icon: 'smile' },
					grateful: '',
					desire: '',
					goal: '',
					todoList: [],
					toRelaxList: []
				},
				end: { mood: { text: '', icon: '' }, achievements: '' }
			};
			storageData.set('day:2025-01-15', existing);

			const entries: [string, DayFormType][] = [
				[
					'day:2025-01-15',
					{
						start: {
							mood: { text: '😃', icon: 'happy' },
							grateful: 'New grateful',
							desire: '',
							goal: '',
							todoList: [],
							toRelaxList: []
						},
						end: { mood: { text: '', icon: '' }, achievements: 'New achievement' }
					}
				]
			];

			await importStore(entries);

			const savedEntry = storageData.get('day:2025-01-15') as DayFormType;
			expect(savedEntry.start.grateful).toBe('New grateful');
			expect(savedEntry.end.achievements).toBe('New achievement');
		});

		it('should keep existing non-empty strings when imported is empty', async () => {
			const existing: DayFormType = {
				start: {
					mood: { text: '😊', icon: 'smile' },
					grateful: 'Keep this',
					desire: '',
					goal: '',
					todoList: [],
					toRelaxList: []
				},
				end: { mood: { text: '', icon: '' }, achievements: '' }
			};
			storageData.set('day:2025-01-15', existing);

			const entries: [string, DayFormType][] = [
				[
					'day:2025-01-15',
					{
						start: {
							mood: { text: '😊', icon: 'smile' },
							grateful: '',
							desire: '',
							goal: '',
							todoList: [],
							toRelaxList: []
						},
						end: { mood: { text: '', icon: '' }, achievements: '' }
					}
				]
			];

			await importStore(entries);

			const savedEntry = storageData.get('day:2025-01-15') as DayFormType;
			expect(savedEntry.start.grateful).toBe('Keep this');
		});
	});
});
