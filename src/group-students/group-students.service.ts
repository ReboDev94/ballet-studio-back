import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GroupService } from 'src/group/group.service';
import { School } from 'src/school/entities/school.entity';
import { AddOrRemoveStudentsGroupDto } from './dto/add-remove-students-group.dto';
import { StudentService } from 'src/student/student.service';
import { GroupStudent } from './entities/group-student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { SearchStudenthDto } from 'src/student/dto/search-student.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageDto } from 'src/common/dto/page.dto';

@Injectable()
export class GroupStudentsService {
  private readonly logger = new Logger('groupStudents');
  constructor(
    @InjectRepository(GroupStudent)
    private readonly groupStudentsRepository: Repository<GroupStudent>,
    private readonly groupService: GroupService,
    private readonly studentService: StudentService,
    private readonly dataSource: DataSource,
  ) {}

  async addStudentsToGroup(
    groupId: number,
    school: School,
    addStudentsGroupDto: AddOrRemoveStudentsGroupDto,
  ) {
    await this.groupService.findOneBySchool(groupId, school.id);
    const { students } = addStudentsGroupDto;
    const studentsEntities = await this.studentService.getEntitiesByIds(
      students,
      school,
    );

    if (studentsEntities.length !== students.length)
      throw new NotFoundException('some of the students not found');

    try {
      const groupStudents: GroupStudent[] = [];
      for (const { id: studentId } of studentsEntities) {
        const groupStudentExits = await this.findStudentGroupThoughItWasRemoved(
          studentId,
          groupId,
        );

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

  async removeStudentsToGroup(
    groupId: number,
    school: School,
    addOrRemoveStudentsGroup: AddOrRemoveStudentsGroupDto,
  ) {
    await this.groupService.findOneBySchool(groupId, school.id);
    const { students } = addOrRemoveStudentsGroup;

    try {
      await this.dataSource
        .createQueryBuilder()
        .update(GroupStudent)
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

  async allStudentsByGroup(
    groupId: number,
    school: School,
    searchStudentDto: SearchStudenthDto,
  ) {
    await this.groupService.findOneBySchool(groupId, school.id);
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

  async findStudentGroupThoughItWasRemoved(studentId: number, groupId: number) {
    const groupStudent = await this.groupStudentsRepository.findOne({
      where: {
        student: { id: studentId },
        group: { id: groupId },
      },
      withDeleted: true,
    });
    return groupStudent;
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

  private handleDBException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('help');
  }
}
