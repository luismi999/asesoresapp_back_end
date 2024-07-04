import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Módulos
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmailService } from './mailer/email/email.service';
import { ConsultationsModule } from './consultations/consultations.module';
import { JoinsModule } from './joins/joins.module';
import { SubjectsModule } from './subjects/subjects.module';

@Module({
  imports: [
    // Configuración global de variables de entorno
    ConfigModule.forRoot(),
    // TypeORM
    TypeOrmModule.forRoot({
      // ------------------------------------------- SSL --------------------------------------------------------------
      // ssl: 'prod' === 'prod',
      //   extra: {
      //     ssl: 'prod' ==='prod'
      //     ? { rejectUnauthorized: false }
      //     : null
      //   },
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ConsultationsModule,
    JoinsModule,
    SubjectsModule
  ], 
  controllers: [],
  providers: [EmailService],
})
export class AppModule {}
