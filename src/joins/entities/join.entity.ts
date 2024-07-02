import { Consultation } from "src/consultations/entities/consultation.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Join {

    // Llave primaria
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    // Fecha de creación
    @Column('text')
    date_creation: string;

    // Activo
    @Column('bool',{default: true})
    isActive: boolean;

    // Etapa
    @Column('text',{default: 'inProgress'})
    step: string;

    // Calificación
    @Column('numeric',{default: 0})
    grade: number;

    // Etapa
    @Column('text',{default: 'No comment was founded'})
    comment: string;

    // Relación de un join a un usuario 
    @ManyToOne(() => User, (user) => user.joins, { onDelete: "CASCADE", eager: true },)
    user: User;

    // Relación de un join a una asesoría 
    @ManyToOne(() => Consultation, (consultation) => consultation.joins, { onDelete: "CASCADE" })
    consultation: Consultation;
}