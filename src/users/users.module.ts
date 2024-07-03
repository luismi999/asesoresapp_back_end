import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailService } from 'src/mailer/email/email.service';
import { Consultation } from 'src/consultations/entities/consultation.entity';
import { Join } from 'src/joins/entities/join.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService, EmailService],
  imports: [
    /* TypeORM */
    TypeOrmModule.forFeature([User, Consultation, Join])
  ]
})
export class UsersModule {}
