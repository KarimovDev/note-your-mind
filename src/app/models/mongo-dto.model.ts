import { Desk } from './desk.model';
import { User } from './user.model';
import { TaskCard } from './task-card.model';

export interface MongoDto {
    result: { ok: number };
    status: number;
    message: string;
    data: Desk[] | TaskCard[] | User[];
}
