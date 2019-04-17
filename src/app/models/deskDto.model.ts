import { Desk } from './desk.model';

export interface DeskDto {
    status: number;
    data: Desk[];
    message: string;
}
