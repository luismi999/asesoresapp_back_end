import { Module } from '@nestjs/common';
import { JoinsService } from './joins.service';
import { JoinsController } from './joins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Consultation } from 'src/consultations/entities/consultation.entity';
import { Join } from './entities/join.entity';
import { EmailService } from 'src/mailer/email/email.service';

@Module({
  controllers: [JoinsController],
  providers: [JoinsService, EmailService],
  imports: [
    /* TypeORM */
    TypeOrmModule.forFeature([Join, User, Consultation])
  ]
})
export class JoinsModule {}
