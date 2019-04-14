import { ITask } from './itask';

export interface ITaskCard {
    id: string;
    name: string;
    top?: string;
    left?: string;
    isDrag?: boolean;
    isNew?: boolean;
    zIndex?: number;
    tasks: Array<ITask>;
}
