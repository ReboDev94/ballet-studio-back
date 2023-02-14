import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student } from './entities/student.entity';
import { AuthModule } from '../auth/auth.module';
import { Tutor } from './entities/tutor.entity';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
  imports: [AuthModule, TypeOrmModule.forFeature([Student, Tutor])],
})
export class StudentModule {}
