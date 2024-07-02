import { Module } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { ConsultationsController } from './consultations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

/* Entidades */
import { Consultation } from './entities/consultation.entity';
import { User } from 'src/users/entities/user.entity';
import { Join } from 'src/joins/entities/join.entity';
import { Subject } from 'src/subjects/entities/subject.entity';

@Module({
  controllers: [ConsultationsController],
  providers: [ConsultationsService],
  imports: [
    /* TypeORM */
    TypeOrmModule.forFeature([Consultation, User, Join, Subject])
  ]
})
export class ConsultationsModule {}
