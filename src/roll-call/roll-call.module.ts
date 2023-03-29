import { Module } from '@nestjs/common';
import { RollCallService } from './roll-call.service';
import { RollCallController } from './roll-call.controller';
import { AuthModule } from '../auth/auth.module';
import { GroupModule } from '../group/group.module';

@Module({
  controllers: [RollCallController],
  providers: [RollCallService],
  imports: [AuthModule, GroupModule],
})
export class RollCallModule {}
