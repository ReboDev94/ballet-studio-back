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
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { School } from '../school/entities/school.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilterImage } from 'src/files/helpers';
import { Get } from '@nestjs/common';
import { SearchStudenthDto } from './dto/search-student.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserHasSchoolGuard } from 'src/auth/guards/user-has-school.guard';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @Auth([ValidRoles.admin], { guards: [UserHasSchoolGuard] })
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

  @Patch(':studentId')
  @Auth([ValidRoles.admin], { guards: [UserHasSchoolGuard] })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2097152 },
      fileFilter: fileFilterImage,
    }),
  )
  update(
    @Param('studentId', ParseIntPipe) studentId: number,
    @GetUser('school') school: School,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(
      studentId,
      school,
      file,
      updateStudentDto,
    );
  }

  @Delete(':studentId')
  @Auth([ValidRoles.admin], { guards: [UserHasSchoolGuard] })
  remove(
    @Param('studentId', ParseIntPipe) studentId: number,
    @GetUser('school') school: School,
  ) {
    return this.studentService.remove(studentId, school);
  }

  @Get()
  @Auth([ValidRoles.admin], { guards: [UserHasSchoolGuard] })
  findAll(
    @GetUser('school') school: School,
    @Query() searchStudentDto: SearchStudenthDto,
  ) {
    return this.studentService.findAll(searchStudentDto, school);
  }
}
