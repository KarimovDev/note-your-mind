import { Task } from './task.model';

export interface TaskCard {
    _id: string;
    _deskId?: string;
    name: string;
    top?: string;
    left?: string;
    isDrag?: boolean;
    isNew?: boolean;
    zIndex?: number;
    opacity?: number;
    tasks: Task[];
    isButtonPressed?: boolean;
}
