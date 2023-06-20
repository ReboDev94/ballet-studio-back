import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, UpdateStatusUserDto } from './dto';
import { RegisterUserDto } from './dto';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { UpdateSchoolDto } from '../school/dto/update-school.dto';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces/valid-roles';
import { School } from '../school/entities/school.entity';
import { SearchUserDto } from './dto/search-user.dto';
import { UserBelongsSchoolGuard } from './guards/user-belongs-school.guard';

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
    return this.authService.getUser(user);
  }

  @Post('user')
  @Auth(ValidRoles.admin)
  createUser(
    @GetUser('school') school: School,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.authService.createUser(createUserDto, school);
  }

  @Delete('user/:userId')
  @UseGuards(UserBelongsSchoolGuard)
  @Auth(ValidRoles.admin)
  deleteUser(@Param('userId') userId: number) {
    return this.authService.deleteUser(userId);
  }

  @Patch('update-status-user/:userId')
  @Auth(ValidRoles.admin)
  @UseGuards(UserBelongsSchoolGuard)
  updateStatusUser(
    @Param('userId') userId: number,
    @Body() updateStatusUser: UpdateStatusUserDto,
  ) {
    return this.authService.updateStatusUser(userId, updateStatusUser);
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
  getAllUsers(@GetUser() user: User, @Query() searchUserDto: SearchUserDto) {
    const {
      id: userId,
      school: { id: schoolId },
    } = user;
    return this.authService.getAllUsers(userId, schoolId, searchUserDto);
  }
}
