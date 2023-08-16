import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RollCallService } from './roll-call.service';
import { RollCallController } from './roll-call.controller';
import { AuthModule } from '../auth/auth.module';
import { RollCall } from './entities/rollCall.entity';

@Module({
  controllers: [RollCallController],
  providers: [RollCallService],
  imports: [TypeOrmModule.forFeature([RollCall]), AuthModule],
})
// GroupModule
export class RollCallModule {}
