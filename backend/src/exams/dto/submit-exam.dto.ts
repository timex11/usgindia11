import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SubmitExamSchema = z.object({
  answers: z.record(
    z.string(),
    z.union([z.number(), z.string(), z.array(z.number())]),
  ),
});

export class SubmitExamDto extends createZodDto(SubmitExamSchema) {}
