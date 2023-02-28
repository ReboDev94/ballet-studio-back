import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { GroupStudents } from './entities/group-students.entity';
import { AttenDance } from './entities/attendance.entity';
import { AuthModule } from '../auth/auth.module';
import { StudentModule } from '../student/student.module';

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [
    TypeOrmModule.forFeature([Group, GroupStudents, AttenDance]),
    AuthModule,
    StudentModule,
  ],
})
export class GroupModule {}
