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
import { GroupStudents } from '../../group/entities/group-students.entity';

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

  @Column('bool', { default: false })
  isOlder: boolean;

  @Column('text', { array: true, default: [] })
  dieseses: string[];

  @ManyToOne(() => School, (school) => school.student, { nullable: false })
  school: School;

  @OneToOne(() => Tutor, (tutor) => tutor.student, { eager: true })
  tutor: Tutor;

  @OneToMany(() => GroupStudents, (groupStudents) => groupStudents.student)
  groups: GroupStudents[];

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
