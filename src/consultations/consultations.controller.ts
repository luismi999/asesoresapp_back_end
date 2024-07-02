import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';

@Controller('consultations')
export class ConsultationsController {
  
  // Constructor 
  constructor(private readonly consultationsService: ConsultationsService) {}

  // Crear asesoría 
  @Post()
  create(@Body() createConsultationDto: CreateConsultationDto) {
    return this.consultationsService.create(createConsultationDto);
  }

  // Buscar todas las asesorías 
  @Get()
  findAll() {
    return this.consultationsService.findAll();
  }

  // Buscar una asesoría 
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.consultationsService.findOne(uuid);
  }

  // Buscar una asesoría po usuario
  @Get('user/:uuid')
  findAllByUser(@Param('uuid') uuid: string) {
    return this.consultationsService.findAllByUser(uuid);
  }

  // Buscar un asesoría por cátedra 
  @Get('subject/:uuid')
  findAllBySubject(@Param('uuid') uuid: string) {
    return this.consultationsService.findAllBySubject(uuid);
  }


  // Actualizar una asesoría 
  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateConsultationDto: UpdateConsultationDto) {
    return this.consultationsService.update(uuid, updateConsultationDto);
  }

  // Eliminar una asesoría 
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.consultationsService.remove(uuid);
  }
}
