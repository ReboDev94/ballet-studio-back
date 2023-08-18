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
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserHasSchoolGuard } from 'src/auth/guards/user-has-school.guard';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @Auth([ValidRoles.admin], { guards: [UserHasSchoolGuard] })
  create(
    @GetUser('school') school: School,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    return this.groupService.create(createGroupDto, school);
  }

  @Patch(':groupId')
  @Auth([ValidRoles.admin], { guards: [UserHasSchoolGuard] })
  update(
    @GetUser('school') school: School,
    @Body() updateGroupDto: UpdateGroupDto,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.groupService.update(groupId, updateGroupDto, school);
  }

  @Get(':groupId')
  @Auth([ValidRoles.admin], { guards: [UserHasSchoolGuard] })
  findOne(
    @GetUser('school') { id: schoolId }: School,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.groupService.findOne(groupId, schoolId);
  }

  @Get()
  @Auth([ValidRoles.admin], { guards: [UserHasSchoolGuard] })
  findAll(
    @GetUser('school') school: School,
    @Query() searchGroupDto: SearchGroupDto,
  ) {
    return this.groupService.findAll(school, searchGroupDto);
  }

  @Delete(':groupId')
  @Auth([ValidRoles.admin], { guards: [UserHasSchoolGuard] })
  remove(
    @GetUser('school') { id: schoolId }: School,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.groupService.remove(groupId, schoolId);
  }
}
