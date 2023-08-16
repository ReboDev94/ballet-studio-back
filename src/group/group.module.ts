import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [TypeOrmModule.forFeature([Group]), AuthModule],
  exports: [TypeOrmModule],
})
export class GroupModule {}
