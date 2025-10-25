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
