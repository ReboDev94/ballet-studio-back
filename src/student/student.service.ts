import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tutor } from './entities/tutor.entity';
import { Student } from './entities/student.entity';
import { School } from '../school/entities/school.entity';

@Injectable()
export class StudentService {
  private readonly logger = new Logger('StudentService');

  constructor(
    @InjectRepository(Tutor)
    private readonly tutorRepository: Repository<Tutor>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly dataSource: DataSource,
  ) {}

  async create(school: School, createStudentDto: CreateStudentDto) {
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

  findAll() {
    return `This action returns all student`;
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }

  private handleDBException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('help');
  }
}
