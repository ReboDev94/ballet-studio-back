import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentBelongSchoolGuard implements CanActivate {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    const studentId = req.params['studentId'] as number;

    const student = await this.studentRepository.findOne({
      where: { id: studentId, school: { id: user.school.id } },
    });

    if (student) return true;
    throw new ForbiddenException('User does not belongs to the school');
  }
}
