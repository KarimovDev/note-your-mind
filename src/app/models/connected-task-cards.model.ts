import { Coords } from './coords.model';

export interface ConnectedTaskCards {
    _id: string;
    color: string;
    _deskId: string;
    el1: string;
    coords1: Coords;
    el2: string;
    coords2: Coords;
}
