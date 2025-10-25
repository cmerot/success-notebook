export const levelEmoticons = {
	1: '😢', // very sad
	2: '😞', // sad
	3: '😐', // neutral
	4: '😊', // happy
	5: '😁' // very happy
} as const;

export type MoodLevel = keyof typeof levelEmoticons;

export const moodLevels = Object.keys(levelEmoticons).map(Number) as MoodLevel[];
