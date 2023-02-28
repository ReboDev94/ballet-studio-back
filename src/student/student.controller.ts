import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Delete,
  Query,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { School } from '../school/entities/school.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilterImage } from 'src/files/helpers';
import { Get } from '@nestjs/common';
import { SearchStudenthDto } from './dto/search-student.dto';

@Auth(ValidRoles.admin)
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2097152 },
      fileFilter: fileFilterImage,
    }),
  )
  create(
    @GetUser('school') school: School,
    @UploadedFile() file: Express.Multer.File,
    @Body() createStudentDto: CreateStudentDto,
  ) {
    return this.studentService.create(file, createStudentDto, school);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2097152 },
      fileFilter: fileFilterImage,
    }),
  )
  update(
    @GetUser('school') school: School,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(id, file, updateStudentDto, school);
  }

  @Delete(':id')
  remove(
    @GetUser('school') school: School,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.studentService.remove(id, school);
  }

  @Get()
  findAll(
    @GetUser('school') school: School,
    @Query() searchStudentDto: SearchStudenthDto,
  ) {
    return this.studentService.findAll(searchStudentDto, school);
  }
}
