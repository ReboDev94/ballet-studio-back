import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student } from './entities/student.entity';
import { AuthModule } from '../auth/auth.module';
import { Tutor } from './entities/tutor.entity';
import { FilesModule } from '../files/files.module';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
  imports: [
    TypeOrmModule.forFeature([Student, Tutor]),
    AuthModule,
    FilesModule,
  ],
  exports: [StudentService, TypeOrmModule],
})
export class StudentModule {}
