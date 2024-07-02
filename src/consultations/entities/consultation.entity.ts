import { Join } from "src/joins/entities/join.entity";
import { Subject } from "src/subjects/entities/subject.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Consultation {

    // Llave primaria
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    // Fecha de creación de la asesoría 
    @Column("text")
    date_creation: string;

    // // Cátedra de la asesoría
    // @Column("text")
    // theme: string;

    // Día de la asesoría 
    @Column("text")
    day: string;

    // Hora de inicio de la asesoría 
    @Column("text")
    start: string;

    // Hora de finalización de la asesoría 
    @Column("text")
    end: string;

    // Estado de la asesoría 
    @Column("bool",{default: true})
    isActive: boolean;

    // Longitud del mapa de la asesoría 
    @Column("numeric")
    map_longitud: number;

    // Latitud del mapa de la asesoría 
    @Column("numeric")
    map_latitud: number;

    // Relación de asesoría a usuario 
    @ManyToOne(() => User, (user) => user.consultations, { onDelete: "CASCADE", eager: true })
    user: User;

    // Relación de asesoría a joins 
    @OneToMany(() => Join, (join) => join.consultation, { onDelete: "CASCADE", eager: true })
    joins: Join[];

    // Relación de cátedras a joins 
    @ManyToOne(() => Subject, (subject) => subject.consultations, { onDelete: "CASCADE", eager: true })
    subject: Subject;
}