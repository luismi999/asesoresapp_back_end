import { IsNotEmpty, IsString } from "class-validator";

export class CreateSubjectDto {

    // clave de la cátedra 
    @IsNotEmpty({message: 'La clave es necesario'})
    @IsString({message: 'La código debe ser una cadena de caracteres'})
    code: string;

    @IsNotEmpty({message: 'El nombre de la cátedra es necesario'})
    @IsString({message: 'El nombre de la cátedra debe ser una cadena de caracteres'})
    name: string;
}
