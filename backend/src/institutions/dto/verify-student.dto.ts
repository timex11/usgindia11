import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const VerifyStudentSchema = z.object({
  studentId: z.string().uuid(),
});

export class VerifyStudentDto extends createZodDto(VerifyStudentSchema) {}
