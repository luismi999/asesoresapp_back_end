import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength, maxLength } from "class-validator";

export class CreateJoinDto {

    // uuid del estudiante creador del join 
    @IsNotEmpty({message: 'El uuid del usuario es necesario'})
    @IsString({message: 'El uuid del usuario debe ser una cadena de caracteres'})
    uuid_user: string;

    // uuid de la asesoría al que el estudiante desea unirse 
    @IsNotEmpty({message: 'El uuid de la asesoría es necesario'})
    @IsString({message: 'El uuid de la asesoría debe ser una cadena de caracteres'})
    uuid_consultation: string;

    // La etapa en el que se encuentra el asesoramiento 
    @IsNotEmpty({message: 'La etapa del asesoramiento es necesario'})
    @IsString({message: 'La etapa del asesoramiento debe ser una cadena de caracteres'})
    @IsOptional()
    step?: string;

    // La calificación del asesoramiento 
    @IsNotEmpty({message: 'La calificación del asesoramiento es necesario'})
    @IsNumber({},{message: 'La calificación debe ser un numero entero'})
    @IsOptional()
    grade?: number;

    // Comentario del asesoramiento 
    @IsNotEmpty({message: 'El comentario del asesoramiento es necesario'})
    @IsString({message: 'El comentario del asesoramiento debe ser una cadena de caracteres'})
    @MinLength(10)
    @MaxLength(200)
    @IsOptional()
    comment?: string;

    // La calificación del asesoramiento 
    @IsNotEmpty({message: 'El isActive del asesoramiento es necesario'})
    @IsBoolean({message: 'El isActive del asesoramiento debe ser un boolean'})
    @IsOptional()
    isActive?: boolean;
    
}