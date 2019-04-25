import { Injectable } from '@angular/core';
import { Coords } from '../models/coords.model';

@Injectable()
export class LineDrawingService {
    public lineShiftX: number;
    public lineShiftY: number;

    public getCenterCoords(elem: Element): Coords {
        const box: ClientRect = elem.getBoundingClientRect();
        const paddingTopForLine: number = 80;

        return {
            top: box.top + paddingTopForLine + pageYOffset,
            left: box.left + box.width / 2 + pageXOffset,
        };
    }

    public setLineShift(e: MouseEvent, elem: Element): void {
        const coords: Coords = this.getCenterCoords(elem);

        this.lineShiftX = e.pageX - coords.left;
        this.lineShiftY = e.pageY - coords.top;
    }
}
