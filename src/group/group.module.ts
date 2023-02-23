import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { GroupStudents } from './entities/group-students.entity';
import { AttenDance } from './entities/attendance.entity';

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [TypeOrmModule.forFeature([Group, GroupStudents, AttenDance])],
})
export class GroupModule {}
