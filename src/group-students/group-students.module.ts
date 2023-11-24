import { Module } from '@nestjs/common';
import { GroupStudentsService } from './group-students.service';
import { GroupStudentsController } from './group-students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupStudent } from './entities/group-student.entity';
import { AuthModule } from 'src/auth/auth.module';
import { GroupModule } from 'src/group/group.module';
import { StudentModule } from 'src/student/student.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [GroupStudentsController],
  providers: [GroupStudentsService],
  imports: [
    TypeOrmModule.forFeature([GroupStudent]),
    AuthModule,
    GroupModule,
    StudentModule,
    FilesModule,
  ],
  exports: [TypeOrmModule, GroupStudentsService],
})
export class GroupStudentsModule {}
