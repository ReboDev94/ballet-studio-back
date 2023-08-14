import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, UpdateStatusUserDto } from './dto';
import { RegisterUserDto } from './dto';
import { GetUser } from './decorators/get-user.decorator';
import { UpdateSchoolDto } from '../school/dto/update-school.dto';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces/valid-roles';
import { School } from '../school/entities/school.entity';
import { SearchUserDto } from './dto/search-user.dto';
import { UserHasSchoolGuard } from './guards/user-has-school.guard';
import { Auth } from './decorators/auth.decorator';

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
  @Auth([])
  getUser(@GetUser() user: User) {
    return this.authService.getUser(user);
  }

  @Post('user')
  @Auth([ValidRoles.admin], { guards: [UserHasSchoolGuard] })
  createUser(
    @GetUser('school') school: School,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.authService.createUser(createUserDto, school);
  }

  @Delete('user/:userId')
  @Auth([ValidRoles.admin], { guards: [UserHasSchoolGuard] })
  deleteUser(@Param('userId') userId: number) {
    return this.authService.deleteUser(userId);
  }

  @Patch('update-status-user/:userId')
  @Auth([ValidRoles.admin], { guards: [UserHasSchoolGuard] })
  updateStatusUser(
    @Param('userId') userId: number,
    @Body() updateStatusUser: UpdateStatusUserDto,
  ) {
    return this.authService.updateStatusUser(userId, updateStatusUser);
  }

  @Patch('update-profile')
  @Auth([])
  updateProfile(
    @GetUser('id') id: number,
    @Body() updateUserDto: UpdateSchoolDto,
  ) {
    return this.authService.updateProfile(id, updateUserDto);
  }

  @Get('users')
  @Auth([ValidRoles.admin], { guards: [UserHasSchoolGuard] })
  getAllUsers(
    @GetUser('id') id: number,
    @GetUser('school') school: School,
    @Query() searchUserDto: SearchUserDto,
  ) {
    return this.authService.getAllUsers(id, school.id, searchUserDto);
  }
}
