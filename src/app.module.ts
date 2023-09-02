import { Module } from '@nestjs/common';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { join } from 'path';
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
import { GroupStudentsModule } from './group-students/group-students.module';

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
    I18nModule.forRoot({
      fallbackLanguage: 'es',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: process.env.NODE_ENV === 'development',
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    AuthModule,
    SeedModule,
    SchoolModule,
    CommonModule,
    FilesModule,
    StudentModule,
    GroupModule,
    RollCallModule,
    GroupStudentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
