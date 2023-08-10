import {
  Controller,
  Body,
  Patch,
  UseInterceptors,
  UploadedFile,
  Get,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { School } from './entities/school.entity';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilterImage } from 'src/files/helpers';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Auth([ValidRoles.admin])
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Patch()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2097152 },
      fileFilter: fileFilterImage,
    }),
  )
  update(
    @GetUser('school') { id }: School,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateSchoolDto: UpdateSchoolDto,
  ) {
    return this.schoolService.update(id, file, updateSchoolDto);
  }

  @Get()
  findOne(@GetUser('school') school: School) {
    return this.schoolService.findOne(school);
  }
}
