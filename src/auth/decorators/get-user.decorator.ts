import {
  ExecutionContext,
  InternalServerErrorException,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!user) throw new InternalServerErrorException('user not found');
    if (!user.school)
      throw new UnauthorizedException('user doesn´t have school');
    return data ? user[data] : user;
  },
);
