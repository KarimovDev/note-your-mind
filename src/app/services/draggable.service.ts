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
    public marginTopTask: number = 12;
    public marginLeftTask: number = 20;
    public navButtonSize: number = 50;
    public navButtonScale: number = 1.3;
    public addElement: Element;
    public deleteElement: Element;

    public setDeleteCoords(): void {
        this.deleteCoords = this.getCoords(this.deleteElement);
    }

    public setAddCoords(): void {
        this.addCoords = this.getCoords(this.addElement);
    }

    public isIntersect(e: MouseEvent, coords: Coords): boolean {
        return (
            e.pageY <=
                coords.top + this.navButtonSize * 1.3 + this.marginTopTask &&
            e.pageY >= coords.top + this.marginTopTask &&
            e.pageX <=
                coords.left + this.navButtonSize * 1.3 + this.marginLeftTask &&
            e.pageX >= coords.left + this.marginLeftTask
        );
    }

    public getCoords(elem: Element): Coords {
        const box: ClientRect = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset - this.marginTopTask,
            left: box.left + pageXOffset - this.marginLeftTask,
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
