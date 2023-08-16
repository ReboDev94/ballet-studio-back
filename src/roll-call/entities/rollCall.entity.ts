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
import { ManyToOne } from 'typeorm';
import { GroupStudent } from '../../group-students/entities/group-student.entity';
@Entity()
@Index(['date', 'groupStudent'], { unique: true })
export class RollCall {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => GroupStudent, (groupStudent) => groupStudent.rollCall, {
    nullable: false,
    eager: true,
  })
  @JoinColumn()
  groupStudent: GroupStudent;

  @Column('date', { nullable: false })
  date: string;

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
