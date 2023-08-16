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
import { Student } from '../../student/entities/student.entity';
import { RollCall } from '../../roll-call/entities/rollCall.entity';
import { Group } from 'src/group/entities/group.entity';

@Entity()
@Index(['group', 'student'], { unique: true })
export class GroupStudent {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Group, (group) => group.students, {
    nullable: false,
    eager: true,
  })
  group: Group;

  @ManyToOne(() => Student, (student) => student.groups, { nullable: false })
  student: Student;

  @OneToMany(() => RollCall, (rollCall) => rollCall.groupStudent)
  rollCall: RollCall[];

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
