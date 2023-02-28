import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  JoinColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GroupStudents } from '../../group/entities/group-students.entity';
import { ManyToOne } from 'typeorm';
@Entity()
@Index(['date', 'groupStudent'], { unique: true })
export class RollCall {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => GroupStudents, (groupStudent) => groupStudent.rollCall, {
    nullable: false,
    eager: true,
  })
  @JoinColumn()
  groupStudent: GroupStudents;

  @Column('date', { nullable: false })
  date: Date;

  @Column('bool', { default: false })
  attended: boolean;

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
