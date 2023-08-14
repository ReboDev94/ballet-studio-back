import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { School } from '../school/entities/school.entity';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { SearchGroupDto } from './dto/search-group';
import { AddOrRemoveStudentsGroup } from './dto/add-remove-students-group.dto';
import { SearchStudenthDto } from '../student/dto/search-student.dto';
import { UseGuards } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';

/* TODO: ARREGLAR VALIDACION PARA GroupBelongsSchoolGuard  */
@Auth([ValidRoles.admin])
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(
    @GetUser('school') school: School,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    return this.groupService.create(createGroupDto, school);
  }

  @Patch(':groupId')
  // @UseGuards(GroupBelongsSchoolGuard)
  update(
    @GetUser('school') school: School,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupService.update(groupId, updateGroupDto, school);
  }

  @Get(':groupId')
  // @UseGuards(GroupBelongsSchoolGuard)
  findOne(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.groupService.findOne(groupId);
  }

  @Get()
  findAll(
    @GetUser('school') school: School,
    @Query() searchGroupDto: SearchGroupDto,
  ) {
    return this.groupService.findAll(school, searchGroupDto);
  }

  @Delete(':groupId')
  // @UseGuards(GroupBelongsSchoolGuard)
  remove(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.groupService.remove(groupId);
  }

  @Post(':groupId/add-students')
  // @UseGuards(GroupBelongsSchoolGuard)
  addStudents(
    @GetUser('school') school: School,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() addStudentsGroupDto: AddOrRemoveStudentsGroup,
  ) {
    return this.groupService.addStudents(groupId, addStudentsGroupDto, school);
  }

  @Post(':groupId/remove-students')
  // @UseGuards(GroupBelongsSchoolGuard)
  removeStudents(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() addOrRemoveStudentsGroup: AddOrRemoveStudentsGroup,
  ) {
    return this.groupService.removeStudents(groupId, addOrRemoveStudentsGroup);
  }

  @Get(':groupId/all-students')
  // @UseGuards(GroupBelongsSchoolGuard)
  allStudentsByGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Query() searchStudentDto: SearchStudenthDto,
  ) {
    return this.groupService.allStudentsByGroup(groupId, searchStudentDto);
  }
}
