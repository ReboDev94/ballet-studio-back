import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { RollCallService } from './roll-call.service';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { RollCallByNameDto } from './dto/roll-call-by-name.dto';
import { ChangeAttendedDto } from './dto/change-attended.dto';
import { AddStudentsToRollCallDto } from './dto/add-students-roll-call.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserHasSchoolGuard } from 'src/auth/guards/user-has-school.guard';
import { School } from 'src/school/entities/school.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('roll-call')
export class RollCallController {
  constructor(private readonly rollCallService: RollCallService) {}

  @Post('create/group/:groupId')
  @Auth([ValidRoles.admin, ValidRoles.teacher], {
    guards: [UserHasSchoolGuard],
  })
  create(
    @GetUser('school') { id: schoolId }: School,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() rollCallByNameDto: RollCallByNameDto,
  ) {
    return this.rollCallService.create(groupId, schoolId, rollCallByNameDto);
  }

  @Get('check-exists/group/:groupId')
  @Auth([ValidRoles.admin, ValidRoles.teacher], {
    guards: [UserHasSchoolGuard],
  })
  checkExistsRollCall(
    @GetUser('school') { id: schoolId }: School,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() rollCallByNameDto: RollCallByNameDto,
  ) {
    return this.rollCallService.checkExistsRollCall(
      groupId,
      schoolId,
      rollCallByNameDto,
    );
  }

  @Delete('remove-by-date/group/:groupId')
  @Auth([ValidRoles.admin, ValidRoles.teacher], {
    guards: [UserHasSchoolGuard],
  })
  removeRollCallByDate(
    @GetUser('school') { id: schoolId }: School,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() rollCallByNameDto: RollCallByNameDto,
  ) {
    return this.rollCallService.removeRollCallByDate(
      groupId,
      schoolId,
      rollCallByNameDto,
    );
  }

  @Get('find-all/group/:groupId')
  @Auth([ValidRoles.admin, ValidRoles.teacher], {
    guards: [UserHasSchoolGuard],
  })
  findAllByGroup(
    @GetUser('school') { id: schoolId }: School,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.rollCallService.findAllByGroup(groupId, schoolId);
  }

  @Get('find-by-date/group/:groupId')
  @Auth([ValidRoles.admin, ValidRoles.teacher], {
    guards: [UserHasSchoolGuard],
  })
  findAllByGroupAndByDate(
    @GetUser('school') { id: schoolId }: School,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() rollCallByNameDto: RollCallByNameDto,
  ) {
    return this.rollCallService.findAllByGroupAndByDate(
      groupId,
      schoolId,
      rollCallByNameDto,
    );
  }

  @Get('students-do-not-belongs/group/:groupId')
  @Auth([ValidRoles.admin, ValidRoles.teacher], {
    guards: [UserHasSchoolGuard],
  })
  findStudentsDoNotBelongsRollCall(
    @GetUser('school') { id: schoolId }: School,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() rollCallByNameDto: RollCallByNameDto,
  ) {
    return this.rollCallService.findStudentsDoNotBelongsRollCall(
      groupId,
      schoolId,
      rollCallByNameDto,
    );
  }

  @Post('add-students/group/:groupId')
  @Auth([ValidRoles.admin, ValidRoles.teacher], {
    guards: [UserHasSchoolGuard],
  })
  addStudentsToRollCall(
    @GetUser('school') { id: schoolId }: School,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() addStudentsToRollCallDto: AddStudentsToRollCallDto,
  ) {
    return this.rollCallService.addStudentsToRollCall(
      groupId,
      schoolId,
      addStudentsToRollCallDto,
    );
  }

  @Patch('status-attended/:rollCallId')
  @Auth([ValidRoles.admin, ValidRoles.teacher], {
    guards: [UserHasSchoolGuard],
  })
  changeAttended(
    @GetUser('school') { id: schoolId }: School,
    @Param('rollCallId', ParseIntPipe) rollCallId: number,
    @Body() changeAttendedDto: ChangeAttendedDto,
  ) {
    return this.rollCallService.changeAttended(
      rollCallId,
      schoolId,
      changeAttendedDto,
    );
  }
}
