import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { School } from './entities/school.entity';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class SchoolService {
  private readonly logger = new Logger('SchoolService');
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
    private readonly fileService: FilesService,
  ) {}
  async update(
    schoolId: number,
    file: Express.Multer.File,
    updateSchoolDto: UpdateSchoolDto,
  ) {
    const school = await this.schoolRepository.preload({
      id: schoolId,
      ...updateSchoolDto,
    });
    if (!school) throw new NotFoundException('school not found');

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
      return {
        success: true,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findOne(school: School) {
    return {
      success: true,
      school,
    };
  }

  private handleDBException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('help');
  }
}
