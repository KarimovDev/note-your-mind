import { Task } from './task.model';

export interface TaskCard {
    id: string;
    name: string;
    top?: string;
    left?: string;
    isDrag?: boolean;
    isNew?: boolean;
    zIndex?: number;
    opacity?: number;
    tasks: Array<Task>;
}
