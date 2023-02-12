import { User } from 'src/auth/entities';
import { ucwords } from 'src/common/utils';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class School {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { nullable: true })
  phone: string | null;

  @Column('text', { nullable: true })
  address: string;

  @Column('text', {
    array: true,
    default: [],
  })
  certifications: string[];

  @Column('text')
  directorName: string;

  @Column('text', { nullable: true })
  logo: string | null;

  @OneToMany(() => User, (user) => user.school)
  users: User[];

  @BeforeInsert()
  checkFieldBeforeInsert() {
    this.name = this.name.toLowerCase().trim();
    this.directorName = this.directorName.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldBeforeUpdate() {
    this.checkFieldBeforeInsert();
  }

  @AfterLoad()
  checkFieldAfterLoad() {
    this.name = ucwords(this.name);
    this.directorName = ucwords(this.directorName);
  }
}