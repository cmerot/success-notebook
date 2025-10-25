import { z } from 'zod';
import { goalItemSchema } from './common';
import type { AppSettings } from '$lib/services/settings';

// Month form schema factory
export function createMonthFormSchema(settings: AppSettings) {
	return z.object({
		start: z.object({
			mantra: z.string(),
			routines: z.array(z.string()).max(settings.maxMonthRoutines),
			goals: z.array(goalItemSchema).max(settings.maxMonthGoals)
		}),
		end: z.object({
			achievements: z.string()
		})
	});
}

export type MonthFormType = z.infer<ReturnType<typeof createMonthFormSchema>>;
