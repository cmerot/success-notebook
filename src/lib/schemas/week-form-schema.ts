import { z } from 'zod';

// Schema for weekly routines with daily checkboxes
const routines = z.object({
	text: z.string(),
	monday: z.boolean(),
	tuesday: z.boolean(),
	wednesday: z.boolean(),
	thursday: z.boolean(),
	friday: z.boolean(),
	saturday: z.boolean(),
	sunday: z.boolean()
});

// Schema for SMARTE objectives with completion percentage
const goals = z.object({
	text: z.string(),
	completion: z.number().min(0).max(100).default(0)
});

// Week form schema
export const weekFormSchema = z.object({
	start: z.object({
		mantra: z.string(),
		routines: z.array(routines).max(4),
		goals: z.array(goals).max(3)
	}),
	end: z.object({
		achievements: z.string()
	})
});

export type WeekFormType = z.infer<typeof weekFormSchema>;
