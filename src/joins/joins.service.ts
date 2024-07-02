import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryBuilder, Repository, SelectQueryBuilder } from 'typeorm';

// DTOs 
import { CreateJoinDto } from './dto/create-join.dto';
import { UpdateJoinDto } from './dto/update-join.dto';

// Entidades
import { Join } from './entities/join.entity';
import { User } from 'src/users/entities/user.entity';
import { Consultation } from 'src/consultations/entities/consultation.entity';
import { EmailService } from 'src/mailer/email/email.service';

// Interfaces 
import { CreateJoinResponse } from 'src/interfaces/createJoinResponse.interface';
import { UpdateJoinResponse } from 'src/interfaces/updateJoinResponse.interface';

@Injectable()
export class JoinsService {

  constructor(
    @InjectRepository(Join)
    private readonly joinRepository: Repository<Join>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Consultation)
    private readonly consultationRepository: Repository<Consultation>,
    private readonly emailService: EmailService){}

  // Crear join
  async create(createJoinDto: CreateJoinDto): Promise<CreateJoinResponse> {

    // Desestructuramos el objeto
    const {uuid_user, uuid_consultation} = createJoinDto;

    try {

      // Buscamos un registro con el uuid recibido
      const userDb: User = await this.userRepository.findOneBy({uuid: uuid_user});

      // Si no se encuentra el registro mandamos un error
      if(!userDb)
        throw new NotFoundException("Usuario no encontrado");

      // Buscamos un registro con el uuid recibido
      const consultationDb: Consultation = await this.consultationRepository.findOneBy({uuid: uuid_consultation});

      // Si no encontramos un registro mandamos un error
      if(!consultationDb)
        throw new NotFoundException("Asesoría no encontrada");

      // Buscamos un join que contenga el usuario y la asesoría que recibimos
      const joinAlreadyExist: Join = await this.joinRepository.findOneBy({user: userDb, consultation: consultationDb});

      // Si encontramos un join significa que el usuario quiere duplicar un join y retornamos el error
      if(joinAlreadyExist)
        throw new UnauthorizedException('No puedes crear mas de un JOIN para la misma asesoría');

      // Creamos la fecha para la creación de la asesoría
      const date: Date = new Date();
      const date_creation: string = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;

      // Creamos el modelo para la base de datos
      const newJoin: Join = this.joinRepository.create({date_creation, user: userDb, consultation: consultationDb});

      // Guardamos la instancia dentro de la base de datos
      await this.joinRepository.save(newJoin);

      // Creamos el formato
      // const htmlContent: string = `
      //   <!DOCTYPE html>
      //   <html lang="en">
      //   <head>
      //       <meta charset="UTF-8">
      //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
      //       <title>Document</title>
      //   </head>
      //   <body>
      //       <h4 style="font-family: monospace; color: rgb(109, 109, 109);">
      //         Querido <span style="color: rgb(0, 0, 0);">${consultationDb.user.first_name.toUpperCase()} ${consultationDb.user.last_name.toUpperCase()}</span>, 
      //         esperemos te encuentres bien.
      //       </h4>
      //       <h4 style="font-family: monospace; color: rgb(109, 109, 109);">
      //           Te notificamos que el estudiante <span style="color: rgb(0, 0, 0);">${userDb.first_name.toUpperCase()} ${userDb.last_name.toUpperCase()}</span> 
      //           ha unido a tu asesoría sobre <span style="color: rgb(0, 0, 0);">${consultationDb.subject.name.toUpperCase()}</span> 
      //           impartida el día <span style="color: rgb(0, 0, 0);">${consultationDb.day.toUpperCase()}</span> de <span style="color: rgb(0, 0, 0);">${consultationDb.start}</span> 
      //           a <span style="color: rgb(0, 0, 0);">${consultationDb.end.toUpperCase()}</span>. Te sugerimos echar un vistazo.
      //       </h4>
      //       <h4 style="font-family: monospace; color: rgb(109, 109, 109);">
      //         Que pases un lindo día. AsesoresApp
      //       </h4>
      //   </body>
      //   </html>
      // `;
      /* Enviamos el correo electrónico */
      // this.emailService.sendMail(consultationDb.user.email, 'AsesoresApp: Nuevo JOIN',htmlContent);
      // Retornamos un mensaje de éxito
      return { msg: 'Join creado con éxito' };

    } catch (error) {

      // Retornamos el error
      throw new InternalServerErrorException(error.response);

    }
  }

  // Buscar todos los joins
  async findAll() {

    try {
      
      // Obtenemos todos los joins
      const joinsDb: Join[] = await this.joinRepository.find({});

      // Retornamos los joins encontrados
      return joinsDb;

    } catch (error) {
      
      // Retornamos un error 
      throw new InternalServerErrorException(error.response);

    }

  }

  // Buscamos un join
  async findOne(uuid: string): Promise<Join> {

    try{

      // Buscamos un registro con el uuid recibido 
      const joinDb: Join = await this.joinRepository.findOneBy({uuid});

      // Sí no encontramos un registro mandamos un error 
      if(!joinDb)
        throw new NotFoundException("Join no encontrado");

      // Retornamos el join 
      return joinDb

    }
    catch (error) {

      // Retornamos el error
      throw new InternalServerErrorException(error.response);

    }
  }

  // Buscar joins por usuario 
  async findAllByUser(uuid: string){

    try {
      
      // Buscamos un registro con el uuid recibido 
      const userDb: User = await this.userRepository.findOneBy({uuid});

      // Sí no encontramos un registro mandamos un error 
      if(!userDb)
        throw new NotFoundException("Usuario no encontrado");

      // Buscamos todos los joins por usuario 
      // const joinsDb: Join[] = await this.joinRepository.findBy({user: userDb});

      // Creamos el query 
      const queryBuilder: SelectQueryBuilder<Join> = this.joinRepository.createQueryBuilder('join');
      const joinsDb: Promise<Join[]> = queryBuilder
        .innerJoinAndSelect('join.consultation','consultation')
        .innerJoinAndSelect('join.user','user')
        .where('join.user.uuid = :uuid',{uuid}).getMany();

      // Retornamos los joins 
      return joinsDb;

    } catch (error) {
      
      // Mandamos el error
      throw new InternalServerErrorException(error.response); 

    }

  }

  // Buscar joins por asesoría 
  async findAllByConsultation(uuid: string){

    try {
      
      // Buscamos un registro con el uuid recibido 
      const consultationDb: Consultation = await this.consultationRepository.findOneBy({uuid});

      // Sí no encontramos un registro mandamos un error 
      if(!consultationDb)
        throw new NotFoundException("Asesoría no encontrada");

      // Buscamos todos los joins por usuario 
      const joinsDb: Join[] = await this.joinRepository.findBy({consultation: consultationDb});

      // Retornamos los joins 
      return joinsDb;

    } catch (error) {
      
      // Mandamos el error
      throw new InternalServerErrorException(error.response); 

    }

  }

  // Actualizar una join
  async update(uuid: string, updateJoinDto: UpdateJoinDto): Promise<UpdateJoinResponse> {

    try {
      
      const joinDb: Join = await this.joinRepository.findOneBy({uuid});

      if(!joinDb)
        throw new NotFoundException("Join no encontrado");

      await this.joinRepository.update({uuid},updateJoinDto);

      return {msg: "Join actualizado"}

    } catch (error) {
      throw new InternalServerErrorException(error.response);
    }
    // Desestructuramos el objeto
    // const { isActive, step, grade } = updateJoinDto;

    // try {

    //   // Buscamos un registro con el uuid recibido
    //   const joinDb: Join = await this.joinRepository.findOneBy({uuid});

    //   // Sí no encontramos un registro mandamos un error 
    //   if(!joinDb)
    //     throw new NotFoundException("Join no encontrado");

    //   // Si recibimos el estatus es que el cliente solo quiere actualizar el status
    //   if(status){
    //     // Actualizamos
    //     await this.joinRepository.update({uuid},{step});
        
    //     // Notificación al correo electrónico
    //     const queryBuilder: SelectQueryBuilder<Join> = this.joinRepository.createQueryBuilder('jo');
    //     const joinNotification: Join = await queryBuilder.innerJoinAndSelect('jo.user','user').innerJoinAndSelect('jo.consultation','consultation').where('jo.uuid = :uuid',{uuid}).getOne();
    //     const consultationDb: Consultation = await this.consultationRepository.findOneBy({uuid: joinNotification.consultation.uuid});
    //     // Creamos el formato
    //     // const htmlContent1: string = `
    //     //   <!DOCTYPE html>
    //     //   <html lang="en">
    //     //   <head>
    //     //       <meta charset="UTF-8">
    //     //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     //       <title>Document</title>
    //     //   </head>
    //     //   <body>
    //     //       <h4 style="font-family: monospace; color: rgb(109, 109, 109);">Querido <span style="color: rgb(0, 0, 0);">${joinNotification.user.first_name} ${joinNotification.user.last_name}</span>.</h4>
    //     //       <h4 style="font-family: monospace; color: rgb(109, 109, 109);">
    //     //           Te notificamos que tu asesor <span style="color: rgb(0, 0, 0);">${consultationDb.user.first_name} ${consultationDb.user.last_name}</span> 
    //     //           ha puesto en estatus <span style="color: rgb(0, 0, 0);">LIMBO</span > el <span style="color: rgb(0, 0, 0);">JOIN</span> de la asesoría de <span style="color: rgb(0, 0, 0);">${consultationDb.subject.name}</span> 
    //     //           impartida el día <span style="color: rgb(0, 0, 0);">${consultationDb.day}</span> de <span style="color: rgb(0, 0, 0);">${consultationDb.start}</span> a <span style="color: rgb(0, 0, 0);">${consultationDb.end}</span>. 
    //     //       </h4>
    //     //       <h4 style="font-family: monospace; color: rgb(109, 109, 109);">
    //     //           <span style="color: rgb(255, 39, 39);">Importante:</span> Tienes que asignarle una calificación a tu <span style="color: rgb(0, 0, 0);">JOIN</span> para terminar con el proceso.
    //     //       </h4>
    //     //   </body>
    //     //   </html>
    //     // `;
    //     // /* Enviamos el correo electrónico */
    //     // this.emailService.sendMail(joinNotification.user.email,'AsesoresApp: Procedimiento LIMBO',htmlContent1);
    //     // Retornamos la respuesta
    //     return {msg: "Estado del join actualizado"}

    //   }
    //   // Si recibimos la calificación significa que el cliente quiere calificar y actualizar el status del join
    //   else if(grade){
    //     // Si el status no es limbo retornamos el error
    //     if(joinDb.step != 'limbo')
    //       throw new UnauthorizedException("No puedes calificar un JOIN si no se encuentra en el paso limbo");
    //     // Creamos el status
    //     const finalStatus: string = "inactive";
    //     // Actualizamos el join
    //     await this.joinRepository.update({uuid},{grade, step: finalStatus});
    //     // Notificación al correo electrónico
    //     const queryBuilder: SelectQueryBuilder<Join> = this.joinRepository.createQueryBuilder('jo');
    //     const joinNotification: Join = await queryBuilder.innerJoinAndSelect('jo.user','user').innerJoinAndSelect('jo.consultation','consultation').where('jo.uuid = :uuid',{uuid}).getOne();
    //     const consultationDb: Consultation = await this.consultationRepository.findOneBy({uuid: joinNotification.consultation.uuid});
    //     // Creamos el formato
    //     // const htmlContent2: string = `
    //     //   <!DOCTYPE html>
    //     //   <html lang="en">
    //     //   <head>
    //     //       <meta charset="UTF-8">
    //     //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     //       <title>Document</title>
    //     //   </head>
    //     //   <body>
    //     //       <h4 style="font-family: monospace; color: rgb(109, 109, 109);">Genial!! <span style="color: rgb(0, 0, 0);">${consultationDb.user.first_name} ${consultationDb.user.last_name}</span>.</h4>
    //     //       <h4 style="font-family: monospace; color: rgb(109, 109, 109);">
    //     //           Nos alegra informarte que el JOIN de tu asesoría <span style="color: rgb(0, 0, 0);">${consultationDb.subject.name}</span> ya fue calificada por tu asesorado 
    //     //           <span style="color: rgb(0, 0, 0);">${joinNotification.user.first_name}  ${joinNotification.user.last_name}</span>. Muy buen trabajo.
    //     //       </h4>
    //     //   </body>
    //     //   </html>
    //     // `;
    //     // /* Enviamos el correo electrónico */
    //     // this.emailService.sendMail(consultationDb.user.email,'AsesoresApp: JOIN exitoso',htmlContent2);
    //     // Retornamos la respuesta
    //     return {msg: "Calificación del join actualizado"}
    //   }
    // } catch (error) {
    //   // Retornamos el error
    //   throw new InternalServerErrorException(error.response);
    // }
  }

  remove(id: number) {
    return `This action removes a #${id} join`;
  }
}
