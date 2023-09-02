import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload';
import { RegisterUserDto } from './dto';
import { School } from '../school/entities/school.entity';
import { Role } from './entities/role.entity';
import { ValidRoles } from './interfaces/valid-roles';
import { UpdateStatusUserDto } from './dto/update-status-user.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { PageDto } from '../common/dto/page.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { FilesService } from 'src/files/files.service';
@Injectable()
export class AuthService {
  private readonly DEFAULT_ROLE = ValidRoles.admin;
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly fileService: FilesService,
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
        photo: true,
      },
      relations: { school: true },
    });
    if (!user)
      throw new UnauthorizedException({
        key: 'operations.CREDENTIALS_ARE_NO_VALIDS',
      });
    if (!user.isActive)
      throw new UnauthorizedException({ key: 'operations.USER.INACTIVE' });

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException({
        key: 'operations.CREDENTIALS_ARE_NO_VALIDS',
      });

    delete user.password;
    const hasSchool = !!user.school;
    delete user.school;

    const urlPhoto = await this.getPresignedUrl(user.id, user.photo);
    user.photo = urlPhoto;

    return {
      success: true,
      user: { ...user, hasSchool },
      token: this.getJwt({ id: user.id }),
    };
  }

  async register(createAccountDto: RegisterUserDto) {
    const { email, password } = createAccountDto;

    const exitsEmail = await this.userRepository.findOneBy({ email });
    if (exitsEmail)
      throw new BadRequestException({ key: 'operations.EMAIL.ALREDY_EXITS' });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const role = await this.roleRepository.findOneBy({
        slug: this.DEFAULT_ROLE,
      });

      const user = this.userRepository.create({
        email,
        password: bcrypt.hashSync(password, 10),
        isOwner: true,
        roles: [role],
      });

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
    const hasSchool = !!user.school;
    delete user.school;

    const urlPhoto = await this.getPresignedUrl(user.id, user.photo);
    user.photo = urlPhoto;

    return {
      success: true,
      user: {
        ...user,
        hasSchool,
      },
    };
  }

  async createUser(createUserDto: CreateUserDto, school: School) {
    const { email, password } = createUserDto;
    const exitsEmail = await this.userRepository.findOneBy({ email });
    if (exitsEmail)
      throw new BadRequestException({ key: 'operations.EMAIL.ALREDY_EXITS' });

    try {
      const { roles, ...rest } = createUserDto;

      const dbRoles = await this.roleRepository.find({
        where: { slug: In(roles) },
      });

      const user = this.userRepository.create({
        ...rest,
        roles: dbRoles,
        password: bcrypt.hashSync(password, 10),
        school,
      });

      const dbUser = await this.userRepository.save(user);

      return {
        success: true,
        user: dbUser,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async deleteUser(userId: number, schoolId: number) {
    const dbUser = await this.userRepository.findOneBy({
      id: userId,
      isOwner: false,
      school: { id: schoolId },
    });

    if (!dbUser)
      throw new NotFoundException({ key: 'operations.USER.NOT_FOUND' });
    try {
      await this.userRepository.softDelete({ id: userId });
      return { success: true, message: 'User deleted' };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async updateStatusUser(
    userId: number,
    schoolId: number,
    updateStatusUser: UpdateStatusUserDto,
  ) {
    const dbUser = await this.userRepository.findOneBy({
      id: userId,
      isOwner: false,
      school: { id: schoolId },
    });

    if (!dbUser)
      throw new NotFoundException({ key: 'operations.USER.NOT_FOUND' });
    const { status } = updateStatusUser;
    try {
      await this.userRepository.update(userId, { isActive: status });
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
    searchUserDto: SearchUserDto,
  ) {
    const { take, skip, page, name, role, photos } = searchUserDto;

    const pageOptionsDto: PageOptionsDto = {
      take,
      skip,
      page,
    };

    const query =
      'user.name like :name and "schoolId" = :schoolId and user.id != :userId';

    const conditions: any = {
      name: `${name ? name.toLowerCase() : ''}%`,
      schoolId,
      userId,
    };

    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const preQueryBuilder = queryBuilder
      .where(query, conditions)
      .leftJoinAndSelect('user.roles', 'roles');

    if (role) {
      preQueryBuilder.andWhere('roles.slug IN (:...roleSlug)', {
        roleSlug: [role],
      });
    }
    const itemCount = await preQueryBuilder.getCount();

    let users: User[] = [];
    const dbUsers = await preQueryBuilder.offset(skip).take(take).getMany();

    if (photos) {
      for (const user of dbUsers) {
        const urlPhoto = await this.getPresignedUrl(user.id, user.photo);
        user.photo = urlPhoto;
        users.push(user);
      }
    } else {
      users = dbUsers;
    }

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    const data = new PageDto(users, pageMetaDto);

    return {
      success: true,
      users: { ...data },
    };
  }

  async updateProfile(
    userId: number,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ) {
    const user = await this.userRepository.preload({
      id: userId,
      ...updateUserDto,
    });
    if (!user)
      throw new NotFoundException({ key: 'operations.USER.NOT_FOUND' });

    try {
      if (file) {
        const { name } = await this.fileService.uploadS3(
          file,
          `user/${userId}/profile/`,
          user.photo,
        );
        user.photo = name;
      }

      const dbUser = await this.userRepository.save(user);
      const urlPhoto = await this.getPresignedUrl(dbUser.id, dbUser.photo);
      dbUser.photo = urlPhoto;

      return {
        success: true,
        user: dbUser,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findOneTeacher(teacherId: number, schoolId: number) {
    const teacher = await this.userRepository.findOne({
      where: {
        id: teacherId,
        school: { id: schoolId },
      },
    });

    if (!teacher)
      throw new NotFoundException({ key: 'operations.USER.NOT_FOUND' });
    const isTeacher = teacher.roles.find(
      (role) => role.slug === ValidRoles.teacher,
    );
    if (!isTeacher)
      throw new ForbiddenException({ key: 'operations.USER.IS_TEACHER' });
    return teacher;
  }

  private async getPresignedUrl(userId: number, photoName: string | null) {
    let urlPhoto: string | null = null;
    if (photoName) {
      urlPhoto = await this.fileService.getPresignedUrlS3(
        `user/${userId}/profile/${photoName}`,
      );
    }
    return urlPhoto;
  }

  private getJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('contact support');
  }
}
