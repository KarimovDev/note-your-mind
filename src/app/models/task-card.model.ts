import { Task } from './task.model';

export interface TaskCard {
    _id: string;
    _deskId?: string;
    name: string;
    top?: string;
    left?: string;
    isNew?: boolean;
    zIndex?: number;
    tasks: Task[];
    isButtonPressed?: boolean;
    isAddBlockOpen?: boolean;
    color?: string;
}
