import { Body, Controller, Get, Patch, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto';
import { RegisterUserDto } from './dto';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { UpdateSchoolDto } from '../school/dto/update-school.dto';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('register')
  register(@Body() createAccountDto: RegisterUserDto) {
    return this.authService.register(createAccountDto);
  }

  @Get('user')
  @Auth()
  getUser(@GetUser() user: User) {
    delete user.school;
    return this.authService.getUser(user);
  }

  @Patch('update-profile')
  @Auth()
  updateProfile(
    @GetUser('id') id: number,
    @Body() updateUserDto: UpdateSchoolDto,
  ) {
    return this.authService.updateProfile(id, updateUserDto);
  }
}
