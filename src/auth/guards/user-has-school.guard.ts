import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../entities';

@Injectable()
export class UserHasSchoolGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userReq = req.user as User;

    if (!userReq?.school)
      throw new UnauthorizedException({
        key: 'operations.USER.HAS_NOT_SCHOOL',
      });

    return true;
  }
}
