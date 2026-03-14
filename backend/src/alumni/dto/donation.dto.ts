import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const DonationSchema = z.object({
  amount: z.number().positive(),
  purpose: z.string().min(5),
});

export class DonationDto extends createZodDto(DonationSchema) {}
