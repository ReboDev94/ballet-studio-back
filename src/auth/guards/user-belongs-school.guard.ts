import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserBelongsSchoolGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userReq = req.user as User;
    const userId = req.params['userId'] as number;

    if (!userReq?.school)
      throw new UnauthorizedException('user doesn´t have school');

    const user = await this.userRepository.findOneBy({
      id: userId,
      school: { id: userReq.school.id },
    });

    if (user) return true;
    throw new ForbiddenException('User does not belongs to the school');
  }
}
