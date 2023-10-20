import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { ConfigModule } from '@nestjs/config';
import { FilesSchoolService } from './files.school.service';
import { FilesAuthService } from './files.auth.service';
import { FilesStudentService } from './files.student.service';

@Module({
  imports: [ConfigModule],
  providers: [
    FilesService,
    FilesSchoolService,
    FilesAuthService,
    FilesStudentService,
  ],
  exports: [FilesSchoolService, FilesAuthService, FilesStudentService],
})
export class FilesModule {}
