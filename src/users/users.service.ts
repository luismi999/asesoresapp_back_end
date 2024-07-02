import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// Bcrypt y Mailer 
import * as bcrypt from 'bcrypt';
import { EmailService } from '../mailer/email/email.service';

// DTOs 
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Entities 
import { User } from './entities/user.entity';

// Interfaces 
import { CreateUserResponse } from 'src/interfaces/createUserResponse.interface';
import { UpdateUserResponse } from 'src/interfaces/updateUserResponse.interface';
import { DeleteUserResponse } from 'src/interfaces/deleteUserResponse.interface';


@Injectable()
export class UsersService {

  // Constructor 
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService  : EmailService){}

  // Crear un nuevo usuario
  async create( createUserDto: CreateUserDto ): Promise<CreateUserResponse>{

    // Desestructuramos el objeto (separamos sus valores individualmente)
    let {institutional_code, institutional_email, first_name, last_name, cellphone_number, role, password} = createUserDto;

    // Convertimos los valores a minúsculas
    institutional_code  = institutional_code.toLowerCase();
    institutional_email = institutional_email.toLowerCase();
    first_name          = first_name.toLowerCase();
    last_name           = last_name.toLowerCase();
    role                = role.toLowerCase();

    // Estructura del mensaje para el correo
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
    //         Querido <span style="color: rgb(0, 0, 0);">${first_name.toUpperCase()} ${last_name.toUpperCase()}</span>, 
    //         te agradecemos que quieras formar parte de AsesoresApp.
    //       </h4>
    //       <h4 style="font-family: monospace; color: rgb(109, 109, 109);">
    //           Tu solicitud para formar parte de nuestra gran familia está siendo revisada por nuestros administradores, 
    //           queremos guardar la integridad de nuestra confiabilidad y profesionalismo, es por ello que tu cuenta se 
    //           encontrará inactiva. Sí pasadas 32hrs hábiles aún no cuentas con acceso a la aplicación comunícate a la 
    //           coordinación de informática.
    //       </h4>
    //       <h4 style="font-family: monospace; color: rgb(109, 109, 109);">
    //           Esperemos vernos pronto. AsesoresApp
    //       </h4>
    //   </body>
    //   </html>
    // `;

    try {
      
      // Buscamos un registro con el código institucional recibido
      const foundUserByCode: User = await this.userRepository.findOneBy({institutional_code});

      // Si encontramos un registro significa que el el código ya fue registrado en otra cuenta y retornamos un error
      if(foundUserByCode)
        throw new UnauthorizedException('El código institucional ya se encuentra registrado por otra cuenta');

      // Buscamos un registro con el correo institucional recibido
      const foundUserByEmail: User = await this.userRepository.findOneBy({institutional_email});

      // Si encontramos si encontramos un registro significa que otra cuenta ya lo registro y retornamos un error
      if(foundUserByEmail)
        throw new UnauthorizedException('El correo institucional ya se encuentra registrado por otra cuenta');

      // Creamos el modelo para la base de datos
      const newUser: User = this.userRepository.create({institutional_code, institutional_email, first_name, last_name, cellphone_number, role, password: bcrypt.hashSync(password, 10)});

      // Guardamos el usuario en la base de datos
      await this.userRepository.save(newUser);

      // Enviamos el correo electrónico
      // this.emailService.sendMail(email,'Proceso de admisión AsesoresApp',htmlContent);

      /* Retornamos un mensaje de éxito */
      return { msg: 'Tu cuenta fue registrada y se encuentra en proceso de aceptación'}

    } catch (error) {

      /* Retornamos un error */
      throw new InternalServerErrorException(error.response);

    }
  }

  // Buscamos todos los usuarios 
  async findAll(): Promise<User[]>{
    try {

      // Buscamos todos los usuarios de la base de datos 
      const usersDb: User[] = await this.userRepository.find({});
      
      // Si no hay usuarios mandamos el error 
      if(!usersDb)
        throw new NotFoundException('No se encontraron usuarios activos');

      // Retornamos todos los usuarios 
      return usersDb;

    } catch (error) {

      // Retornamos el error 
      throw new InternalServerErrorException(error.response);

    }
  }

  // Buscar un usuario 
  async findOne(uuid: string): Promise<User>{

    try {

      // Buscamos un registro con el uuid recibido
      const userDb: User = await this.userRepository.findOneBy({uuid});

      // Si no encontramos el usuario lanzamos un error 
      if(!userDb)
        throw new NotFoundException('Usuario no encontrado');

      // Retornamos el usuario encontrado 
      return userDb;

    } catch (error) {

      // Mandamos el error 
      throw new InternalServerErrorException(error.response);

    }
  }

  // Actualizar un usuario
  async update(uuid: string, updateUserDto: UpdateUserDto): Promise<UpdateUserResponse> {

    // Desestructuramos el objeto (separamos los valores)
    const {institutional_code, password, ...rest} = updateUserDto;

    try {

      // Buscamos un registro por el uuid recibido
      const userDb: User = await this.userRepository.findOneBy({uuid});

      // Si no encontramos el usuario retornamos el error
      if(!userDb)
        throw new NotFoundException("Usuario no encontrado");

      // Actualizamos el usuario
      await this.userRepository.update({uuid},rest);

      // Retornamos la respuesta
      return { msg: 'Usuario actualizado' }

    } catch (error) {

      // Retornamos el error
      throw new InternalServerErrorException(error.response);

    }
  }

  // Eliminar un usuario 
  async remove(uuid: string): Promise<DeleteUserResponse>{

    try {

      // Buscamos un registro por el uuid recibido
      const userDb: User = await this.userRepository.findOneBy({uuid});

      // Si no lo encontramos el usuario retornamos un error
      if(!userDb)
        throw new NotFoundException('Usuario no encontrado');

      // Eliminamos el usuario de la base de datos 
      await this.userRepository.delete({uuid});

      // Regresamos el mensaje de éxito 
      return { msg: 'Usuario eliminado'}

    } catch (error) {

      // Retornamos el error 
      throw new InternalServerErrorException(error.response);
      
    }
  }
}