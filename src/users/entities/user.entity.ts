import { Consultation } from "src/consultations/entities/consultation.entity";
import { Join } from "src/joins/entities/join.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class User {

    // Clave primaria 
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    // Código institucional 
    @Column('text')
    institutional_code: string;

    // Correo institucional 
    @Column('text')
    institutional_email: string;

    // Nombre
    @Column('text')
    first_name: string;

    // Apellido
    @Column('text')
    last_name: string;
    
    // Numero de celular 
    @Column('numeric')
    cellphone_number: number;

    // Role
    @Column('text')
    role: string;

    // Estado
    @Column('bool', {default: false})
    isActive?: boolean;

    // Contraseña 
    @Column('text')
    password: string;

    /* Relación Usuario y Asesorías */
    @OneToMany(() => Consultation, (consultation) => consultation.user, { cascade: true })
    consultations: Consultation[];
    
    /* Relación Usuario y Joins */
    @OneToMany(() => Join, (join) => join.user, { cascade: true })
    joins: Join[];
}