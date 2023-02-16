import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [],
  providers: [FilesService],
  imports: [ConfigModule],
  exports: [FilesService],
})
export class FilesModule {}
