import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { isPast } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import {
  ChangePasswordDto,
  ConfirmEmailDto,
  CreateUserDto,
  LoginUserDto,
  SendEmailResetPasswordDto,
  UpdateUserDto,
} from './dto';
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
import { generatePassword } from './utils';
import { MailService } from 'src/mail/mail.service';
import { FilesAuthService } from 'src/files/files.auth.service';
import { FullResetPassword } from './interfaces/reset-password';

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
    private readonly fileAuthService: FilesAuthService,
    private readonly mailService: MailService,
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
        confirmEmail: true,
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

    if (!user.confirmEmail)
      throw new UnauthorizedException({
        key: 'operations.CONFIRM_EMAIL',
      });

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException({
        key: 'operations.CREDENTIALS_ARE_NO_VALIDS',
      });

    delete user.password;
    const hasSchool = !!user.school;
    delete user.school;

    const urlPhoto = await this.fileAuthService.generatePresignedUrlLogoUser(
      user.id,
      user.photo,
    );
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
      throw new BadRequestException({
        key: 'operations.EMAIL.ALREDY_EXITS',
      });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const role = await this.roleRepository.findOneBy({
        slug: this.DEFAULT_ROLE,
      });

      const { expire, token, tokenEmail } = this.genereateResetData();

      const user = this.userRepository.create({
        email,
        password: bcrypt.hashSync(password, 10),
        isOwner: true,
        isActive: true,
        confirmEmail: false,
        roles: [role],
        confirm: { expire, token },
      });

      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();

      await this.mailService.sendConfirmationEmail(user, tokenEmail);

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

  async confirmEmail(createConfirmEmail: ConfirmEmailDto) {
    const { email, token: tokenP } = createConfirmEmail;
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const dbUser = await queryBuilder
      .select(['user.id', 'user.confirm'])
      .where('email = :email', { email })
      .getOne();

    if (!dbUser || !dbUser.confirm)
      throw new NotFoundException({ key: 'operations.USER.NOT_FOUND' });

    const { token, expire } = dbUser.confirm;
    const pastDueToken = isPast(expire);

    if (pastDueToken)
      throw new NotFoundException({ key: 'operations.TOKEN_EXPIRE' });

    const isValid = bcrypt.compareSync(tokenP, token);

    if (!isValid)
      throw new BadRequestException({ key: 'operations.TOKEN_EXPIRE' });

    await this.userRepository.update(dbUser.id, {
      confirm: null,
      confirmEmail: true,
    });

    return { success: true };
  }

  async getUser(user: User) {
    const hasSchool = !!user.school;
    delete user.school;

    const urlPhoto = await this.fileAuthService.generatePresignedUrlLogoUser(
      user.id,
      user.photo,
    );
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
    const { email } = createUserDto;
    const password = generatePassword();
    const exitsEmail = await this.userRepository.findOneBy({ email });
    if (exitsEmail)
      throw new BadRequestException({ key: 'operations.EMAIL.ALREDY_EXITS' });

    try {
      const { roles, ...rest } = createUserDto;
      const dbRoles = await this.roleRepository.find({
        where: { slug: In(roles) },
      });

      const { expire, token, tokenEmail } = this.genereateResetData();
      const user = this.userRepository.create({
        ...rest,
        roles: dbRoles,
        password: bcrypt.hashSync(password, 10),
        school,
        isActive: true,
        reset: { expire, token },
      });
      const dbUser = await this.userRepository.save(user);
      await this.mailService.sendResetPassword(dbUser, tokenEmail);

      return {
        success: true,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async updateUser(
    userId: number,
    createUserDto: CreateUserDto,
    school: School,
  ) {
    const { email, roles, ...rest } = createUserDto;

    const dbUser = await this.userRepository.findOne({
      where: { id: userId, school: { id: school.id } },
      relations: { school: true },
    });

    if (!dbUser)
      throw new NotFoundException({ key: 'operations.USER.NOT_FOUND' });

    if (dbUser.email !== email) {
      const userExist = await this.userRepository.findOneBy({
        email,
      });
      if (userExist)
        throw new NotFoundException({ key: 'operations.USER.FOUND' });
    }

    const dbRoles = await this.roleRepository.find({
      where: { slug: In(roles) },
    });
    const dbUserPre = await this.userRepository.preload({
      ...dbUser,
      ...rest,
      email,
      roles: dbRoles,
    });

    try {
      let tokenEmail = null;
      if (dbUser.email !== email) {
        const {
          expire,
          token,
          tokenEmail: tokenAuxEmail,
        } = this.genereateResetData();
        tokenEmail = tokenAuxEmail;
        dbUserPre.confirm = { expire, token };
        dbUserPre.confirmEmail = false;
      }

      const user = await this.userRepository.save(dbUserPre);

      if (dbUser.email !== email) {
        await this.mailService.sendResetPassword(user, tokenEmail);
      }

      return {
        success: true,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async changePassword(changePassword: ChangePasswordDto) {
    const { email, token: tokenP, password } = changePassword;
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    const dbUser = await queryBuilder
      .select(['user.id', 'user.reset'])
      .where('email = :email', { email })
      .getOne();

    if (!dbUser || !dbUser.reset)
      throw new NotFoundException({ key: 'operations.USER.NOT_FOUND' });

    const { token, expire } = dbUser.reset;
    const pastDueToken = isPast(expire);

    if (pastDueToken)
      throw new NotFoundException({ key: 'operations.TOKEN_EXPIRE' });

    const isValid = bcrypt.compareSync(tokenP, token);

    if (!isValid)
      throw new BadRequestException({ key: 'operations.TOKEN_EXPIRE' });

    await this.userRepository.update(dbUser.id, {
      reset: null,
      password: bcrypt.hashSync(password, 10),
    });

    return { success: true };
  }

  async sendEmailResetPassword(createSendEmail: SendEmailResetPasswordDto) {
    const { email } = createSendEmail;
    const userExist = await this.userRepository.findOne({
      relations: { school: true },
      where: { email },
    });

    if (!userExist)
      throw new NotFoundException({ key: 'operations.USER.NOT_FOUND' });

    const { expire, token, tokenEmail } = this.genereateResetData();
    await this.userRepository.update(userExist.id, {
      reset: { expire, token },
    });
    await this.mailService.sendResetPassword(userExist, tokenEmail);

    return { success: true };
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
    const { take, skip, page, name, roles, photos, order } = searchUserDto;

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
      .orderBy('user.name', order)
      .leftJoinAndSelect('user.roles', 'roles');

    if (roles) {
      preQueryBuilder.andWhere('roles.slug IN (:...roleSlug)', {
        roleSlug: roles,
      });
    }
    const itemCount = await preQueryBuilder.getCount();

    let users: User[] = [];
    const dbUsers = await preQueryBuilder.skip(skip).take(take).getMany();

    if (photos) {
      for (const user of dbUsers) {
        const urlPhoto =
          await this.fileAuthService.generatePresignedUrlLogoUser(
            user.id,
            user.photo,
          );
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
    user: User,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ) {
    const userPre = await this.userRepository.preload({
      id: user.id,
      ...updateUserDto,
    });

    if (!userPre)
      throw new NotFoundException({ key: 'operations.USER.NOT_FOUND' });

    try {
      if (file) {
        const { name } = await this.fileAuthService.uploadLogoUser(
          file,
          userPre.id,
          userPre.photo,
        );
        userPre.photo = name;
      }

      const dbUser = await this.userRepository.save(userPre);
      const urlPhoto = await this.fileAuthService.generatePresignedUrlLogoUser(
        dbUser.id,
        dbUser.photo,
      );
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

  private genereateResetData(): FullResetPassword {
    const tokenResetPassword = randomBytes(32).toString('hex');
    const hashToken = bcrypt.hashSync(tokenResetPassword, 10);
    const dateNow = new Date();
    const expire = new Date(
      new Date(dateNow).setHours(dateNow.getHours() + 24),
    ).getTime();

    return { expire, token: hashToken, tokenEmail: tokenResetPassword };
  }

  private getJwt(payload: JwtPayload, options?: JwtSignOptions) {
    const token = this.jwtService.sign(payload, options);
    return token;
  }

  private handleDBException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('contact support');
  }
}
