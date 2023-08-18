import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RollCallService } from './roll-call.service';
import { RollCallController } from './roll-call.controller';
import { AuthModule } from '../auth/auth.module';
import { RollCall } from './entities/rollCall.entity';
import { GroupModule } from 'src/group/group.module';
import { GroupStudentsModule } from 'src/group-students/group-students.module';

@Module({
  controllers: [RollCallController],
  providers: [RollCallService],
  imports: [
    TypeOrmModule.forFeature([RollCall]),
    AuthModule,
    GroupModule,
    GroupStudentsModule,
  ],
})
export class RollCallModule {}
