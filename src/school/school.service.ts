import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { School } from './entities/school.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
  ) {}
  async update(id: number, updateSchoolDto: UpdateSchoolDto) {
    const school = await this.schoolRepository.preload({
      id,
      ...updateSchoolDto,
    });
    if (!school) throw new NotFoundException('school not found');
    const dbSchool = await this.schoolRepository.save(school);
    return dbSchool;
  }
}
