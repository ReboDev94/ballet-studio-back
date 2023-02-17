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
import { FilesService } from '../files/files.service';

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

      const tutor = this.tutorRepository.create({
        name: isOlder ? name : tutorName,
        email: tutorEmail,
        phone: tutorPhone,
        celPhone: tutorCelPhone,
      });
      const dbTutor = await queryRunner.manager.save(tutor);

      const student = this.studentRepository.create({
        name,
        dateOfBirth,
        address,
        isOlder,
        dieseses,
        tutor: dbTutor,
        school,
      });

      const dbStudent = await queryRunner.manager.save(student);
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

      const studentData = await this.findOne(dbStudent.id);
      /* TODO: RETURN FINDONE STUDENT */
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

    const student = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const preStudent = await this.studentRepository.preload({
        ...student,
        ...restDto,
      });

      const preTutor = await this.tutorRepository.preload({
        ...preStudent.tutor,
        name: preStudent.isOlder ? preStudent.name : tutorName,
        email: tutorEmail,
        celPhone: tutorCelPhone,
        phone: tutorPhone,
      });

      preStudent.tutor = preTutor;

      if (file) {
        const { name } = await this.fileService.uploadS3(
          file,
          `student/${preStudent.id}/profile/`,
          preStudent.avatar,
        );
        preStudent.avatar = name;
      }

      await queryRunner.manager.save(preStudent);
      await queryRunner.commitTransaction();

      const dbStudent = await this.findOne(preStudent.id);
      return {
        success: true,
        data: dbStudent,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: number) {
    const student = await this.studentRepository.findOneBy({ id });
    if (!student) throw new NotFoundException('student not found');
    return student;
  }

  findAll() {
    return `This action returns all student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }

  private handleDBException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('help');
  }
}
