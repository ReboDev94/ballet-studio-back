import {
  ExecutionContext,
  InternalServerErrorException,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { User } from '../entities';

type userType = keyof User;

export const GetUser = createParamDecorator(
  (data: userType | 'get-user' = 'get-user', ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user) throw new InternalServerErrorException('user not found');
    if (data !== 'get-user' && !user.school)
      throw new UnauthorizedException('user doesn´t have school');
    return data !== 'get-user' ? user[data] : user;
  },
);
