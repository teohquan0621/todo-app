import { z } from 'zod';

export const categoryFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Category name is required')
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must not exceed 50 characters'),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
