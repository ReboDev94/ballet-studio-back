import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { GroupStudents } from './entities/group-students.entity';
import { RollCall } from '../roll-call/entities/rollCall.entity';
import { AuthModule } from '../auth/auth.module';
import { StudentModule } from '../student/student.module';
import { GroupBelongsSchoolGuard } from './guards/group-belongs-school.guard';

@Module({
  controllers: [GroupController],
  providers: [GroupService, GroupBelongsSchoolGuard],
  imports: [
    TypeOrmModule.forFeature([Group, GroupStudents, RollCall]),
    AuthModule,
    StudentModule,
  ],
  exports: [TypeOrmModule, GroupBelongsSchoolGuard, GroupService],
})
export class GroupModule {}
