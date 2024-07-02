import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateConsultationDto {

    // Cátedra 
    // @IsNotEmpty({message: 'La cátedra es necesaria'})
    // @IsString({message: 'La cátedra debe ser una cadena de caracteres'})
    // theme: string;

    // Fecha de creación 
    @IsString({message: 'La fecha de creación es opcional al momento de crear una asesoría'})
    @IsOptional()
    date_creation?: string;

    // Día 
    @IsNotEmpty({message: 'El día es necesario'})
    @IsString({message: 'El día debe ser una cadena de caracteres'})
    day: string;

    // Hora de inicio 
    @IsNotEmpty({message: 'La hora de inicio es necesaria'})
    @IsString({message: 'La hora de inicio debe ser una cadena de caracteres'})
    start: string;

    // Hora de finalización 
    @IsNotEmpty({message: 'La hora de finalización es necesaria'})
    @IsString({message: 'La hora de finalización debe ser una cadena de caracteres'})
    end: string;

    // Longitud del mapa
    @IsNotEmpty({message: 'La longitud del mapa es necesaria'})
    @IsNumber({},{message: 'La longitud del mapa debe ser numérica'})
    map_longitud: number;

    // Latitud del mapa
    @IsNotEmpty({message: 'La latitud del mapa es necesaria'})
    @IsNumber({},{message: 'La latitud del mapa debe ser numérica'})
    map_latitud: number;

    // Active 
    @IsBoolean({message: 'El active es opcional al crear una asesoría'})
    @IsOptional()
    isActive?: boolean;

    // uuid del usuario creador
    @IsNotEmpty({message: 'El uuid del usuario es necesario'})
    @IsString({message: 'El uuid del usuario debe ser una cadena de caracteres'})
    uuid_user: string;

    // uuid de la cátedra
    @IsNotEmpty({message: 'El uuid la cátedra es necesario'})
    @IsString({message: 'El uuid de la cátedra debe ser una cadena de caracteres'})
    uuid_subject: string;
}