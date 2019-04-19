import { TaskCard } from './task-card.model';
import { Desk } from './desk.model';

export interface MongoResponse {
    result: { ok: number };
    ops?: Desk[];
}
