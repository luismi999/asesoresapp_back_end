import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    // Código institucional 
    @IsNotEmpty({message: 'El código institucional es necesario'})
    @IsString({message: 'El código institucional debe ser una cadena de caracteres'})
    institutional_code: string;

    // Correo institucional 
    @IsNotEmpty({message: 'El correo institucional es necesario'})
    @IsEmail({},{message: 'El correo institucional debe ser valido'})
    institutional_email: string;

    // Nombre(s)
    @IsNotEmpty({message: 'El nombre es necesario'})
    @IsString({message: 'El nombre debe ser una cadena de caracteres'})
    @MinLength(3,{message: 'El nombre debe tener una longitud minima de 3 caracteres'})
    @MaxLength(30,{message: 'El nombre debe tener una longitud maxima de 30 caracteres'})
    first_name: string;

    // Apellido(s)
    @IsNotEmpty({message: 'El apellido es necesario'})
    @IsString({message: 'El apellido debe ser una cadena de caracteres'})
    @MinLength(3,{message: 'El apellido debe tener una longitud minima de 3 caracteres'})
    @MaxLength(30,{message: 'El apellido debe tener una longitud maxima de 30 caracteres'})
    last_name: string;

    // Numero de teléfono 
    @IsNotEmpty({message: 'El numero de celular es necesario'})
    @IsNumber({},{message: 'El numero de celular debe ser un numero de teléfono valido'})
    cellphone_number: number;

    // Role
    @IsNotEmpty({message: 'El role es necesario'})
    @IsString({message: 'El role debe ser una cadena de caracteres'})
    role: string;

    // Contraseña 
    @IsNotEmpty({message: 'La contraseña es necesaria'})
    @IsString({message: 'La contraseña debe ser una cadena de caracteres'})
    @MinLength(8,{message: 'La contraseña debe tener una longitud minima de 8 caracteres'})
    password: string;

    // Indicativo si un usuario esta activo
    @IsBoolean({message: 'El IsActive debe ser una cadena de caracteres'})
    @IsOptional({message: 'El IsActive es opcional al momento de crear el usuario y al actualizarlo'})
    isActive: boolean;
}
