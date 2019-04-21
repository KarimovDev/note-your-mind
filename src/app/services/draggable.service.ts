import { Injectable, OnInit, HostListener } from '@angular/core';
import { TaskCard } from '../models/task-card.model';
import { Subject, Observable } from 'rxjs';
import { Coords } from '../models/coords.model';

@Injectable()
export class DraggableService {
    public currentCard: TaskCard;
    public addCoords: Coords;
    public deleteCoords: Coords;
    public shiftX: number;
    public shiftY: number;
    public currentIndex: number;
    private marginTop: number = 12;
    public marginLeft: number = 20;

    public setDeleteCoords(element: Element): void {
        this.deleteCoords = this.getCoords(element);
    }

    public setAddCoords(element: Element): void {
        this.addCoords = this.getCoords(element);
    }

    public isIntersect(e: MouseEvent, coords: Coords): boolean {
        return (
            e.pageY <= coords.top + 50 + this.marginTop &&
            e.pageX <= coords.left + 50 + this.marginLeft &&
            e.pageX >= coords.left + this.marginLeft
        );
    }

    public getCoords(elem: Element): Coords {
        const box: ClientRect = elem.getBoundingClientRect();

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
