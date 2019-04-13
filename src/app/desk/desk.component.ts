import { Component, OnInit, HostListener } from '@angular/core';
import { ITaskCard } from '../model/itaskcard';
import { DeskDataService } from '../services/desk-data.service';
import { DragNDropService } from '../services/drag-n-drop.service';
import { MethodFn } from '@angular/core/src/reflection/types';

@Component({
    selector: 'nym-desk',
    templateUrl: './desk.component.html',
    styleUrls: ['./desk.component.scss'],
})
export class DeskComponent implements OnInit {
    private taskCards: ITaskCard[] = [];
    private currentCard: ITaskCard;
    private shiftX: number;
    private shiftY: number;
    private maxZIndex: number = 0;

    @HostListener('document:mousemove', ['$event'])
    private onMouseMove(e: MouseEvent): void {
        if (this.currentCard && this.currentCard.isDrag) {
            this.currentCard.top = e.pageY - this.shiftY + 'px';
            this.currentCard.left = e.pageX - this.shiftX + 'px';
        }
    }

    @HostListener('document:ondragstart')
    private onDragStart(): boolean {
        return false;
    }

    constructor(
        private deskDataService: DeskDataService,
        private dragNDropService: DragNDropService
    ) {}

    public ngOnInit(): void {
        this.taskCards = this.deskDataService.getData();
    }

    private onMouseDown(e: MouseEvent, index: number): void {
        this.currentCard = this.taskCards[index];
        this.currentCard.isDrag = true;

        const target: any = e.target;

        this.maxZIndex++;
        target.parentNode.style.zIndex = this.maxZIndex.toString();

        const getCoords: any = (elem: any): { top: number; left: number } => {
            elem.parentNode.style.position = 'fixed';

            const box: any = elem.getBoundingClientRect();

            elem.parentNode.style.position = 'absolute';

            return {
                top: box.top + pageYOffset,
                left: box.left + pageXOffset,
            };
        };

        const coords: { top: number; left: number } = getCoords(target);

        this.shiftX = e.pageX - coords.left;
        this.shiftY = e.pageY - coords.top;
    }

    private onMouseUp(index: number): void {
        this.currentCard = this.taskCards[index];
        this.currentCard.isDrag = false;
    }
}
