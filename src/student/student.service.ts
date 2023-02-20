import {
  BadRequestException,
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
import { FilesService } from '../files/files.service';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { PageDto } from '../common/dto/page.dto';
import { SearcStudenthDto } from './dto/search-student.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';

@Injectable()
export class StudentService {
  private readonly logger = new Logger('StudentService');

  constructor(
    @InjectRepository(Tutor)
    private readonly tutorRepository: Repository<Tutor>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly dataSource: DataSource,
    private readonly fileService: FilesService,
  ) {}

  async create(
    school: School,
    file: Express.Multer.File,
    createStudentDto: CreateStudentDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {
        name,
        isOlder,
        dateOfBirth,
        address,
        dieseses,
        tutorName,
        tutorEmail,
        tutorPhone,
        tutorCelPhone,
      } = createStudentDto;

      const student = this.studentRepository.create({
        name,
        dateOfBirth,
        address,
        isOlder,
        dieseses,
        school,
      });

      const dbStudent = await queryRunner.manager.save(student);

      const tutor = this.tutorRepository.create({
        name: isOlder ? name : tutorName,
        email: tutorEmail,
        phone: tutorPhone,
        celPhone: tutorCelPhone,
        student: dbStudent,
      });

      await queryRunner.manager.save(tutor);
      await queryRunner.commitTransaction();

      if (file) {
        const { name } = await this.fileService.uploadS3(
          file,
          `student/${dbStudent.id}/profile/`,
        );
        await this.studentRepository.update(dbStudent.id, {
          avatar: name,
        });
      }

      const studentData = await this.findOne(dbStudent.id, true);
      return {
        success: true,
        data: studentData,
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
    file: Express.Multer.File,
    updateStudentDto: UpdateStudentDto,
  ) {
    const { tutorName, tutorEmail, tutorPhone, tutorCelPhone, ...restDto } =
      updateStudentDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { tutor: preTutor, ...preStudent } = await this.findOne(id);

    try {
      if (file) {
        const { name } = await this.fileService.uploadS3(
          file,
          `student/${id}/profile/`,
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
        name: student.isOlder ? student.name : tutorName,
        email: tutorEmail,
        celPhone: tutorCelPhone,
        phone: tutorPhone,
      });

      await queryRunner.manager.save(student);
      await queryRunner.manager.save(tutor);
      await queryRunner.commitTransaction();

      const studentData = await this.findOne(id, true);
      return {
        success: true,
        data: studentData,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: number, signedAvatar = false) {
    const student = await this.studentRepository.findOneBy({ id });
    if (!student) throw new NotFoundException('student not found');
    if (signedAvatar)
      student.avatar = await this.getUrlSignedAvatar(id, student.avatar);
    return student;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.studentRepository.softDelete({ id });
    return {
      success: true,
    };
  }

  async findAll({ id }: School, searchStudentDto: SearcStudenthDto) {
    const { take, skip, page, name } = searchStudentDto;
    const pageOptionsDto: PageOptionsDto = { take, skip, page };

    const query = 'student.name like :name and student.schoolId = :schoolId';
    const conditions = {
      schoolId: id,
      name: `${name ? name.toLowerCase() : ''}%`,
    };

    const queryBuilder = this.studentRepository.createQueryBuilder('student');
    const itemCount = await queryBuilder.where(query, conditions).getCount();
    const students = await queryBuilder.where(query, conditions).getMany();

    for (const st of students) {
      st.avatar = await this.getUrlSignedAvatar(st.id, st.avatar);
    }

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    const data = new PageDto(students, pageMetaDto);
    return {
      success: true,
      students: { ...data },
    };
  }

  async getUrlSignedAvatar(studentId: number, avatarName: string | null) {
    const url = avatarName
      ? await this.fileService.getPresignedUrlS3(
          `student/${studentId}/profile/${avatarName}`,
        )
      : null;
    return url;
  }

  private handleDBException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('help');
  }
}
