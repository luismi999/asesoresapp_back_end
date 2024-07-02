import { Injectable, NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

// DTOs 
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';

// Entidades
import { Consultation } from './entities/consultation.entity';
import { User } from 'src/users/entities/user.entity';

// Interfaces 
import { CreateConsultation } from 'src/interfaces/consultation.interface';
import { CreateConsultationResponse } from 'src/interfaces/createConsultationResponse.interface';
import { UpdateConsultationResponse } from 'src/interfaces/updateConsultationResponse.interface';
import { DeleteConsultationResponse } from 'src/interfaces/deleteConsultationResponse.interface';
import { Subject } from 'src/subjects/entities/subject.entity';

@Injectable()
export class ConsultationsService {

  // Constructor
  constructor(
    @InjectRepository(Consultation)
    private readonly consultationRepository: Repository<Consultation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>){}

  // Crear un asesoría
  async create(createConsultationDto: CreateConsultationDto): Promise<CreateConsultationResponse> {

    // Creamos el limite de asesorías creadas 
    const max_consultations: number = 5;

    try {

      // Buscamos un registro con el uuid_user recibido
      const user: User = await this.userRepository.findOneBy({uuid: createConsultationDto.uuid_user});

      // Si no encontramos al usuario retornamos un error
      if(!user)
        throw new NotFoundException("Usuario no encontrado");

      // Buscamos un registro con el uuid_subject recibido
      const subject: Subject = await this.subjectRepository.findOneBy({uuid: createConsultationDto.uuid_subject});

      // Si no encontramos al usuario retornamos un error
      if(!subject)
        throw new NotFoundException("Cátedra no encontrada");
      
      // Buscamos todas las asesorías creadas por el usuario 
      const consultation_count: [Consultation[], number] = await this.consultationRepository.findAndCountBy({user: user, isActive: true});

      // Si tiene cinco asesorías retornamos un error, ya que solo permitimos un numero limitado de asesorías
      if(consultation_count[1] >= max_consultations)
        throw new UnauthorizedException("Numero máximo de asesorías activas alcanzado");

      // Desestructuramos el objeto
      const { day, start, end, map_longitud, map_latitud } = createConsultationDto; 

      // Creamos la fecha para la creación de la asesoría
      const date: Date = new Date();
      const date_creation: string = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
      
      // Creamos el objeto relacional
      const consultation: CreateConsultation = { date_creation, day, start, end, map_longitud, map_latitud, user, subject };

      // Creamos el modelo de la base de datos
      const newConsultation: Consultation = this.consultationRepository.create(consultation);

      // Guardamos el modelo en la base de datos
      await this.consultationRepository.save(newConsultation);

      // Retornamos el mensaje
      return { msg: 'Asesoría creada' }

    } catch (error) {

      // Si obtenemos un error lo retornamos
      throw new InternalServerErrorException(error.response);

    }
  }

  // Buscamos todos los asesoramientos
  async findAll(): Promise<Consultation[]> {

    try {

      // Buscamos todas las asesorías
      const consultations: Consultation[] = await this.consultationRepository.findBy({isActive: true});

      // Si no encontramos asesorías retornamos el error
      if(!consultations)
        throw new NotFoundException("Asesorías non encontradas");

      // Retornamos las asesorías 
      return consultations;

    } catch (error) {

      // Si existe algún error lo retornamos
      throw new InternalServerErrorException(error.response);

    }
  }

  // Búsqueda de una asesoría
  async findOne(uuid: string) {

    try {

      // Buscamos un registro con el uuid recibido 
      const consultationDb: Consultation = await this.consultationRepository.findOneBy({uuid});

      // Si no encontramos un registro mandamos un error
      if(!consultationDb)
        throw new NotFoundException("Asesoría no encontrada");

      // Retornamos las asesorías
      return consultationDb;

    } catch (error) {

      // Si algo falla retornamos el error
      throw new InternalServerErrorException(error.response);
      
    }
  }

  // Buscar todas las asesorías por usuario
  async findAllByUser(uuid: string){

    try {

      // Buscamos el usuario en la base de datos
      const userDb: User = await this.userRepository.findOneBy({uuid});

        // Si no encontramos el usuario retornamos un error
        if(!userDb)
          throw new NotFoundException("Usuario no encontrado");

        // Buscamos las asesorías del usuario
        const consultationDb: Consultation[] = await this.consultationRepository.findBy({user: userDb, isActive: true});
 
         // Si no encontramos asesorías retornamos el error
         if(!consultationDb)
           throw new NotFoundException("Asesorías no encontradas");
 
         // Si todo sale bien retornamos las asesorías del usuario
         return consultationDb;
      
    } catch (error) {

      // Si algo falla retornamos el error
      throw new InternalServerErrorException(error.response);

    }
  }

  // Buscar todas las asesorías por usuario
  async findAllBySubject(uuid: string){

    try {

      // Buscamos un registro con el uuid recibido
      const subjectDb: Subject = await this.subjectRepository.findOneBy({uuid});

        // Si no encontramos un registro retornamos un error
        if(!subjectDb)
          throw new NotFoundException("Cátedra no encontrada");

        // Buscamos las asesorías por cátedra
        const consultationDb: Consultation[] = await this.consultationRepository.findBy({subject: subjectDb, isActive: true});
 
         // Si no encontramos asesorías retornamos el error
         if(!consultationDb)
           throw new NotFoundException("Asesorías no encontradas");
 
         // Si todo sale bien retornamos las asesorías del usuario
         return consultationDb;
      
    } catch (error) {

      // Si algo falla retornamos el error
      throw new InternalServerErrorException(error.response);

    }
  }

  // Actualización de una asesoría
  async update(uuid: string, updateConsultationDto: UpdateConsultationDto): Promise<UpdateConsultationResponse> {

    // Desestructuramos del objeto
    const { isActive, ...rest } = updateConsultationDto;

    try {

      // Obtenemos el asesoramiento de la base de datos
      const consultationDb: Consultation = await this.consultationRepository.findOneBy({uuid});

      // Si no encontramos el asesoramiento mandamos un error
      if(!consultationDb)
        throw new NotFoundException("Asesoría no encontrada");

      // Creamos una bandera
      let redFlag: boolean = false;

      // Si no existe algún join activo dentro de la asesoría si se puede hacer la actualización
      for(const join of consultationDb.joins){
        (join.step != 'inactive')? redFlag = true : redFlag = false;
      }

      // Si hay una bandera roja no se puede hacer la actualización y retornamos el error
      if(redFlag)
        throw new UnauthorizedException("No puedes poder inactiva una asesoría que tenga asesoramientos activos");

      // Actualizamos el registro del asesoramientos con su nuevo status
      await this.consultationRepository.update({uuid},{isActive});

      // Retornamos le mensaje
      return { msg: 'Status de la asesoría actualizado' }

    } catch (error) {

      // Si algo falla retornamos el error
      throw new InternalServerErrorException(error.response);

    }
  }

  // Eliminar una asesoría 
  async remove(uuid: string): Promise<DeleteConsultationResponse> {

    try {

      // Buscamos la asesoría en la base de datos
      const consultationDb: Consultation = await this.consultationRepository.findOneBy({uuid});

      // Si no encontramos la asesoría mandamos el error
      if(!consultationDb)
        throw new NotFoundException('No se encontró la asesoría');

      // Eliminamos la asesoría 
      await this.consultationRepository.delete({uuid});

      // Devolvemos la respuesta 
      return {msg: 'Asesoría inactiva'}

    } catch (error) {

      // Lanzamos el error
      throw new InternalServerErrorException(error.response);

    }
  }
}