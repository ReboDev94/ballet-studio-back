import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { SchoolModule } from './school/school.module';
import { CommonModule } from './common/common.module';
import { FilesModule } from './files/files.module';
import { StudentModule } from './student/student.module';
import { GroupModule } from './group/group.module';
import { RollCallModule } from './roll-call/roll-call.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.PGPORT,
      username: process.env.PGUSER,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      autoLoadEntities: process.env.NODE_ENV === 'development',
      synchronize: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    SeedModule,
    SchoolModule,
    CommonModule,
    FilesModule,
    StudentModule,
    GroupModule,
    RollCallModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
