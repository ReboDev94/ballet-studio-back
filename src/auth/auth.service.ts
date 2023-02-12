import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        password: true,
        name: true,
        phone: true,
        email: true,
        isOwner: true,
        isActive: true,
        roles: true,
      },
    });
    if (!user) throw new UnauthorizedException('credentials are not valid');
    if (!user.isActive)
      throw new UnauthorizedException('inactive user - contact support');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid');

    delete user.password;
    return {
      ...user,
      token: this.getJwt({ id: user.id }),
    };
  }

  private getJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  /*
  TODO: COMPROBAR QUE EL email SEA UNICO
  - CREAR SCHOOL
  - CREAR USER CON ROLE ADMIN
  */
  register(createAccountDto: CreateAccountDto) {
    return createAccountDto;
  }
}
