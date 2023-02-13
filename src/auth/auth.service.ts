import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload';
import { RegisterUserDto } from './dto';
import { School } from '../school/entities/school.entity';
import { Role } from './entities/role.entity';
import { ValidRoles } from './interfaces/valid-roles';
import { UpdateSchoolDto } from '../school/dto/update-school.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UpdateStatusUserDto } from './dto/update-status-user.dto';
@Injectable()
export class AuthService {
  private readonly DEFAULT_ROLE = ValidRoles.admin;
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly dataSource: DataSource,
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

  async register(createAccountDto: RegisterUserDto) {
    const { email, password, name, nameSchool } = createAccountDto;

    const exitsEmail = await this.userRepository.findOneBy({ email });
    if (exitsEmail) throw new BadRequestException('email alredy exits');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const role = await this.roleRepository.findOneBy({
        slug: this.DEFAULT_ROLE,
      });

      const school = this.schoolRepository.create({
        name: nameSchool,
        directorName: name,
      });

      const user = this.userRepository.create({
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        isOwner: true,
        roles: [role],
      });

      const dbSchool = await queryRunner.manager.save(school);
      user.school = dbSchool;
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      return {
        success: true,
        message: 'User has been registered',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async getUser(user: User) {
    return {
      success: true,
      user,
    };
  }

  async createUser(school: School, createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const exitsEmail = await this.userRepository.findOneBy({ email });
    if (exitsEmail) throw new BadRequestException('email alredy exits');

    try {
      const user = this.userRepository.create({
        ...createUserDto,
        password: bcrypt.hashSync(password, 10),
        school,
      });

      const dbUser = await this.userRepository.save(user);

      return {
        success: true,
        data: dbUser,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async deleteUser(id: number, schoolId: number) {
    const dbUser = await this.userRepository.findOneBy({
      id,
      school: { id: schoolId },
    });

    if (!dbUser) throw new NotFoundException('User not found');
    try {
      await this.userRepository.softDelete({ id });
      return { success: true, message: 'User deleted' };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async updateStatusUser(
    id: number,
    updateStatusUser: UpdateStatusUserDto,
    schoolId: number,
  ) {
    const dbUser = await this.userRepository.findOneBy({
      id,
      school: { id: schoolId },
    });

    if (!dbUser) throw new NotFoundException('user not found');
    const { status } = updateStatusUser;
    try {
      await this.userRepository.update(id, { isActive: status });
      return {
        success: true,
        message: 'User status is updated',
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async getAllUsers(
    userId: number,
    schoolId: number,
    paginationDto: PaginationDto,
  ) {
    const { page = 1 } = paginationDto;
    const limit = 15;
    const offset = (page - 1) * 15;

    const users = await this.userRepository.find({
      take: limit,
      skip: offset,
      where: { id: Not(userId), school: { id: schoolId } },
    });

    return {
      success: true,
      data: users,
    };
  }

  async updateProfile(id: number, updateUserDto: UpdateSchoolDto) {
    try {
      await this.userRepository.update(id, updateUserDto);
      return {
        success: true,
        message: 'User has been updated',
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  private getJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBException(error: any) {
    // if (error.code == '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('help');
  }
}
