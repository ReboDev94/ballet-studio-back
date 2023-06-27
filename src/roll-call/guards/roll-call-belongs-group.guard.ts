import { RollCall } from './../entities/rollCall.entity';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Injectable()
export class RollCallBelongsGroupGuard implements CanActivate {
  constructor(
    @InjectRepository(RollCall)
    private readonly rollCallRepository: Repository<RollCall>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    const rollCallId = req.params['rollCallId'];

    if (!user?.school)
      throw new UnauthorizedException('user doesn´t have school');

    const queryBuilder = this.rollCallRepository
      .createQueryBuilder('rollCall')
      .leftJoinAndSelect('rollCall.groupStudent', 'groupStudent')
      .leftJoinAndSelect('groupStudent.group', 'group');

    const dbRollCall = await queryBuilder
      .where('rollCall.id = :rollCallId', {
        rollCallId,
      })
      .andWhere('group.schoolId = :schoolId', { schoolId: user.school.id })
      .getOne();

    if (dbRollCall) return true;
    throw new ForbiddenException('rollCall does not belongs to group');
  }
}
