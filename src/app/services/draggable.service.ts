import { Injectable, OnInit, HostListener } from '@angular/core';
import { TaskCard } from '../models/task-card.model';
import { Subject, Observable } from 'rxjs';
import { Coords } from '../models/coords.model';

@Injectable()
export class DraggableService {
    public currentCard: TaskCard;
    private _addCoords: any;
    private _deleteCoords: any;
    public shiftX: number;
    public shiftY: number;
    public currentIndex: number;
    private marginTop: number = 12;
    public marginLeft: number = 20;

    public setDeleteCoords(element: Element): void {
        this._deleteCoords = this.getCoords(element);
    }

    public setAddCoords(element: Element): void {
        this._addCoords = this.getCoords(element);
    }

    get deleteCoords(): Coords {
        return this._deleteCoords;
    }

    get addCoords(): Coords {
        return this._addCoords;
    }

    public isIntersect(e: MouseEvent, coords: Coords): boolean {
        return (
            e.pageY <= coords.top + 50 + this.marginTop &&
            e.pageX <= coords.left + 50 + this.marginLeft &&
            e.pageX >= coords.left + this.marginLeft
        );
    }

    constructor() {}

    public ngOnInit(): void {}

    public getCoords(elem: any): { top: number; left: number } {
        const box: any = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset - this.marginTop,
            left: box.left + pageXOffset - this.marginLeft,
        };
    }

    private newTaskCreating: Subject<MouseEvent> = new Subject<MouseEvent>();
    public newTaskCreating$: Observable<
        MouseEvent
    > = this.newTaskCreating.asObservable();
    public sendNewTaskCreating(e: MouseEvent): void {
        this.newTaskCreating.next(e);
    }

    public setShift(e: MouseEvent, coords: Coords): void {
        this.shiftX = e.pageX - coords.left;
        this.shiftY = e.pageY - coords.top;
    }
}
