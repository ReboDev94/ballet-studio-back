import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities';
import { Group } from '../entities/group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupBelongsSchoolGuard implements CanActivate {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    const groupId = req.params['groupId'] as number;

    if (!user?.school)
      throw new UnauthorizedException('user doesn´t have school');

    const dbGroup = await this.groupRepository.findOne({
      where: { id: groupId, school: { id: user.school.id } },
    });

    if (dbGroup) return true;

    throw new ForbiddenException(
      `Group does not belong to the school ${user.school.name}`,
    );
  }
}
