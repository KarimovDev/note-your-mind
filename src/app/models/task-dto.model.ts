import { TaskCard } from './task-card.model';

export interface TaskDto {
    status: number;
    data: TaskCard[];
    message: string;
}
