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

@Injectable()
export class SchoolService {
  private readonly logger = new Logger('SchoolService');
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
  ) {}
  async update(idSchool: number, updateSchoolDto: UpdateSchoolDto) {
    const school = await this.schoolRepository.preload({
      id: idSchool,
      ...updateSchoolDto,
    });
    if (!school) throw new NotFoundException('school not found');

    try {
      await this.schoolRepository.save(school);
      return {
        success: true,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('help');
  }
}
