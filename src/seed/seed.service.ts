import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Role, User } from 'src/auth/entities';
import { School } from '../school/entities/school.entity';
import { initialData } from './data/seed';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  private async deleteTables() {
    const queryBuilderUser = this.userRepository.createQueryBuilder();
    await queryBuilderUser.delete().where({}).execute();

    const queryBuilderSchool = this.schoolRepository.createQueryBuilder();
    await queryBuilderSchool.delete().where({}).execute();

    const queryBuilderRole = this.roleRepository.createQueryBuilder();
    await queryBuilderRole.delete().where({}).execute();
  }

  private async insertSchool() {
    const seedSchool = initialData.school;
    const school = this.schoolRepository.create(seedSchool);
    return await this.schoolRepository.save(school);
  }

  private async insertRoles() {
    const seedRoles = initialData.roles;
    const roles: Role[] = [];

    seedRoles.forEach((role) => {
      roles.push(this.roleRepository.create(role));
    });

    const dbRoles = await this.roleRepository.save(roles);
    return dbRoles;
  }

  private async insertUsers(roles: Role[], school: School) {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach((user, i) => {
      users.push(
        this.userRepository.create({
          ...user,
          password: bcrypt.hashSync(user.password, 10),
          roles: [roles[i]],
          school,
        }),
      );
    });
    const dbUsers = await this.userRepository.save(users);
    return dbUsers;
  }

  async runSeed() {
    await this.deleteTables();
    const roles = await this.insertRoles();
    const school = await this.insertSchool();
    await this.insertUsers(roles, school);
    return 'SEED EXECUTE';
  }
}
