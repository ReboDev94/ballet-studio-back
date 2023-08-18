import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { User } from '../entities';
import { METADATA_LABEL } from '../constants';
import { IMetadata } from '../interfaces/auth-decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const metadata = this.reflector.get<IMetadata>(
      METADATA_LABEL,
      context.getHandler(),
    );

    const validRoles: string[] = metadata.roles;

    if (!validRoles || validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) throw new BadRequestException('User not found');

    for (const role of user.roles) {
      if (validRoles.includes(role.slug)) return true;
    }
    throw new ForbiddenException(
      `User ${user.name} need a valid role [${validRoles}]`,
    );
  }
}
