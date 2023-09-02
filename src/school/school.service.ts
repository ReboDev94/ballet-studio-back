import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { School } from './entities/school.entity';
import { FilesService } from 'src/files/files.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { User } from 'src/auth/entities';

@Injectable()
export class SchoolService {
  private readonly logger = new Logger('SchoolService');
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
    private readonly fileService: FilesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    user: User,
    file: Express.Multer.File,
    createSchoolDto: CreateSchoolDto,
  ) {
    const hasSchool = !!user.school;
    if (hasSchool)
      throw new PreconditionFailedException({
        key: 'operations.USER.HAS_SCHOOL',
      });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const school = this.schoolRepository.create({ ...createSchoolDto });
      const dbSchool = await queryRunner.manager.save(school);
      await queryRunner.manager.update(User, user.id, { school: dbSchool });
      await queryRunner.commitTransaction();
      if (file) {
        const dbSchoolUpdate = await this.update(dbSchool.id, file, {});
        return dbSchoolUpdate;
      }
      const schoolFind = await this.findOne(dbSchool.id, true);
      return {
        success: true,
        school: schoolFind,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    schoolId: number,
    file: Express.Multer.File,
    updateSchoolDto: UpdateSchoolDto,
  ) {
    const school = await this.schoolRepository.preload({
      id: schoolId,
      ...updateSchoolDto,
    });

    if (!school)
      throw new NotFoundException({ key: 'operations.SCHOOL.NOT_FOUND' });

    try {
      if (file) {
        const { name } = await this.fileService.uploadS3(
          file,
          `school/${schoolId}/profile/`,
          school.logo,
        );
        school.logo = name;
      }
      await this.schoolRepository.save(school);
      const dbSchool = await this.findOne(schoolId, true);
      return {
        success: true,
        school: dbSchool,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async getSchool(school: School) {
    school.logo = await this.generatePresignedUrlLogoSchool(
      school.id,
      school.logo,
    );
    return {
      success: true,
      school: school,
    };
  }

  async generatePresignedUrlLogoSchool(schoolId: number, logo: string | null) {
    const url = logo
      ? await this.fileService.getPresignedUrlS3(
          `school/${schoolId}/profile/${logo}`,
        )
      : null;
    return url;
  }

  async findOne(schoolId: number, presignedUrl = false) {
    const dbSchool = await this.schoolRepository.findOneBy({ id: schoolId });
    if (!dbSchool)
      throw new NotFoundException({ key: 'operations.SCHOOL.NOT_FOUND' });

    if (presignedUrl) {
      dbSchool.logo = await this.generatePresignedUrlLogoSchool(
        dbSchool.id,
        dbSchool.logo,
      );
    }
    return dbSchool;
  }

  private handleDBException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('help');
  }
}
