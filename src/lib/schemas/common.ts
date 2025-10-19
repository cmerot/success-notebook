import { z } from 'zod';

// Schema for checklist items
export const checklistItemSchema = z.object({
	text: z.string(),
	completed: z.boolean()
});

// Schema for SMARTE objectives with completion percentage
export const goalItemSchema = z.object({
	text: z.string(),
	completion: z.number().min(0).max(100).default(0)
});

export const moodSchema = z.object({
	text: z.string(),
	icon: z.string()
});

export type CheckListItemType = z.infer<typeof checklistItemSchema>;
export type GoalItemSchemaType = z.infer<typeof goalItemSchema>;
export type MoodSchemaType = z.infer<typeof moodSchema>;
