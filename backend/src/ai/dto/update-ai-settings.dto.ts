import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Allow any JSON object with string keys
const UpdateAiSettingsSchema = z.record(z.string(), z.any());

export class UpdateAiSettingsDto extends createZodDto(UpdateAiSettingsSchema) {}
