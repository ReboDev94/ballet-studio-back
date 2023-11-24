import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { GroupStudentsService } from './group-students.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { School } from 'src/school/entities/school.entity';
import { AddOrRemoveStudentsGroupDto } from './dto/add-remove-students-group.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { UserHasSchoolGuard } from 'src/auth/guards/user-has-school.guard';
import { SearchStudenthDto } from 'src/student/dto/search-student.dto';
import { SearchStudentsAreNotGroupDto } from './dto/search-students-are-not-group.dto';

@Controller('group-students')
export class GroupStudentsController {
  constructor(private readonly groupStudentsService: GroupStudentsService) {}

  @Post('add-students/group/:groupId')
  @Auth([ValidRoles.admin], { guards: [UserHasSchoolGuard] })
  addStudents(
    @GetUser('school') school: School,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() addStudentsGroupDto: AddOrRemoveStudentsGroupDto,
  ) {
    return this.groupStudentsService.addStudentsToGroup(
      groupId,
      school,
      addStudentsGroupDto,
    );
  }

  @Post('remove-students/group/:groupId')
  @Auth([ValidRoles.admin], { guards: [UserHasSchoolGuard] })
  removeStudents(
    @GetUser('school') school: School,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() addOrRemoveStudentsGroup: AddOrRemoveStudentsGroupDto,
  ) {
    return this.groupStudentsService.removeStudentsToGroup(
      groupId,
      school,
      addOrRemoveStudentsGroup,
    );
  }

  @Get('all-students/group/:groupId')
  @Auth([ValidRoles.admin], { guards: [UserHasSchoolGuard] })
  allStudentsByGroup(
    @GetUser('school') school: School,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Query() searchStudentDto: SearchStudenthDto,
  ) {
    return this.groupStudentsService.allStudentsByGroup(
      groupId,
      school,
      searchStudentDto,
    );
  }

  @Get('all-students-are-not/group/:groupId')
  @Auth([ValidRoles.admin], { guards: [UserHasSchoolGuard] })
  allStudentsAreNotIntheGroup(
    @GetUser('school') school: School,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Query() searchStudentsAreNotGroupDto: SearchStudentsAreNotGroupDto,
  ) {
    return this.groupStudentsService.allStudentsAreNotIntheGroup(
      groupId,
      school,
      searchStudentsAreNotGroupDto,
    );
  }
}
