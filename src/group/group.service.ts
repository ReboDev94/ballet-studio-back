import {
  Injectable,
  InternalServerErrorException,
  Logger,
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

  async create(school: School, createGroupDto: CreateGroupDto) {
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

  async findOne(id: number) {
    const dbGroup = await this.groupRepository.findOne({
      where: { id },
      relations: { teacher: true },
    });
    return dbGroup;
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

  /*
  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  } */

  private handleDBException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('help');
  }
}
