import { Injectable, NestMiddleware, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RenewTokenMiddleware implements NestMiddleware {

    /* ------------------------------------------------ Constructor ------------------------------------------*/
    constructor( private readonly jwtService: JwtService ) {}
  
    /* ------------------------------------------- Función del middleware------------------------------------ */
    async use( req: Request, res: Response, next: NextFunction ): Promise<void> {
        // Obtenemos el token del header 
        const token: string = req.header('token');
        // Sí no encontramos el token, no fue enviado y retornamos un error 
        if( !token )
            throw new NotFoundException('No se recibió ningún token');
        // Creamos nuestra palabra secreta para la firma del token 
        const secret: string = `asesoresapp`;
        try {
            // Obtenemos el uuid del token 
            const { uuid } = await this.jwtService.verify( token, { secret } );
            // Insertamos el uuid en el body de la petición 
            req.body.uuid = uuid;
            // Continuamos 
            next();
        } catch (error) {
            // Sí hay un error lo retornamos 
            throw new InternalServerErrorException( error.response );
        }
    }
}