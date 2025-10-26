import { getStorageAdapter } from '$lib/adapters/storage';
import type { EmoticonThemeName } from '$lib/components/form/emoticon';

export interface AppSettings {
	maxTodoList: number;
	maxToRelaxList: number;
	maxWeekRoutines: number;
	maxWeekGoals: number;
	maxMonthRoutines: number;
	maxMonthGoals: number;
	emoticonTheme: EmoticonThemeName;
}

export const DEFAULT_SETTINGS: AppSettings = {
	maxTodoList: 3,
	maxToRelaxList: 3,
	maxWeekRoutines: 4,
	maxWeekGoals: 3,
	maxMonthRoutines: 5,
	maxMonthGoals: 3,
	emoticonTheme: 'smiley'
};

const SETTINGS_KEY = 'settings:app';

export async function loadSettings(): Promise<AppSettings> {
	const storage = await getStorageAdapter();
	const settings = await storage.get<AppSettings>(SETTINGS_KEY);
	return settings ? { ...DEFAULT_SETTINGS, ...settings } : DEFAULT_SETTINGS;
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
	const storage = await getStorageAdapter();
	const current = await loadSettings();
	const updated = { ...current, ...settings };
	await storage.set(SETTINGS_KEY, updated);
	await storage.save();
}

export async function resetSettings(): Promise<void> {
	const storage = await getStorageAdapter();
	await storage.delete(SETTINGS_KEY);
	await storage.save();
}
