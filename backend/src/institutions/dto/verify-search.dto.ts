import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const VerifySearchSchema = z.object({
  name: z.string().min(2),
});

export class VerifySearchDto extends createZodDto(VerifySearchSchema) {}
