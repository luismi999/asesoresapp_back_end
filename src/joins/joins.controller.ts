import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JoinsService } from './joins.service';
import { CreateJoinDto } from './dto/create-join.dto';
import { UpdateJoinDto } from './dto/update-join.dto';

@Controller('joins')
export class JoinsController {

  // Constructor 
  constructor(private readonly joinsService: JoinsService) {}

  // Crear un join 
  @Post()
  create(@Body() createJoinDto: CreateJoinDto) {
    return this.joinsService.create(createJoinDto);
  }

  // Buscar todos los joins 
  @Get()
  findAll( @Query('uuid') uuid: string) {
    return this.joinsService.findAll();
  }

  // Buscar joins por uuid_usuario | uuid_asesoría
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.joinsService.findOne(uuid);
  }

  // Buscar join por usuario
  @Get('user/:uuid')
  findAllByUser(@Param('uuid') uuid: string) {
    return this.joinsService.findAllByUser(uuid);
  }

  // Buscar join por usuario
  @Get('consultation/:uuid')
  findAllByConsultation(@Param('uuid') uuid: string) {
    return this.joinsService.findAllByConsultation(uuid);
  }

  // Actualizar un join 
  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateJoinDto: UpdateJoinDto) {
    return this.joinsService.update(uuid, updateJoinDto);
  }

  // Eliminar un join 
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.joinsService.remove(+id);
  }
}
