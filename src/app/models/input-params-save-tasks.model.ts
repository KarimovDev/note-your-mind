import { TaskCard } from './task-card.model';
import { ConnectedTaskCards } from './connected-task-cards.model';

export interface InputParamsSaveTasks {
    taskCards: TaskCard[];
    deletedCardsIds: string[];
    connectedTaskCards: ConnectedTaskCards[];
    deletedConnIds: string[];
}
