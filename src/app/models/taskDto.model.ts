import { TaskCard } from './taskcard.model';

export interface TaskDto {
    status: number;
    data: TaskCard[];
    message: string;
}
