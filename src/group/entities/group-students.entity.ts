import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Group } from './group.entity';
import { Student } from '../../student/entities/student.entity';
import { AttenDance } from './attendance.entity';

@Entity()
@Index(['group', 'student'], { unique: true })
export class GroupStudents {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Group, (group) => group.students, { nullable: false })
  group: Group;

  @ManyToOne(() => Student, (student) => student.groups, { nullable: false })
  student: Student;

  @OneToMany(() => AttenDance, (attendance) => attendance.groupStudent)
  attendance: AttenDance[];

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