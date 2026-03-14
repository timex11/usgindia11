import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateExamSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  duration_minutes: z.number().int().positive().default(60),
  total_marks: z.number().int().positive().optional(),
  passing_marks: z.number().int().positive().optional(),
  is_active: z.boolean().default(true),
});

export class CreateExamDto extends createZodDto(CreateExamSchema) {}
