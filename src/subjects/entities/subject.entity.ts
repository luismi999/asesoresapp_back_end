import { Consultation } from "src/consultations/entities/consultation.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Subject {

    // Llave primaria 
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    // Clave de la cátedra 
    @Column('text')
    code: string;

    // Nombre de la cátedra 
    @Column('text')
    name: string;

    // Relación con las asesorías 
    @OneToMany(() => Consultation, (consultation) => consultation.subject, { onDelete: 'CASCADE'})
    consultations: Consultation[];

}