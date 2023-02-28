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
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { SearchGroupDto } from './dto/search-group';
import { AddStudentsGroup } from './dto/add-students-group.dto';

@Auth(ValidRoles.admin)
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

  @Patch(':id')
  update(
    @GetUser('school') school: School,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupService.update(id, updateGroupDto, school);
  }

  @Get(':id')
  findOne(
    @GetUser('school') school: School,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.groupService.findOne(id, school);
  }

  @Get()
  findAll(
    @GetUser('school') school: School,
    @Query() searchGroupDto: SearchGroupDto,
  ) {
    return this.groupService.findAll(school, searchGroupDto);
  }

  @Delete(':id')
  remove(
    @GetUser('school') school: School,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.groupService.remove(id, school);
  }

  @Post(':id/add-students')
  addStudents(
    @GetUser('school') school: School,
    @Param('id', ParseIntPipe) id: number,
    @Body() addStudentsGroupDto: AddStudentsGroup,
  ) {
    return this.groupService.addStudents(id, addStudentsGroupDto, school);
  }
}
