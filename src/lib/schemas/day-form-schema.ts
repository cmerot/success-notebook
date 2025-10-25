import { z } from 'zod';
import { checklistItemSchema, moodSchema } from './common';
import type { AppSettings } from '$lib/services/settings';

// Day form schema factory
export function createDayFormSchema(settings: AppSettings) {
	return z.object({
		start: z.object({
			mood: moodSchema,
			grateful: z.string(),
			desire: z.string(),
			goal: z.string(),
			todoList: z.array(checklistItemSchema).max(settings.maxTodoList),
			toRelaxList: z.array(checklistItemSchema).max(settings.maxToRelaxList)
		}),
		end: z.object({
			achievements: z.string(),
			mood: moodSchema
		})
	});
}

export type DayFormType = z.infer<ReturnType<typeof createDayFormSchema>>;
