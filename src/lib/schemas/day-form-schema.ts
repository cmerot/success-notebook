import { z } from 'zod';
import { checklistItemSchema, moodLevelSchema } from './common';
import type { AppSettings } from '$lib/services/settings';

// Day form schema factory
export function createDayFormSchema(settings: AppSettings) {
	return z.object({
		start: z.object({
			mood: moodLevelSchema,
			grateful: z.string(),
			desire: z.string(),
			goal: z.string(),
			todoList: z.array(checklistItemSchema).max(settings.maxTodoList),
			toRelaxList: z.array(checklistItemSchema).max(settings.maxToRelaxList)
		}),
		end: z.object({
			achievements: z.string(),
			mood: moodLevelSchema
		})
	});
}

export type DayFormType = z.infer<ReturnType<typeof createDayFormSchema>>;
