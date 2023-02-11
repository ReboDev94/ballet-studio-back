import { Controller, Body, Patch } from '@nestjs/common';
import { SchoolService } from './school.service';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { School } from './entities/school.entity';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Patch()
  @Auth(ValidRoles.admin)
  update(
    @GetUser('school') { id }: School,
    @Body() updateSchoolDto: UpdateSchoolDto,
  ) {
    return this.schoolService.update(id, updateSchoolDto);
  }
}
