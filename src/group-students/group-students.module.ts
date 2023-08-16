import { Module } from '@nestjs/common';
import { GroupStudentsService } from './group-students.service';
import { GroupStudentsController } from './group-students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupStudent } from './entities/group-student.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [GroupStudentsController],
  providers: [GroupStudentsService],
  imports: [TypeOrmModule.forFeature([GroupStudent]), AuthModule],
  exports: [TypeOrmModule],
})
export class GroupStudentsModule {}
