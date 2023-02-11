import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { School } from './entities/school.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SchoolController],
  providers: [SchoolService],
  imports: [AuthModule, TypeOrmModule.forFeature([School])],
  exports: [TypeOrmModule],
})
export class SchoolModule {}
