import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { StorageAdapter } from '$lib/adapters/storage';
import type { DayFormType } from '$lib/schemas';
import { clearStore, dumpStore, importStore, _setStorageAdapter } from './store';

// Create a mock storage instance that we'll control
let mockStorageInstance: StorageAdapter;
let storageData: Map<string, unknown>;

describe('store', () => {
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

		it('should clear settings along with entries', async () => {
			storageData.set('day:2025-01-15', { data: 'test' });
			storageData.set('settings:app', { maxTodoList: 5 });

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

		it('should include settings in dump', async () => {
			const testData: [string, unknown][] = [
				['day:2025-01-15', { data: 'day1' }],
				['settings:app', { maxTodoList: 5, maxToRelaxList: 4 }]
			];
			testData.forEach(([key, value]) => storageData.set(key, value));

			const result = await dumpStore();

			expect(result).toHaveLength(2);
			expect(result).toEqual(expect.arrayContaining(testData));
		});
	});

	describe('importStore', () => {
		it('should import new entries', async () => {
			const entries: [string, DayFormType][] = [
				[
					'day:2025-01-15',
					{
						start: {
							mood: { text: '😊', level: 4 },
							grateful: 'Existing',
							desire: '',
							goal: '',
							todoList: [],
							toRelaxList: []
						},
						end: { mood: { text: '😊', level: 4 }, achievements: '' }
					}
				]
			];

			const result = await importStore(entries);

			expect(result).toEqual({ imported: 1, merged: 0, skipped: 0 });
			expect(mockStorageInstance.set).toHaveBeenCalledWith('day:2025-01-15', entries[0][1]);
			expect(mockStorageInstance.save).toHaveBeenCalledOnce();
		});

		it('should count merged entries correctly', async () => {
			const existing: DayFormType = {
				start: {
					mood: { text: '😊', level: 4 },
					grateful: 'Existing',
					desire: '',
					goal: '',
					todoList: [],
					toRelaxList: []
				},
				end: { mood: { text: '😊', level: 4 }, achievements: '' }
			};
			storageData.set('day:2025-01-15', existing);

			const entries: [string, DayFormType][] = [
				[
					'day:2025-01-15',
					{
						start: {
							mood: { text: '😊', level: 4 },
							grateful: 'New',
							desire: '',
							goal: '',
							todoList: [],
							toRelaxList: []
						},
						end: { mood: { text: '😃', level: 4 }, achievements: 'Achievement' }
					}
				]
			];

			const result = await importStore(entries);

			expect(result).toEqual({ imported: 0, merged: 1, skipped: 0 });
			expect(mockStorageInstance.save).toHaveBeenCalledOnce();
		});

		it('should skip invalid entries', async () => {
			const entries: [string, unknown][] = [
				['invalid-key', { data: 'test' }],
				['day:2025-01-15', null],
				[
					'day:2025-01-16',
					{
						start: {
							mood: { text: '😊', level: 4 },
							grateful: '',
							desire: '',
							goal: '',
							todoList: [],
							toRelaxList: []
						},
						end: { mood: { text: '', level: 3 }, achievements: '' }
					}
				]
			];

			const result = await importStore(entries);

			expect(result.skipped).toBeGreaterThan(0);
		});

		it('should import settings', async () => {
			const entries: [string, unknown][] = [
				[
					'settings:app',
					{
						maxTodoList: 5,
						maxToRelaxList: 4,
						maxWeekRoutines: 6,
						maxWeekGoals: 4,
						maxMonthRoutines: 7,
						maxMonthGoals: 4
					}
				]
			];

			const result = await importStore(entries);

			expect(result).toEqual({ imported: 1, merged: 0, skipped: 0 });
			expect(storageData.has('settings:app')).toBe(true);
			const settings = storageData.get('settings:app');
			expect(settings).toEqual({
				maxTodoList: 5,
				maxToRelaxList: 4,
				maxWeekRoutines: 6,
				maxWeekGoals: 4,
				maxMonthRoutines: 7,
				maxMonthGoals: 4
			});
		});

		it('should import both entries and settings together', async () => {
			const entries: [string, unknown][] = [
				[
					'day:2025-01-15',
					{
						start: {
							mood: { text: '😊', level: 4 },
							grateful: 'Test',
							desire: '',
							goal: '',
							todoList: [],
							toRelaxList: []
						},
						end: { mood: { text: '😊', level: 4 }, achievements: '' }
					}
				],
				[
					'settings:app',
					{
						maxTodoList: 10
					}
				]
			];

			const result = await importStore(entries);

			expect(result).toEqual({ imported: 2, merged: 0, skipped: 0 });
			expect(storageData.has('day:2025-01-15')).toBe(true);
			expect(storageData.has('settings:app')).toBe(true);
		});

		it('should overwrite existing settings when importing', async () => {
			// Set existing settings
			storageData.set('settings:app', {
				maxTodoList: 3,
				maxToRelaxList: 3
			});

			const entries: [string, unknown][] = [
				[
					'settings:app',
					{
						maxTodoList: 10,
						maxWeekRoutines: 8
					}
				]
			];

			const result = await importStore(entries);

			expect(result).toEqual({ imported: 1, merged: 0, skipped: 0 });
			const settings = storageData.get('settings:app');
			// Settings should be completely replaced, not merged
			expect(settings).toEqual({
				maxTodoList: 10,
				maxWeekRoutines: 8
			});
		});
	});
});
