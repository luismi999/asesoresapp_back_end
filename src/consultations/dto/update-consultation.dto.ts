import { PartialType } from '@nestjs/mapped-types';
import { CreateConsultationDto } from './create-consultation.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateConsultationDto extends PartialType(CreateConsultationDto) {
}
