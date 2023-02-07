import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
