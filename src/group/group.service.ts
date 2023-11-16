import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Like, Repository } from 'typeorm';

import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AuthService } from 'src/auth/auth.service';
import { Group } from './entities/group.entity';
import { School } from '../school/entities/school.entity';
import { SearchGroupDto } from './dto/search-group';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { PageDto } from '../common/dto/page.dto';
import { Days } from 'src/common/interfaces/days';

@Injectable()
export class GroupService {
  private readonly logger = new Logger('groupService');

  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly authService: AuthService,
  ) {}

  async create(createGroupDto: CreateGroupDto, school: School) {
    const schedules = Object.keys(Days).map((k) => ({
      day: k,
      hour: createGroupDto[`schedule${k}`],
    }));

    const { description, teacherId, schoolCycle, degree } = createGroupDto;
    const { id: schoolId } = school;
    const teacher = await this.authService.findOneTeacher(teacherId, schoolId);

    try {
      const group = this.groupRepository.create({
        description,
        schedules,
        schoolCycle,
        degree,
        school,
        teacher,
      });

      const dbGroup = await this.groupRepository.save(group);
      return {
        success: true,
        group: dbGroup,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async update(
    groupId: number,
    updateGroupDto: UpdateGroupDto,
    { id: schoolId }: School,
  ) {
    await this.findOneBySchool(groupId, schoolId);
    const { teacherId } = updateGroupDto;

    if (teacherId) {
      const teacher = await this.authService.findOneTeacher(
        teacherId,
        schoolId,
      );
      updateGroupDto.teacher = teacher;
    }

    try {
      const preGroup = await this.groupRepository.preload({
        id: groupId,
        ...updateGroupDto,
      });
      await this.groupRepository.save(preGroup);

      return {
        success: true,
        message: 'group has been updated',
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findOne(groupId: number, schoolId: number) {
    const dbGroup = await this.findOneBySchool(groupId, schoolId);
    return { success: true, group: dbGroup };
  }

  async findAll({ id: schoolId }: School, searchGroupDto: SearchGroupDto) {
    const { page, take, order, skip, degree = [], teacher } = searchGroupDto;
    const conditions: FindManyOptions<Group> = {
      select: {
        teacher: {
          name: true,
        },
      },
      where: {
        school: {
          id: schoolId,
        },
      },
      relations: {
        teacher: true,
      },
      order: {
        description: order,
      },
    };

    if (degree && degree.length > 0)
      conditions.where['degree'] = In([...degree]);
    if (teacher) conditions.where['teacher'] = { name: Like(`${teacher}%`) };

    const itemCount = await this.groupRepository.count(conditions);

    conditions.take = take;
    conditions.skip = skip;
    const groups = await this.groupRepository.find(conditions);

    const pageOptionsDto: PageOptionsDto = { take, skip, page };
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    const pageData = new PageDto(groups, pageMetaDto);

    return {
      success: true,
      groups: { ...pageData },
    };
  }

  async remove(groupId: number, schoolId: number) {
    await this.findOneBySchool(groupId, schoolId);
    try {
      await this.groupRepository.softDelete({ id: groupId });
      return { success: true, message: 'group has been deleted' };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findOneBySchool(groupId: number, schoolId: number) {
    const dbGroup = await this.groupRepository.findOne({
      where: { id: groupId, school: { id: schoolId } },
      relations: {
        teacher: true,
      },
    });
    if (!dbGroup)
      throw new NotFoundException({ key: 'operations.GROUP.NOT_FOUND' });
    return dbGroup;
  }

  private handleDBException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('help');
  }
}
