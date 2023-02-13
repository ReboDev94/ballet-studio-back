import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { SchoolModule } from '../school/school.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [ConfigModule, AuthModule, SchoolModule],
})
export class FilesModule {}
