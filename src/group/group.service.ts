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
    if (!dbGroup) throw new NotFoundException('group not found');
    return dbGroup;
  }

  private handleDBException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('help');
  }

  /* async allStudentsByGroup(
    groupId: number,
    searchStudentDto: SearchStudenthDto,
  ) {
    const { order, page, take, skip, name } = searchStudentDto;
    const pageOptionsDto: PageOptionsDto = { take, skip, page };

    const query = 'groupStudents.groupId = :groupId';

    const conditions = {
      groupId,
    };

    const queryBuilder = this.groupStudentsRepository
      .createQueryBuilder('groupStudents')
      .where(query, conditions)
      .leftJoinAndSelect('groupStudents.student', 'student')
      .andWhere('student.name like :name', {
        name: `${name ? name.toLowerCase() : ''}%`,
      })
      .orderBy('groupStudents.id', order);

    const itemCount = await queryBuilder.getCount();
    const groupStudents = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    const data = new PageDto(groupStudents, pageMetaDto);
    return {
      success: true,
      students: { ...data },
    };
  }

  async findStudentGroupAlthoughItWasRemoved(
    studentId: number,
    groupId: number,
  ) {
    // const groupStudent = await this.groupStudentsRepository.findOne({
    //   where: {
    //     student: { id: studentId },
    //     group: { id: groupId },
    //   },
    //   withDeleted: true,
    // });
    // return groupStudent;
  }

  async addStudents(
    groupId: number,
    addStudentsGroupDto: AddOrRemoveStudentsGroup,
    school: School,
  ) {
    const { students } = addStudentsGroupDto;
    const studentsEntities = await this.studentService.getEntitiesByIds(
      students,
      school,
    );

    if (studentsEntities.length !== students.length)
      throw new NotFoundException('Students not found');

    try {
      const groupStudents: GroupStudents[] = [];
      for (const { id: studentId } of studentsEntities) {
        const groupStudentExits =
          await this.findStudentGroupAlthoughItWasRemoved(studentId, groupId);

        if (groupStudentExits) {
          groupStudentExits.deletedAt = null;
          groupStudents.push(groupStudentExits);
        } else {
          groupStudents.push(
            this.groupStudentsRepository.create({
              student: { id: studentId },
              group: { id: groupId },
            }),
          );
        }
      }

      await this.groupStudentsRepository.save(groupStudents);
      return {
        success: true,
        message: 'students are now part of the group',
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async removeStudents(
    groupId: number,
    addOrRemoveStudentsGroup: AddOrRemoveStudentsGroup,
  ) {
    const { students } = addOrRemoveStudentsGroup;

    try {
      await this.dataSource
        .createQueryBuilder()
        .update(GroupStudents)
        .set({ deletedAt: new Date() })
        .where('studentId IN (:...studentsIds) and groupId = :groupId', {
          studentsIds: students,
          groupId,
        })
        .execute();

      return {
        success: true,
        message: 'students have been removed',
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAllGroupStudentsByGroup(groupId: number) {
    const groupStudents = await this.groupStudentsRepository.find({
      where: { group: { id: groupId } },
    });
    return groupStudents;
  }

  async findGroupStudentsNotOnRollCall(groupId: number, date: string) {
    const queryBuilder = await this.groupStudentsRepository
      .createQueryBuilder('gs')
      .leftJoinAndSelect(
        'gs.rollCall',
        'rc',
        'gs.id = rc.groupStudentId AND rc.date = :date',
        { date },
      )
      .leftJoinAndSelect('gs.student', 's', 's.id = gs.studentId')
      .where(
        'gs.groupId = :groupId AND (rc.date IS NULL OR rc.date != :date)',
        { groupId, date },
      )
      .select([
        'gs.id as id',
        'gs.groupId as groupId',
        's.id as studentId',
        'INITCAP(s.name) as studentName',
      ])
      .getRawMany();
    return queryBuilder;
  }

  async findAllGroupStudentsByIds(groupStudentIds: number[], groupId: number) {
    const dbGroupStudent = await this.groupStudentsRepository.find({
      where: { id: In(groupStudentIds), group: { id: groupId } },
    });
    return dbGroupStudent;
  }

*/
}
