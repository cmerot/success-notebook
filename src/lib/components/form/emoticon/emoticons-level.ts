import { page } from '$app/state';
import { DEFAULT_SETTINGS } from '$lib/services/settings';
export type EmoticonThemeName = 'smiley' | 'weather';
export type MoodScale = 1 | 2 | 3 | 4 | 5;
export type MoodEmoticonTheme = Record<MoodScale, string>;

export const emoticonThemes: Record<EmoticonThemeName, MoodEmoticonTheme> = {
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
};

export function getMoodEmoticons(theme?: EmoticonThemeName): MoodEmoticonTheme {
	const resolvedTheme: EmoticonThemeName =
		theme ??
		(page.data?.settings?.emoticonTheme as EmoticonThemeName) ??
		DEFAULT_SETTINGS.emoticonTheme;
	return emoticonThemes[resolvedTheme];
}

export function getMoodLevels(theme?: EmoticonThemeName): MoodScale[] {
	return Object.keys(getMoodEmoticons(theme)).map(Number) as MoodScale[];
}
