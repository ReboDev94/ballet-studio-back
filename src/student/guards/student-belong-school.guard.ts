import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
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

    if (!user?.school)
      throw new UnauthorizedException('user doesn´t have school');

    const student = await this.studentRepository.findOne({
      where: { id: studentId, school: { id: user.school.id } },
    });

    if (student) return true;
    throw new ForbiddenException('User does not belongs to the school');
  }
}
