import { z } from 'zod';
import { checklistItemSchema, moodSchema } from './common';

// Day form schema
export const dayFormSchema = z.object({
	start: z.object({
		mood: moodSchema,
		grateful: z.string(),
		desire: z.string(),
		goal: z.string(),
		todoList: z.array(checklistItemSchema),
		toRelaxList: z.array(checklistItemSchema).max(3)
	}),
	end: z.object({
		achievements: z.string(),
		mood: moodSchema
	})
});

export type DayFormType = z.infer<typeof dayFormSchema>;
