import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilterImage } from './helpers';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { School } from '../school/entities/school.entity';

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @Post('upload-profile-school')
  @Auth(ValidRoles.admin)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2097152 },
      fileFilter: fileFilterImage,
    }),
  )
  async uploadProfileSchool(
    @GetUser('school') school: School,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Make sure that file is an image');
    return this.fileService.uploadProfileSchool(file, school);
  }
}
