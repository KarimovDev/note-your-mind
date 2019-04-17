import { TaskCard } from './taskcard.model';
import { Desk } from './desk.model';

export interface MongoResponse {
    result: { ok: number };
    ops: Desk[] | TaskCard[];
}
