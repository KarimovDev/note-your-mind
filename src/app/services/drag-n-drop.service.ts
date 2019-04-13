import { Injectable, OnInit, HostListener } from '@angular/core';
import { ITaskCard } from '../model/itaskcard';

@Injectable({
    providedIn: 'root',
})
export class DragNDropService implements OnInit {
    public currentCard: ITaskCard;
    public deleteCoords: any;
    public shiftX: number;
    public shiftY: number;
    public currentIndex: number;

    constructor() {}

    public ngOnInit(): void {}

    public getCoords(elem: any): { top: number; left: number } {
        elem.parentNode.style.position = 'fixed';

        const box: any = elem.getBoundingClientRect();

        elem.parentNode.style.position = 'absolute';

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset,
        };
    }

}
