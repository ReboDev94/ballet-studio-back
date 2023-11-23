import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOptionsSelect,
  In,
  Like,
  Repository,
} from 'typeorm';

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
import slugify from 'slugify';
@Injectable()
export class GroupService {
  private readonly logger = new Logger('groupService');

  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly authService: AuthService,
  ) {}

  async createSlug(name: string) {
    let newSlug = slugify(name, {
      replacement: '-',
      remove: undefined,
      lower: true,
      locale: 'es',
    });

    const queryBuilder = this.groupRepository.createQueryBuilder('group');
    const similarSlugs = await queryBuilder
      .where('slug = :slug', {
        slug: newSlug,
      })
      .orWhere('slug like :slug2', { slug2: `${newSlug}-%` })
      .getMany();

    if (similarSlugs.length >= 1) {
      const maxId = similarSlugs
        .map(({ slug }) => {
          const parts = slug.split('-');
          const last = parseInt(parts[parts.length - 1], 10);
          if (!isNaN(last)) return last;
        })
        .filter((v) => Number(v))
        .reduce((a, b) => Math.max(a, b), 0);

      newSlug += `-${maxId + 1}`;
    }

    return newSlug;
  }

  async create(createGroupDto: CreateGroupDto, school: School) {
    const { name, teacherId, schoolCycle, degree } = createGroupDto;
    const slug = await this.createSlug(name);
    const schedules = Object.keys(Days).map((k) => ({
      day: k,
      hour: createGroupDto[`schedule${k}`],
    }));

    const { id: schoolId } = school;
    const teacher = await this.authService.findOneTeacher(teacherId, schoolId);

    try {
      const group = this.groupRepository.create({
        name,
        slug,
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
    const { name } = await this.findOneBySchool(groupId, schoolId);

    const { teacherId, name: nameP } = updateGroupDto;

    if (teacherId) {
      const teacher = await this.authService.findOneTeacher(
        teacherId,
        schoolId,
      );
      updateGroupDto.teacher = teacher;
    }

    const schedules = Object.keys(Days).map((k) => ({
      day: k,
      hour: updateGroupDto[`schedule${k}`],
    }));

    try {
      const preGroup = await this.groupRepository.preload({
        ...updateGroupDto,
        id: groupId,
        schedules,
      });

      if (nameP.toLowerCase() !== name.toLowerCase()) {
        preGroup.slug = await this.createSlug(nameP);
      }

      await this.groupRepository.save(preGroup);

      return {
        success: true,
        message: 'group has been updated',
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findOne(slug: string, schoolId: number) {
    const dbGroup = await this.findOneBySlug(slug, schoolId, {
      id: true,
      name: true,
      slug: true,
      teacher: {
        id: true,
        name: true,
      },
    });
    return { success: true, group: dbGroup };
  }

  async findAll({ id: schoolId }: School, searchGroupDto: SearchGroupDto) {
    const {
      page,
      take,
      order,
      skip,
      degree = [],
      teacher,
      schoolCycle,
    } = searchGroupDto;
    const conditions: FindManyOptions<Group> = {
      select: {
        teacher: {
          id: true,
          name: true,
        },
      },
      where: {
        school: {
          id: schoolId,
        },
        schoolCycle,
      },
      relations: {
        teacher: true,
        students: true,
      },
      order: {
        name: order,
      },
    };

    if (degree && degree.length > 0)
      conditions.where['degree'] = In([...degree]);
    if (teacher) conditions.where['teacher'] = { name: Like(`${teacher}%`) };

    const itemCount = await this.groupRepository.count(conditions);

    conditions.take = take;
    conditions.skip = skip;
    const groups = (await this.groupRepository.find(conditions)).map(
      (group) => {
        group.noStudents = group.students.length;
        delete group.students;
        return group;
      },
    );

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

  async findOneBySlug(
    slug: string,
    schoolId: number,
    selectFields: FindOptionsSelect<Group> = {},
  ) {
    const dbGroup = await this.groupRepository.findOne({
      select: { ...selectFields },
      where: {
        slug,
        school: { id: schoolId },
      },
      relations: {
        teacher: true,
      },
      loadEagerRelations: false,
    });
    if (!dbGroup)
      throw new NotFoundException({ key: 'operations.GROUP.NOT_FOUND' });

    return dbGroup;
  }

  async findOneBySchool(groupId: number, schoolId: number) {
    const dbGroup = await this.groupRepository.findOne({
      where: { id: groupId, school: { id: schoolId } },
      relations: {
        teacher: true,
        students: true,
      },
    });
    if (!dbGroup)
      throw new NotFoundException({ key: 'operations.GROUP.NOT_FOUND' });

    dbGroup.noStudents = dbGroup.students.length;
    delete dbGroup.students;
    return dbGroup;
  }

  private handleDBException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('help');
  }
}
