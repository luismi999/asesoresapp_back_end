import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SigninDto {

    // Código institucional
    @IsNotEmpty({message: 'El código institucional es necesario'})
    @IsString({message: 'El código institucional debe ser una cadena de caracteres'})
    institutional_code: string;
    
    // Contraseña 
    @IsNotEmpty({message: 'La contraseña es necesaria'})
    @IsString({message: 'La contraseñe debe ser una cadena de caracteres'})
    @MinLength(8,{message: 'La contraseña debe de tener una longitud minima de 8 caracteres'})
    password: string;
}