import { Injectable, OnInit, HostListener } from '@angular/core';
import { ITaskCard } from '../model/itaskcard';
import { Subject, Observable } from 'rxjs';
import { ICoords } from '../model/icoords';

@Injectable()
export class DragNDropService implements OnInit {
    public currentCard: ITaskCard;
    private _addCoords: any;
    private _deleteCoords: any;
    public shiftX: number;
    public shiftY: number;
    public currentIndex: number;

    public setDeleteCoords(element: Element): void {
        this._deleteCoords = this.getCoords(element);
    }

    public setAddCoords(element: Element): void {
        this._addCoords = this.getCoords(element);
    }

    get deleteCoords(): ICoords {
        return this._deleteCoords;
    }

    get addCoords(): ICoords {
        return this._addCoords;
    }

    public isIntersect(e: MouseEvent, coords: ICoords): boolean {
        return (
            e.pageY <= coords.top + 50 &&
            e.pageX <= coords.left + 50 &&
            e.pageX >= coords.left
        );
    }

    constructor() {}

    public ngOnInit(): void {}

    public getCoords(elem: any): { top: number; left: number } {
        const box: any = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset,
        };
    }

    private newTaskCreating: Subject<MouseEvent> = new Subject<MouseEvent>();
    public newTaskCreating$: Observable<MouseEvent> = this.newTaskCreating.asObservable();
    public sendNewTaskCreating(e: MouseEvent): void {
        this.newTaskCreating.next(e);
    }

    public setShift(e: MouseEvent, coords: ICoords): void {
        this.shiftX = e.pageX - coords.left;
        this.shiftY = e.pageY - coords.top;
    }
}
