import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { RollCallByNameDto } from './dto/roll-call-by-name.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RollCall } from './entities/rollCall.entity';
import { IListRollCall, IRollCall } from './interfaces/rollCall.interface';
import { ChangeAttendedDto } from './dto/change-attended.dto';
import { AddStudentsToRollCallDto } from './dto/add-students-roll-call.dto';
import { GroupService } from 'src/group/group.service';
import { GroupStudentsService } from 'src/group-students/group-students.service';

@Injectable()
export class RollCallService {
  private readonly logger = new Logger('RollCallService');
  constructor(
    @InjectRepository(RollCall)
    private readonly rollCallRepository: Repository<RollCall>,
    private readonly groupService: GroupService,
    private readonly groupStudentService: GroupStudentsService,
  ) {}

  async create(
    groupId: number,
    schoolId: number,
    rollCallByNameDto: RollCallByNameDto,
  ) {
    await this.groupService.findOneBySchool(groupId, schoolId);

    const { date } = rollCallByNameDto;
    const groupStudents =
      await this.groupStudentService.findAllGroupStudentsByGroup(groupId);

    try {
      await this.removeRollCallByDate(groupId, schoolId, { date });
      const rollCall: RollCall[] = [];

      groupStudents.forEach((gs) => {
        rollCall.push(
          this.rollCallRepository.create({
            date,
            groupStudent: gs,
            attended: false,
          }),
        );
      });
      await this.rollCallRepository.save(rollCall);
      const dbRollCall = await this.findRollCallByGroupAndDate(groupId, date);

      return {
        success: true,
        rollCall: dbRollCall,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async checkExistsRollCall(
    groupId: number,
    schoolId: number,
    rollCallByNameDto: RollCallByNameDto,
  ) {
    await this.groupService.findOneBySchool(groupId, schoolId);
    const { date } = rollCallByNameDto;
    const rollCall = await this.findRollCallByGroupAndDate(groupId, date);
    return {
      success: true,
      exists: rollCall.length > 0,
    };
  }

  async removeRollCallByDate(
    groupId: number,
    schoolId: number,
    rollCallByNameDto: RollCallByNameDto,
  ) {
    await this.groupService.findOneBySchool(groupId, schoolId);
    const { date } = rollCallByNameDto;
    const rollCall = await this.findRollCallByGroupAndDate(groupId, date);
    const rollCallIds = rollCall.map(({ id }) => id);
    try {
      if (rollCallIds.length > 0)
        await this.rollCallRepository.delete(rollCallIds);
      return {
        success: true,
        message: 'rollCall has been removed',
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAllByGroup(groupId: number, schoolId: number) {
    await this.groupService.findOneBySchool(groupId, schoolId);
    const dbRollCall = await this.findRollCallByGroupAndDate(groupId);

    const headers = [
      ...new Set(
        [...dbRollCall]
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          )
          .map((dbrc) => new Date(dbrc.date).toISOString().slice(0, 10)),
      ),
    ];

    const data: IListRollCall[] = dbRollCall
      .reduce(
        (acc: IListRollCall[], { studentId, studentName, date, attended }) => {
          const studentIndex = acc.findIndex(
            (st) => st.studentId === studentId,
          );
          if (studentIndex === -1) {
            acc.push({
              studentId,
              studentName,
              percentage: 0,
              rollCall: [
                {
                  date: new Date(date).toISOString().slice(0, 10),
                  attended,
                },
              ],
            });
          } else {
            acc[studentIndex].rollCall.push({
              date: new Date(date).toISOString().slice(0, 10),
              attended,
            });
          }
          return acc;
        },
        [],
      )
      .map((data) => {
        const totalRegister = headers.length;
        const attendedTrue = data.rollCall.filter(
          ({ attended }) => attended,
        ).length;

        data.percentage = +((100 / totalRegister) * attendedTrue).toFixed(2);
        return data;
      })
      .sort((a, b) => {
        if (a.studentName > b.studentName) return 1;
        if (b.studentName > a.studentName) return -1;
        return 0;
      });

    return {
      success: true,
      rollCal: { headers, data },
    };
  }

  async findAllByGroupAndByDate(
    groupId: number,
    schoolId: number,
    rollCallByNameDto: RollCallByNameDto,
  ) {
    await this.groupService.findOneBySchool(groupId, schoolId);
    const { date } = rollCallByNameDto;
    const rollCall = await this.findRollCallByGroupAndDate(groupId, date);
    return { success: true, rollCall };
  }

  async findStudentsDoNotBelongsRollCall(
    groupId: number,
    schoolId: number,
    rollCallByNameDto: RollCallByNameDto,
  ) {
    await this.groupService.findOneBySchool(groupId, schoolId);
    const { date } = rollCallByNameDto;
    const dbStudents =
      await this.groupStudentService.findGroupStudentsNotOnRollCall(
        groupId,
        date,
      );

    return {
      success: true,
      students: dbStudents,
    };
  }

  async addStudentsToRollCall(
    groupId: number,
    schoolId: number,
    addStudentsToRollCallDto: AddStudentsToRollCallDto,
  ) {
    await this.groupService.findOneBySchool(groupId, schoolId);
    const { date, groupStudentsIds } = addStudentsToRollCallDto;

    const dbGroupStudents =
      await this.groupStudentService.findAllGroupStudentsByIds(
        groupStudentsIds,
        groupId,
      );

    if (dbGroupStudents.length !== groupStudentsIds.length)
      throw new NotFoundException({
        key: 'operations.GROUP.STUDENTS_NOT_FOUND',
      });

    try {
      const rollCall: RollCall[] = [];
      for (const gs of groupStudentsIds) {
        const rollCallExits = await this.rollCallRepository.findOne({
          where: { groupStudent: { id: gs }, date },
        });
        if (!rollCallExits)
          rollCall.push(
            this.rollCallRepository.create({ date, groupStudent: { id: gs } }),
          );
      }

      await this.rollCallRepository.save(rollCall);
      return {
        success: true,
        message: 'students were added to the rollCall',
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async changeAttended(
    rollCallId: number,
    schoolId: number,
    changeAttendedDto: ChangeAttendedDto,
  ) {
    await this.findOneRollCallById(rollCallId, schoolId);
    const { attended } = changeAttendedDto;
    const preRollCall = await this.rollCallRepository.preload({
      id: rollCallId,
      attended,
    });
    try {
      await this.rollCallRepository.save(preRollCall);
      return { success: true, message: 'attended status has been changed' };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findOneRollCallById(rollCallId: number, schoolId: number) {
    const dbRollCall = await this.rollCallRepository.findOneBy({
      id: rollCallId,
    });
    if (!dbRollCall)
      throw new NotFoundException({ key: 'operations.ROLLCALL.NOT_FOUND' });

    const groupId = dbRollCall.groupStudent.group.id;
    const dbGroup = await this.groupService.findOneBySchool(groupId, schoolId);
    if (!dbGroup)
      throw new NotFoundException({ key: 'operations.ROLLCALL.NOT_FOUND' });
    return dbRollCall;
  }

  async findRollCallByGroupAndDate(groupId: number, date?: string) {
    const queryBuilder = this.rollCallRepository
      .createQueryBuilder('rollCall')
      .leftJoin('rollCall.groupStudent', 'groupStudent')
      .leftJoin('groupStudent.student', 'student')
      .leftJoin('groupStudent.group', 'group');

    if (date) queryBuilder.where('date = :date', { date });
    queryBuilder
      .andWhere('group.id = :groupId', { groupId })
      .select([
        'rollCall.id AS id',
        'rollCall.date AS date',
        'rollCall.attended AS attended',
        'student.id AS "studentId"',
        'INITCAP(student.name) AS "studentName"',
      ]);

    const rollCall: IRollCall[] = await queryBuilder.getRawMany();

    return rollCall;
  }

  private handleDBException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('help');
  }
}
