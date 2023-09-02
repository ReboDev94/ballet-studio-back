import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateStatusUserDto,
  UpdateUserDto,
} from './dto';
import { RegisterUserDto } from './dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces/valid-roles';
import { School } from '../school/entities/school.entity';
import { SearchUserDto } from './dto/search-user.dto';
import { UserHasSchoolGuard } from './guards/user-has-school.guard';
import { Auth } from './decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilterImage } from 'src/files/helpers';

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
  deleteUser(
    @GetUser('school') { id: schoolId }: School,
    @Param('userId') userId: number,
  ) {
    return this.authService.deleteUser(userId, schoolId);
  }

  @Patch('update-status-user/:userId')
  @Auth([ValidRoles.admin], { guards: [UserHasSchoolGuard] })
  updateStatusUser(
    @GetUser('school') { id: schoolId }: School,
    @Param('userId') userId: number,
    @Body() updateStatusUser: UpdateStatusUserDto,
  ) {
    return this.authService.updateStatusUser(
      userId,
      schoolId,
      updateStatusUser,
    );
  }

  @Patch('update-profile')
  @Auth([])
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2097152 },
      fileFilter: fileFilterImage,
    }),
  )
  updateProfile(
    @GetUser('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.updateProfile(id, updateUserDto, file);
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
