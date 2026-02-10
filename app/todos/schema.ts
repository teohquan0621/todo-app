import { z } from 'zod';
import { TodoStatus } from '@/lib/storage';

export const todoFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
  category: z.string().min(1, 'Category is required'),
  dueDate: z
    .date()
    .min(new Date(new Date().setHours(0, 0, 0, 0)), 'Due date must be today or later'),
  status: z.enum([TodoStatus.PENDING, TodoStatus.COMPLETED] as const).optional(),
});

export type TodoFormValues = z.infer<typeof todoFormSchema>;
