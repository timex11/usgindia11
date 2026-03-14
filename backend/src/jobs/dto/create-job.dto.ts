import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { JobType } from '../../types/enums';

export const CreateJobSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional(),
  type: z.nativeEnum(JobType).default(JobType.FULL_TIME),
  description: z.string().optional(),
  salaryRange: z.string().optional(),
  link: z.string().url().optional().or(z.literal('')),
});

export class CreateJobDto extends createZodDto(CreateJobSchema) {}

export const UpdateJobSchema = CreateJobSchema.partial();
export class UpdateJobDto extends createZodDto(UpdateJobSchema) {}
