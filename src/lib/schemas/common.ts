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

export type CheckListItemType = z.infer<typeof checklistItemSchema>;
export type GoalItemSchemaType = z.infer<typeof goalItemSchema>;
