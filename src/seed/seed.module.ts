import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from '../auth/auth.module';
import { SchoolModule } from 'src/school/school.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [AuthModule, SchoolModule],
})
export class SeedModule {}
