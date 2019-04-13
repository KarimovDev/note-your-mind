import { Component, OnInit, HostListener } from '@angular/core';
import { ITaskCard } from '../model/itaskcard';
import { DeskDataService } from '../services/desk-data.service';
import { DragNDropService } from '../services/drag-n-drop.service';

@Component({
    selector: 'nym-desk',
    templateUrl: './desk.component.html',
    styleUrls: ['./desk.component.scss'],
})
export class DeskComponent implements OnInit {
    private taskCards: ITaskCard[] = [];
    private maxZIndex: number = 0;

    @HostListener('document:mousemove', ['$event'])
    private onMouseMove(e: MouseEvent): void {
        if (
            this.dragNDropService.currentCard &&
            this.dragNDropService.currentCard.isDrag
        ) {
            this.dragNDropService.currentCard.top =
                e.pageY - this.dragNDropService.shiftY + 'px';
            this.dragNDropService.currentCard.left =
                e.pageX - this.dragNDropService.shiftX + 'px';
        }
    }

    @HostListener('document:selectstart')
    private onSelectStart(): boolean {
        return false;
    }

    @HostListener('document:mousedown')
    private onMouseDownDoc(): boolean {
        return false;
    }

    constructor(
        private deskDataService: DeskDataService,
        private dragNDropService: DragNDropService
    ) {}

    public ngOnInit(): void {
        this.taskCards = this.deskDataService.getData();
    }

    private onMouseDown(e: MouseEvent, index: number): boolean {
        this.dragNDropService.currentCard = this.taskCards[index];
        this.dragNDropService.currentCard.isDrag = true;
        this.dragNDropService.currentIndex = index;

        const target: any = e.target;

        this.maxZIndex++;
        target.parentNode.style.zIndex = this.maxZIndex.toString();

        const coords: {
            top: number;
            left: number;
        } = this.dragNDropService.getCoords(target);

        this.dragNDropService.shiftX = e.pageX - coords.left;
        this.dragNDropService.shiftY = e.pageY - coords.top;

        return false;
    }

    @HostListener('document:mouseup', ['$event'])
    private onMouseUp(e: MouseEvent): void {
        if (
            e.pageY <= this.dragNDropService.deleteCoords.top + 50 &&
            e.pageX <= this.dragNDropService.deleteCoords.left + 50 &&
            e.pageX >= this.dragNDropService.deleteCoords.left
        ) {
            this.dragNDropService.currentCard = undefined;
            this.taskCards.splice(this.dragNDropService.currentIndex, 1);
        } else {
            this.dragNDropService.currentCard.isDrag = false;
        }
    }
}
