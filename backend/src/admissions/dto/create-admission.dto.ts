import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAdmissionDto {
  @IsString()
  @IsNotEmpty()
  universityId: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsOptional()
  documents?: any;
}
