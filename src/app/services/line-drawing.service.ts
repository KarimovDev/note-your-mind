import { Injectable } from '@angular/core';
import { Coords } from '../models/coords.model';

@Injectable()
export class LineDrawingService {
    public getCenterCoords(elem: Element): Coords {
        const box: ClientRect = elem.getBoundingClientRect();
        const paddingTopForLine: number = 80;

        return {
            top: box.top + paddingTopForLine + pageYOffset,
            left: box.left + box.width / 2 + pageXOffset,
        };
    }
}
