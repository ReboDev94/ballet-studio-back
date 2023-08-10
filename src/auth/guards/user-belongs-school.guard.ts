import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../entities';

@Injectable()
export class UserBelongsSchoolGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userReq = req.user as User;

    if (!userReq?.school)
      throw new UnauthorizedException('user doesn´t have school');

    return true;
  }
}
