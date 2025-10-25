import { z } from 'zod';
import { goalItemSchema } from './common';
import type { AppSettings } from '$lib/services/settings';

// Schema for weekly routines with daily checkboxes
export const routineItemSchema = z.object({
	text: z.string(),
	monday: z.boolean(),
	tuesday: z.boolean(),
	wednesday: z.boolean(),
	thursday: z.boolean(),
	friday: z.boolean(),
	saturday: z.boolean(),
	sunday: z.boolean()
});

// Week form schema factory
export function createWeekFormSchema(settings: AppSettings) {
	return z.object({
		start: z.object({
			mantra: z.string(),
			routines: z.array(routineItemSchema).max(settings.maxWeekRoutines),
			goals: z.array(goalItemSchema).max(settings.maxWeekGoals)
		}),
		end: z.object({
			achievements: z.string()
		})
	});
}

export type WeekFormType = z.infer<ReturnType<typeof createWeekFormSchema>>;
export type RoutineItemSchemaType = z.infer<typeof routineItemSchema>;
