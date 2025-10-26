import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { StorageAdapter } from '$lib/adapters/storage';
import { loadSettings, saveSettings, resetSettings, DEFAULT_SETTINGS } from './settings';

// Mock the storage adapter module
vi.mock('$lib/adapters/storage', () => ({
	getStorageAdapter: vi.fn()
}));

import { getStorageAdapter } from '$lib/adapters/storage';

let mockStorageInstance: StorageAdapter;
let storageData: Map<string, unknown>;

describe('settings', () => {
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

		// Mock getStorageAdapter to return our mock instance
		vi.mocked(getStorageAdapter).mockResolvedValue(mockStorageInstance);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('loadSettings', () => {
		it('should return default settings when no settings are stored', async () => {
			const result = await loadSettings();

			expect(mockStorageInstance.get).toHaveBeenCalledWith('settings:app');
			expect(result).toEqual(DEFAULT_SETTINGS);
		});

		it('should return stored settings merged with defaults', async () => {
			const storedSettings = {
				maxTodoList: 5,
				maxToRelaxList: 4
			};
			storageData.set('settings:app', storedSettings);

			const result = await loadSettings();

			expect(result).toEqual({
				...DEFAULT_SETTINGS,
				maxTodoList: 5,
				maxToRelaxList: 4
			});
		});

		it('should preserve default values for missing properties', async () => {
			const storedSettings = {
				maxTodoList: 10
			};
			storageData.set('settings:app', storedSettings);

			const result = await loadSettings();

			expect(result.maxTodoList).toBe(10);
			expect(result.maxToRelaxList).toBe(DEFAULT_SETTINGS.maxToRelaxList);
			expect(result.maxWeekRoutines).toBe(DEFAULT_SETTINGS.maxWeekRoutines);
			expect(result.maxWeekGoals).toBe(DEFAULT_SETTINGS.maxWeekGoals);
			expect(result.maxMonthRoutines).toBe(DEFAULT_SETTINGS.maxMonthRoutines);
			expect(result.maxMonthGoals).toBe(DEFAULT_SETTINGS.maxMonthGoals);
		});
	});

	describe('saveSettings', () => {
		it('should save new settings', async () => {
			const newSettings = {
				maxTodoList: 5,
				maxToRelaxList: 4
			};

			await saveSettings(newSettings);

			expect(mockStorageInstance.set).toHaveBeenCalledWith(
				'settings:app',
				expect.objectContaining({
					maxTodoList: 5,
					maxToRelaxList: 4
				})
			);
			expect(mockStorageInstance.save).toHaveBeenCalledOnce();
		});

		it('should merge partial settings with existing settings', async () => {
			const existingSettings = {
				maxTodoList: 5,
				maxToRelaxList: 4,
				maxWeekRoutines: 6,
				maxWeekGoals: 3,
				maxMonthRoutines: 5,
				maxMonthGoals: 3,
				emoticonTheme: 'smiley'
			};
			storageData.set('settings:app', existingSettings);

			await saveSettings({ maxTodoList: 10 });

			const savedSettings = storageData.get('settings:app');
			expect(savedSettings).toEqual({
				maxTodoList: 10,
				maxToRelaxList: 4,
				maxWeekRoutines: 6,
				maxWeekGoals: 3,
				maxMonthRoutines: 5,
				maxMonthGoals: 3,
				emoticonTheme: 'smiley'
			});
		});

		it('should preserve defaults when saving partial settings with no existing settings', async () => {
			await saveSettings({ maxTodoList: 10 });

			const savedSettings = storageData.get('settings:app');
			expect(savedSettings).toEqual({
				...DEFAULT_SETTINGS,
				maxTodoList: 10
			});
		});

		it('should handle multiple property updates', async () => {
			await saveSettings({
				maxTodoList: 8,
				maxWeekRoutines: 10,
				maxMonthGoals: 5
			});

			const savedSettings = storageData.get('settings:app');
			expect(savedSettings).toEqual({
				...DEFAULT_SETTINGS,
				maxTodoList: 8,
				maxWeekRoutines: 10,
				maxMonthGoals: 5
			});
		});
	});

	describe('resetSettings', () => {
		it('should delete settings from storage', async () => {
			storageData.set('settings:app', { maxTodoList: 5 });

			await resetSettings();

			expect(mockStorageInstance.delete).toHaveBeenCalledWith('settings:app');
			expect(mockStorageInstance.save).toHaveBeenCalledOnce();
		});

		it('should result in default settings being returned after reset', async () => {
			// Save custom settings
			await saveSettings({ maxTodoList: 10 });
			expect(storageData.has('settings:app')).toBe(true);

			// Reset settings
			await resetSettings();
			expect(storageData.has('settings:app')).toBe(false);

			// Load settings should return defaults
			const result = await loadSettings();
			expect(result).toEqual(DEFAULT_SETTINGS);
		});
	});

	describe('DEFAULT_SETTINGS', () => {
		it('should have all required properties', () => {
			expect(DEFAULT_SETTINGS).toHaveProperty('maxTodoList');
			expect(DEFAULT_SETTINGS).toHaveProperty('maxToRelaxList');
			expect(DEFAULT_SETTINGS).toHaveProperty('maxWeekRoutines');
			expect(DEFAULT_SETTINGS).toHaveProperty('maxWeekGoals');
			expect(DEFAULT_SETTINGS).toHaveProperty('maxMonthRoutines');
			expect(DEFAULT_SETTINGS).toHaveProperty('maxMonthGoals');
		});

		it('should have sensible default values', () => {
			expect(DEFAULT_SETTINGS.maxTodoList).toBeGreaterThan(0);
			expect(DEFAULT_SETTINGS.maxToRelaxList).toBeGreaterThan(0);
			expect(DEFAULT_SETTINGS.maxWeekRoutines).toBeGreaterThan(0);
			expect(DEFAULT_SETTINGS.maxWeekGoals).toBeGreaterThan(0);
			expect(DEFAULT_SETTINGS.maxMonthRoutines).toBeGreaterThan(0);
			expect(DEFAULT_SETTINGS.maxMonthGoals).toBeGreaterThan(0);
		});
	});
});
