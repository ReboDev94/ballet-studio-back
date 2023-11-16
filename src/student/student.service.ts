import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tutor } from './entities/tutor.entity';
import { Student } from './entities/student.entity';
import { School } from '../school/entities/school.entity';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { PageDto } from '../common/dto/page.dto';
import { SearchStudenthDto } from './dto/search-student.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { FilesStudentService } from 'src/files/files.student.service';
import { IsOlder } from 'src/common/utils';

@Injectable()
export class StudentService {
  private readonly logger = new Logger('StudentService');

  constructor(
    @InjectRepository(Tutor)
    private readonly tutorRepository: Repository<Tutor>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly dataSource: DataSource,
    private readonly fileStudentService: FilesStudentService,
  ) {}

  async create(
    file: Express.Multer.File,
    createStudentDto: CreateStudentDto,
    school: School,
  ) {
    const isOlder = IsOlder(createStudentDto.dateOfBirth);
    if (isOlder) {
      createStudentDto.tutorName = createStudentDto.name;
    }

    const {
      name,
      dateOfBirth,
      address,
      dieseses,
      tutorName,
      tutorEmail,
      tutorPhone,
      tutorCelPhone,
    } = createStudentDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const student = this.studentRepository.create({
        name,
        dateOfBirth,
        address,
        dieseses,
        school,
      });
      const dbStudent = await queryRunner.manager.save(student);

      const tutor = this.tutorRepository.create({
        name: tutorName,
        email: tutorEmail,
        phone: tutorPhone,
        celPhone: tutorCelPhone,
        student: dbStudent,
      });
      await queryRunner.manager.save(tutor);
      await queryRunner.commitTransaction();

      if (file) {
        const { name } = await this.fileStudentService.uploadLogoStudent(
          file,
          dbStudent.id,
        );
        await this.studentRepository.update(dbStudent.id, {
          avatar: name,
        });
      }

      const studentData = await this.findOneStudentBySchool(
        dbStudent.id,
        school.id,
        true,
      );
      return {
        success: true,
        student: studentData,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: number,
    school: School,
    file: Express.Multer.File,
    updateStudentDto: UpdateStudentDto,
  ) {
    const { tutor: preTutor, ...preStudent } =
      await this.findOneStudentBySchool(id, school.id);

    const { tutorName, tutorEmail, tutorPhone, tutorCelPhone, ...restDto } =
      updateStudentDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (file) {
        const { name } = await this.fileStudentService.uploadLogoStudent(
          file,
          id,
          preStudent.avatar,
        );
        preStudent.avatar = name;
      }

      const student = await this.studentRepository.preload({
        ...preStudent,
        ...restDto,
      });

      const tutor = await this.tutorRepository.preload({
        ...preTutor,
        name: tutorName ? tutorName : student.name,
        email: tutorEmail,
        celPhone: tutorCelPhone,
        phone: tutorPhone,
      });

      await queryRunner.manager.save(student);
      await queryRunner.manager.save(tutor);
      await queryRunner.commitTransaction();

      const studentData = await this.findOneStudentBySchool(
        id,
        school.id,
        true,
      );
      return {
        success: true,
        student: studentData,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(studentId: number, school: School) {
    const student = await this.findOneStudentBySchool(studentId, school.id);
    await this.studentRepository.softDelete({ id: student.id });
    return {
      success: true,
    };
  }

  async findAll(searchStudentDto: SearchStudenthDto, { id }: School) {
    const { take, skip, page, name, order } = searchStudentDto;
    const pageOptionsDto: PageOptionsDto = { take, skip, page };

    const query = 'student.name like :name and student.schoolId = :schoolId';
    const conditions = {
      schoolId: id,
      name: `${name ? name.toLowerCase() : ''}%`,
    };

    const queryBuilder = this.studentRepository.createQueryBuilder('student');

    const itemCount = await queryBuilder.where(query, conditions).getCount();
    const students = await queryBuilder
      .where(query, conditions)
      .leftJoinAndSelect('student.tutor', 'tutor')
      .orderBy('student.name', order)
      .getMany();

    for (const st of students) {
      st.avatar = await this.fileStudentService.getUrlSignedAvatar(
        st.id,
        st.avatar,
      );
    }

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    const data = new PageDto(students, pageMetaDto);
    return {
      success: true,
      students: { ...data },
    };
  }

  async findOneStudentBySchool(
    studentId: number,
    schoolId: number,
    signedAvatar = false,
  ) {
    const student = await this.studentRepository.findOne({
      where: { school: { id: schoolId }, id: studentId },
    });
    if (!student)
      throw new NotFoundException({
        key: 'operations.SCHOOL.STUDENTS_NOT_FOUND',
      });

    if (signedAvatar)
      student.avatar = await this.fileStudentService.getUrlSignedAvatar(
        student.id,
        student.avatar,
      );
    return student;
  }

  async getEntitiesByIds(studentIds: number[], { id: schoolId }: School) {
    const queryBuilder = this.studentRepository.createQueryBuilder('student');
    const students = await queryBuilder
      .where('student.id IN (:...studentIds) and "schoolId" = :schoolId', {
        studentIds,
        schoolId,
      })
      .getMany();
    return students;
  }

  private handleDBException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('help');
  }
}
