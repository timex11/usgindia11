import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateProfileSchema = z.object({
  fullName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  aadhaarNumber: z.string().optional(),
  universityId: z.string().uuid().optional(),
  collegeId: z.string().uuid().optional(),
  phoneNumber: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),
});

export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {}
