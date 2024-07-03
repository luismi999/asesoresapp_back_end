import { Subject } from "src/subjects/entities/subject.entity";
import { User } from "src/users/entities/user.entity";

export interface CreateConsultation {
    date_creation: string;
    day          : string;
    start        : string;
    end          : string;
    map_latitud  : number;
    map_longitud : number;
    user         : User;
    subject      : Subject;
}