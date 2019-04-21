import { Desk } from './desk.model';
import { User } from './user.model';
import { TaskCard } from './task-card.model';
import { ConnectedTaskCards } from './connected-task-cards';

export interface MongoDto {
    result: { ok: number };
    status: number;
    message: string;
    data:
        | Desk[]
        | User[]
        | { taskCards: TaskCard[]; connectedTaskCards: ConnectedTaskCards[] };
}
