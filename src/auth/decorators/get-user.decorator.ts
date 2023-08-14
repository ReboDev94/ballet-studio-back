import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { User } from '../entities';

type userType = keyof User;

export const GetUser = createParamDecorator(
  (data: userType, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user) throw new InternalServerErrorException('user not found');
    return data ? user[data] : user;
  },
);
