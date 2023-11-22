import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { User } from '../../auth/entities/user.entity';
import { School } from '../../school/entities/school.entity';
import { GroupStudent } from 'src/group-students/entities/group-student.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', { nullable: false })
  name: string;

  @Column('jsonb', {
    nullable: false,
  })
  schedules: object[];

  @Column('numeric')
  schoolCycle: number;

  @Column('varchar', { nullable: false })
  degree: string;

  @ManyToOne(() => User, (user) => user.groups, {
    nullable: false,
  })
  teacher: User;

  @ManyToOne(() => School, (school) => school.groups, {
    nullable: false,
  })
  school: School;

  @OneToMany(() => GroupStudent, (groupStudent) => groupStudent.group)
  students: GroupStudent[];

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

  noStudents: number;
}
