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
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { UpdateSchoolDto } from '../school/dto/update-school.dto';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces/valid-roles';
import { PaginationDto } from '../common/dto/pagination.dto';
import { School } from '../school/entities/school.entity';

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

  @Post('user')
  @Auth(ValidRoles.admin)
  createUser(
    @GetUser('school') school: School,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.authService.createUser(school, createUserDto);
  }

  @Delete('user/:id')
  @Auth(ValidRoles.admin)
  deleteUser(
    @GetUser('school') { id: schoolId }: School,
    @Param('id') id: number,
  ) {
    return this.authService.deleteUser(id, schoolId);
  }

  @Patch('update-status-user/:id')
  @Auth(ValidRoles.admin)
  updateStatusUser(
    @GetUser('school') { id: schoolId }: School,
    @Param('id') id: number,
    @Body() updateStatusUser: UpdateStatusUserDto,
  ) {
    return this.authService.updateStatusUser(id, updateStatusUser, schoolId);
  }

  @Patch('update-profile')
  @Auth()
  updateProfile(
    @GetUser('id') id: number,
    @Body() updateUserDto: UpdateSchoolDto,
  ) {
    return this.authService.updateProfile(id, updateUserDto);
  }

  @Get('users')
  @Auth(ValidRoles.admin)
  getAllUsers(@GetUser() user: User, @Query() paginationDto: PaginationDto) {
    const {
      id: userId,
      school: { id: schoolId },
    } = user;
    return this.authService.getAllUsers(userId, schoolId, paginationDto);
  }
}
