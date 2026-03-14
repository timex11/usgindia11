import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const MentorshipRequestSchema = z.object({
  mentorId: z.string().uuid(),
  message: z.string().min(10),
});

export class MentorshipRequestDto extends createZodDto(
  MentorshipRequestSchema,
) {}
