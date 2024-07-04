import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';

// Token
import { JwtService } from '@nestjs/jwt';

// Dto
import { SigninDto } from './dto/signin-auth.dto';

// Entidad
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {

  // Constructor 
  constructor( 
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService    : JwtService){}

  // Iniciar sesión
  async signIn(signinDto: SigninDto) {
    // Desestructuramos el objeto
    const {institutional_code, password} = signinDto;
    try {
      // Buscamos el usuario en la base de datos
      const userDb = await this.userRepository.findOneBy({ institutional_code });
      // Sí el usuario no se encuentra 
      if(!userDb)
        throw new UnauthorizedException("Código o contraseña invalido");
      // Si la contraseña ingresada no coincide con la contraseña del usuario encontrado
      if(!bcrypt.compareSync(password, userDb.password))
        throw new UnauthorizedException("Código o contraseña invalido");
      // Sí el usuario está inactivo
      if(!userDb.isActive)
        throw new UnauthorizedException("Tu usuario está en proceso de admisión o fue inhabilitado");
      // Retornamos la respuesta 
      return {
        msg: 'Acceso concedido',
        user: userDb,
        token: this.getToken(userDb.uuid)
      }

    } catch (error) {

      // Arrojamos el error
      throw new InternalServerErrorException(error.response);
      
    }
  }

  // Generar token
  getToken(uuid: string): string{
    try {
      // Generamos el token
      const token = this.jwtService.sign({uuid});
      // Retornamos el token
      return token;
    } catch (error) {
      // Retornamos el error
      throw new InternalServerErrorException(error.response);
    }
  }

  // Renovar token
  async renewToken(req: Request): Promise<any>{
    // Desestructuramos el objeto
    const uuid  = req.body.uuid;
    
    try {
      // Obtenemos el usuario de la base de datos
      const userDb = await this.userRepository.findOneBy({ uuid });
      // Si no encontramos al usuario
      if(!userDb)
        throw new NotFoundException("Usuario no encontrado");
      // Retornamos el token
      return {
        msg: "Renovación de token exitosa",
        user: userDb,
        token: this.getToken(uuid)
      }
    } catch (error) {
      /* Retornamos el error */
      throw new InternalServerErrorException(error.response);
    }
  }
}