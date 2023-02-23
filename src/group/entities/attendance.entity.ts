import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  JoinColumn,
} from 'typeorm';
import { GroupStudents } from './group-students.entity';
import { ManyToOne } from 'typeorm';
@Entity()
@Index(['date', 'groupStudent'], { unique: true })
export class AttenDance {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => GroupStudents, (groupStudent) => groupStudent.attendance, {
    nullable: false,
    eager: true,
  })
  @JoinColumn()
  groupStudent: GroupStudents;

  @Column('date', { nullable: false })
  date: Date;

  @Column('bool', { default: false })
  attended: boolean;
}
