import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RollCallService } from './roll-call.service';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { RollCallByNameDto } from './dto/roll-call-by-name.dto';
// import { GroupBelongsSchoolGuard } from 'src/group/guards/group-belongs-school.guard';
import { ChangeAttendedDto } from './dto/change-attended.dto';
import { RollCallBelongsGroupGuard } from './guards/roll-call-belongs-group.guard';
import { AddStudentsToRollCallDto } from './dto/add-students-roll-call.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Auth([ValidRoles.admin, ValidRoles.teacher])
@Controller('roll-call')
export class RollCallController {
  constructor(private readonly rollCallService: RollCallService) {}

  @Get('group/:groupId/check-exists')
  // @UseGuards(GroupBelongsSchoolGuard)
  checkExistsRollCall(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() rollCallByNameDto: RollCallByNameDto,
  ) {
    return this.rollCallService.checkExistsRollCall(groupId, rollCallByNameDto);
  }

  @Delete('group/:groupId')
  // @UseGuards(GroupBelongsSchoolGuard)
  removeRollCallByDate(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() rollCallByNameDto: RollCallByNameDto,
  ) {
    return this.rollCallService.removeRollCallByDate(
      groupId,
      rollCallByNameDto,
    );
  }

  @Post('group/:groupId')
  // @UseGuards(GroupBelongsSchoolGuard)
  create(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() rollCallByNameDto: RollCallByNameDto,
  ) {
    return this.rollCallService.create(groupId, rollCallByNameDto);
  }

  @Get('group/:groupId')
  // @UseGuards(GroupBelongsSchoolGuard)
  findAllByGroup(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.rollCallService.findAllByGroup(groupId);
  }

  @Get('group/:groupId/by-date')
  // @UseGuards(GroupBelongsSchoolGuard)
  findAllByGroupAndByDate(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() rollCallByNameDto: RollCallByNameDto,
  ) {
    return this.rollCallService.findAllByGroupAndByDate(
      groupId,
      rollCallByNameDto,
    );
  }

  @Patch(':rollCallId')
  @UseGuards(RollCallBelongsGroupGuard)
  changeAttended(
    @Param('rollCallId', ParseIntPipe) rollCallId: number,
    @Body() changeAttendedDto: ChangeAttendedDto,
  ) {
    return this.rollCallService.changeAttended(rollCallId, changeAttendedDto);
  }

  @Get('group/:groupId/students-do-not-belongs-roll-call')
  // @UseGuards(GroupBelongsSchoolGuard)
  findStudentsDoNotBelongsRollCall(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() rollCallByNameDto: RollCallByNameDto,
  ) {
    return this.rollCallService.findStudentsDoNotBelongsRollCall(
      groupId,
      rollCallByNameDto,
    );
  }

  @Post('group/:groupId/add-students')
  // @UseGuards(GroupBelongsSchoolGuard)
  addStudentsToRollCall(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() addStudentsToRollCallDto: AddStudentsToRollCallDto,
  ) {
    return this.rollCallService.addStudentsToRollCall(
      groupId,
      addStudentsToRollCallDto,
    );
  }
}
