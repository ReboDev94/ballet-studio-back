import { ucwords } from 'src/common/utils';
import { Student } from './student.entity';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Tutor {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  name: string;

  @Column('text', { default: '' })
  email: string;

  @Column('text', { default: '' })
  phone: string;

  @Column('text')
  celPhone: string;

  @Column('bool', { default: false })
  authorizePhotos: boolean;

  @OneToOne(() => Student, (student) => student.tutor, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  student: Student;

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
