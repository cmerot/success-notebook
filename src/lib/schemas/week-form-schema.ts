import { z } from 'zod';
import { goalItemSchema } from './common';

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

// Week form schema
export const weekFormSchema = z.object({
	start: z.object({
		mantra: z.string(),
		routines: z.array(routineItemSchema).max(4),
		goals: z.array(goalItemSchema).max(3)
	}),
	end: z.object({
		achievements: z.string()
	})
});

export type WeekFormType = z.infer<typeof weekFormSchema>;
export type RoutineItemSchemaType = z.infer<typeof routineItemSchema>;
