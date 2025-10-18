import { z } from 'zod';
import { goalItemSchema } from './common';

// Month form schema
export const monthFormSchema = z.object({
	start: z.object({
		mantra: z.string(),
		routines: z.array(z.string()).max(5),
		goals: z.array(goalItemSchema).max(3)
	}),
	end: z.object({
		achievements: z.string()
	})
});

export type MonthFormType = z.infer<typeof monthFormSchema>;
