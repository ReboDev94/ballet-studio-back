import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
  OneToMany,
} from 'typeorm';

import { Role } from './role.entity';
import { School } from '../../school/entities/school.entity';
import { ucwords } from 'src/common/utils';
import { Group } from '../../group/entities/group.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', { nullable: true })
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('text', { nullable: true })
  phone: string;

  @Column('bool', { default: false })
  isOwner: boolean;

  @Column('bool', { default: true })
  isActive: boolean;

  @ManyToMany(() => Role, (role) => role.id, { eager: true, nullable: false })
  @JoinTable()
  roles: Role[];

  @ManyToOne(() => School, (school) => school.users, {
    nullable: true,
  })
  school: School;

  @OneToMany(() => Group, (group) => group.teacher)
  groups: Group[];

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @BeforeInsert()
  checkFieldBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
    if (this.name) this.name = this.name.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldBeforeUpdate() {
    this.checkFieldBeforeInsert();
  }

  @AfterLoad()
  checkFieldAfterLoad() {
    this.name = ucwords(this.name);
  }
}
