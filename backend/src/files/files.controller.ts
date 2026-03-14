import {
  Controller,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Req,
  Get,
  Param,
  Delete,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { SupabaseAuthGuard } from '@shared/guards/supabase-auth.guard';
import { AuthenticatedRequest } from '@shared/types/authenticated-request.interface';

interface UploadedFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

@Controller('files')
@UseGuards(SupabaseAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Req() request: AuthenticatedRequest,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '.(png|jpeg|jpg|webp)',
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 5, // 5MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: UploadedFile,
  ) {
    const userId = request.user.sub || request.user.id;
    const path = `avatars/${userId}/${file.originalname}`;
    return this.filesService.uploadFile(file.buffer, path, file.mimetype);
  }

  @Post('upload/document')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Req() request: AuthenticatedRequest,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 10, // 10MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: UploadedFile,
  ) {
    const userId = request.user.sub || request.user.id;
    const path = `documents/${userId}/${file.originalname}`;
    return this.filesService.uploadFile(file.buffer, path, file.mimetype);
  }

  @Get('*path')
  getFileUrl(@Param('path') path: string) {
    return this.filesService.getFileUrl(path);
  }

  @Delete('*path')
  async deleteFile(@Param('path') path: string) {
    return this.filesService.deleteFile(path);
  }
}
