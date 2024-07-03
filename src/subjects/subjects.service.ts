import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// DTOs 
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

// Entities 
import { Subject } from './entities/subject.entity';

// Interfaces 
import { CreateSubjectResponse } from 'src/interfaces/createSubjectResponse.interface';
import { DeleteSubjectResponse } from 'src/interfaces/deleteSubjectResponse.interface';

@Injectable()
export class SubjectsService {

  // Constructor 
  constructor(
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>){}

  // Crear una cátedra 
  async create(createSubjectDto: CreateSubjectDto): Promise<CreateSubjectResponse> {
    // Desestructuramos el objeto
    let { code, name } = createSubjectDto;
    // Modificamos la data 
    code = code.toLowerCase();
    name = name.toLowerCase();
    try {
      // Buscamos en la base de datos 
      const subjectDb: Subject = await this.subjectsRepository.findOneBy({name});
      // Si existe mandamos el error 
      if(subjectDb)
        throw new UnauthorizedException('Esta cátedra ya existe');
      // Buscamos en la base de datos 
      const subjectDb2: Subject = await this.subjectsRepository.findOneBy({code});
      // Si existe mandamos el error 
      if(subjectDb2)
        throw new UnauthorizedException('Esta cátedra ya existe');
      // Creamos el modelo 
      const newSubject: Subject = this.subjectsRepository.create({code, name});
      // Guardamos la cátedra
      await this.subjectsRepository.save(newSubject);
      // Retornamos el error 
      return {
        msg: 'Cátedra creada'
      }
    } catch (error) {
      // Retornamos el error 
      throw new InternalServerErrorException(error.response);
    }

  }

  // Buscar todas las cátedras 
  async findAll(): Promise<Subject[]>{
    try {
      // Buscamos todas las cátedras 
      const subjectsDb: Subject[] = await this.subjectsRepository.find();
      // Sí no hay cátedras retornamos un error 
      if(!subjectsDb)
        throw new NotFoundException('No hay cátedras disponibles');
      // Retornamos las cátedras 
      return subjectsDb;
    } catch (error) {
      // Retornamos el error 
      throw new InternalServerErrorException(error.response); 
    }
  }

  // Buscar cátedra 
  async findOne(uuid: string) {
    try {
      
      // Buscamos un registro con el uuid recibido 
      const subjectDb: Subject = await this.subjectsRepository.findOneBy({uuid});

      // Sí no encontramos un registro mandamos un error 
      if(!subjectDb)
        throw new NotFoundException("Cátedra no encontrada");

      // Retornamos la cátedra 
      return subjectDb;

    } catch (error) {
      
      // Retornamos el error 
      throw new InternalServerErrorException(error.response);
    }
  }

  update(id: number, updateSubjectDto: UpdateSubjectDto) {
    return `This action updates a #${id} subject`;
  }

  // Eliminar una cátedra 
  async remove(uuid: string): Promise<DeleteSubjectResponse> {
    try {
      // Buscamos la cátedra en la base de datos 
      const subjectDb: Subject = await this.subjectsRepository.findOneBy({uuid});
      // Si no encontramos la cátedra lanzamos el error 
      if(!subjectDb)
        throw new NotFoundException('Cátedra no encontrada');
      // Eliminamos la cátedra 
      await this.subjectsRepository.delete({uuid});
      return {
        msg: 'Cátedra eliminada'
      }
    } catch (error) {
      // Retornamos el error 
      throw new InternalServerErrorException(error.response);
    }
  }
}