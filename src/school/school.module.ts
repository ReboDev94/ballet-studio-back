import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { School } from './entities/school.entity';
import { FilesModule } from 'src/files/files.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SchoolController],
  providers: [SchoolService],
  imports: [TypeOrmModule.forFeature([School]), AuthModule, FilesModule],
  exports: [TypeOrmModule, SchoolService],
})
export class SchoolModule {}
