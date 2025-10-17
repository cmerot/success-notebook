import { z } from 'zod';

// Schema for SMARTE objectives with completion percentage
const goals = z.object({
	text: z.string(),
	completion: z.number().min(0).max(100).optional()
});

// Month form schema
export const monthFormSchema = z.object({
	start: z.object({
		mantra: z.string(),
		routines: z.array(z.string()).max(5),
		goals: z.array(goals).max(3)
	}),
	end: z.object({
		achievements: z.string()
	})
});

export type MonthFormType = z.infer<typeof monthFormSchema>;
