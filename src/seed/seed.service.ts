import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from 'src/auth/entities';
import { Repository } from 'typeorm';
import { initialData } from './data/seed';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  private async deleteTables() {
    const queryBuilderUser = this.userRepository.createQueryBuilder();
    await queryBuilderUser.delete().where({}).execute();

    const queryBuilderRole = this.roleRepository.createQueryBuilder();
    await queryBuilderRole.delete().where({}).execute();
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

  private async insertUsers(roles: Role[]) {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach((user, i) => {
      users.push(
        this.userRepository.create({
          ...user,
          password: bcrypt.hashSync(user.password, 10),
          roles: [roles[i]],
        }),
      );
    });
    const dbUsers = await this.userRepository.save(users);
    return dbUsers;
  }

  async runSeed() {
    await this.deleteTables();
    const roles = await this.insertRoles();
    await this.insertUsers(roles);
    return 'SEED EXECUTE';
  }
}
