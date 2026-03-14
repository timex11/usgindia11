import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const LogEventSchema = z.object({
  eventType: z.string().min(1, 'Event type is required'),
  eventData: z.any().optional(),
});

export class LogEventDto extends createZodDto(LogEventSchema) {}
