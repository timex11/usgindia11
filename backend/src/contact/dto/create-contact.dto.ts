import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10),
});

export class CreateContactDto extends createZodDto(createContactSchema) {}
