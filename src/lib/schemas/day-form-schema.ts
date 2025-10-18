import { z } from 'zod';
import { checklistItemSchema } from './common';

// Day form schema
export const dayFormSchema = z.object({
	start: z.object({
		mood: z.object({
			text: z.string(),
			icon: z.string()
		}),
		grateful: z.string(),
		desire: z.string(),
		goal: z.string(),
		todoList: z.array(checklistItemSchema),
		toRelaxList: z.array(checklistItemSchema).max(3)
	}),
	end: z.object({
		achievements: z.string(),
		mood: z.object({
			text: z.string(),
			icon: z.string()
		})
	})
});

export type DayFormType = z.infer<typeof dayFormSchema>;
