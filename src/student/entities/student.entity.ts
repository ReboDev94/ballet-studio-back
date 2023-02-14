import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { School } from '../../school/entities/school.entity';
import { Tutor } from './tutor.entity';
import { ucwords } from 'src/common/utils';

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

  @OneToOne(() => Tutor, { nullable: false })
  @JoinColumn()
  tutor: Tutor;

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
