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
} from 'typeorm';

import { Role } from './role.entity';
import { School } from '../../school/entities/school.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  name: string;

  @Column('text', { unique: true })
  userName: string;

  @Column('text', { select: false })
  password: string;

  @Column('text', { nullable: true })
  phone: string;

  @Column('text', { nullable: true })
  email: string;

  @Column('bool', { default: false })
  isOwner: boolean;

  @Column('bool', { default: true })
  isActive: boolean;

  @ManyToMany(() => Role, (role) => role.id, { eager: true, nullable: false })
  @JoinTable()
  roles: Role[];

  @ManyToOne(() => School, (school) => school.users, {
    nullable: false,
  })
  school: School;

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
}
