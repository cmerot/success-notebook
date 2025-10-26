import { page } from '$app/state';

export const emoticonThemes = {
	smiley: {
		1: '😢',
		2: '😞',
		3: '😐',
		4: '😊',
		5: '😁'
	},
	weather: {
		1: '⛈️',
		2: '🌧️',
		3: '☁️',
		4: '🌤️',
		5: '☀️'
	}
} as const;

export type EmoticonTheme = keyof typeof emoticonThemes;
export type MoodLevel = 1 | 2 | 3 | 4 | 5;
export type LevelEmoticons = (typeof emoticonThemes)[EmoticonTheme];

export function getLevelEmoticons(theme?: EmoticonTheme): LevelEmoticons {
	const resolvedTheme: EmoticonTheme =
		theme ?? (page.data?.settings?.emoticonTheme as EmoticonTheme) ?? 'smiley';
	return emoticonThemes[resolvedTheme];
}

export function getMoodLevels(theme?: EmoticonTheme): MoodLevel[] {
	return Object.keys(getLevelEmoticons(theme)).map(Number) as MoodLevel[];
}
