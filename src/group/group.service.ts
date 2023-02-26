import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AuthService } from 'src/auth/auth.service';
import { Group } from './entities/group.entity';
import { School } from '../school/entities/school.entity';
import { SearchGroupDto } from './dto/search-group';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { PageDto } from '../common/dto/page.dto';

@Injectable()
export class GroupService {
  private readonly logger = new Logger('groupService');

  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly authService: AuthService,
  ) {}

  async create(createGroupDto: CreateGroupDto, school: School) {
    const { teacherId } = createGroupDto;
    const { id: schoolId } = school;
    const teacher = await this.authService.findOneTeacher(teacherId, schoolId);
    try {
      const group = this.groupRepository.create({
        ...createGroupDto,
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
    id: number,
    updateGroupDto: UpdateGroupDto,
    { id: schoolId }: School,
  ) {
    const { teacherId } = updateGroupDto;
    const teacher = await this.authService.findOneTeacher(teacherId, schoolId);

    try {
      const preGroup = await this.groupRepository.preload({
        id,
        ...updateGroupDto,
        teacher,
        school: { id: schoolId },
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

  async findOne(id: number, { id: schoolId }: School) {
    const dbGroup = await this.groupRepository.findOne({
      where: { id, school: { id: schoolId } },
      relations: { teacher: true },
    });
    if (!dbGroup) throw new NotFoundException('group not found');
    return { success: true, group: dbGroup };
  }

  async findAll({ id: schoolId }: School, searchGroupDto: SearchGroupDto) {
    const { page, take, skip, degree, teacher } = searchGroupDto;
    const pageOptionsDto: PageOptionsDto = { page, skip, take };

    const conditions: FindManyOptions<Group> = {
      where: { school: { id: schoolId } },
    };
    if (degree) conditions.where['degree'] = degree;
    if (teacher) conditions.where['teacher'] = { id: teacher };

    const itemCount = await this.groupRepository.count(conditions);
    const groups = await this.groupRepository.find(conditions);

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    const data = new PageDto(groups, pageMetaDto);

    return {
      success: true,
      groups: { ...data },
    };
  }

  async remove(id: number, school: School) {
    await this.findOne(id, school);
    try {
      await this.groupRepository.softDelete({ id });
      return { success: true, message: 'group has been deleted' };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('help');
  }
}
