import { Injectable } from '@angular/core';
import { Coords } from '../models/coords.model';

@Injectable()
export class LineDrawingService {
    public getCenterCoords(elem: Element): Coords {
        const box: ClientRect = elem.getBoundingClientRect();

        return {
            top: box.top + box.height / 2 + pageYOffset,
            left: box.left + box.width / 2 + pageXOffset,
        };
    }
}
