import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { School } from '../../school/entities/school.entity';
import { Tutor } from './tutor.entity';
import { ucwords } from 'src/common/utils';
import { GroupStudent } from 'src/group-students/entities/group-student.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  name: string;

  @Column('date')
  dateOfBirth: string;

  @Column('text')
  address: string;

  @Column('text', { nullable: true })
  avatar: string;

  @Column('text', { array: true, default: [] })
  dieseses: string[];

  @ManyToOne(() => School, (school) => school.student, { nullable: false })
  school: School;

  @OneToOne(() => Tutor, (tutor) => tutor.student, { eager: true })
  tutor: Tutor;

  @OneToMany(() => GroupStudent, (groupStudent) => groupStudent.student)
  groups: GroupStudent[];

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
    this.name = this.name.toLowerCase().trim();
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
