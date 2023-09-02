import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { User } from '../entities';

type userType = keyof User;

export const GetUser = createParamDecorator(
  (data: userType, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user)
      throw new BadRequestException({ key: 'operations.USER.NOT_FOUND' });
    return data ? user[data] : user;
  },
);
