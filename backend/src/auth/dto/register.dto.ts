import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { UserRole } from '../../types/enums';

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
  role: z.nativeEnum(UserRole).default(UserRole.STUDENT),
  turnstileToken: z.string().optional(),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
