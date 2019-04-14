import { Component, OnInit, HostListener } from '@angular/core';
import { TaskCard } from '../../models/taskcard.model';
import { DeskDataService } from '../../services/desk-data.service';
import { DragNDropService } from '../../services/drag-n-drop.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

@Component({
    selector: 'nym-desk',
    templateUrl: './desk.component.html',
    styleUrls: ['./desk.component.scss'],
})
export class DeskComponent implements OnInit {
    private taskCards: TaskCard[] = [];
    private maxZIndex: number = 0;
    private subscription: Subscription;
    private cardWidth: number = 350;
    private cardHeight: number = 50;
    private getNewCard(top: number, left: number): TaskCard {
        return {
            id: 'uniqueID',
            name: 'New task',
            tasks: [],
            top: top + 'px',
            left: left + 'px',
            zIndex: ++this.maxZIndex,
            isNew: true,
            isDrag: true,
        };
    }

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
        private dragNDropService: DragNDropService,
        private route: ActivatedRoute
    ) {
        this.subscription = dragNDropService.newTaskCreating$.subscribe(
            (e: MouseEvent) => {
                this.taskCards.push(
                    this.getNewCard(
                        e.pageY - this.cardHeight / 2,
                        e.pageX - this.cardWidth / 2
                    )
                );
                dragNDropService.currentIndex = this.taskCards.length - 1;
                dragNDropService.currentCard = this.taskCards[
                    dragNDropService.currentIndex
                ];

                this.dragNDropService.shiftX = this.cardWidth / 2;
                this.dragNDropService.shiftY = this.cardHeight / 2;
            }
        );
    }

    public ngOnInit(): void {
        this.route.paramMap
            .pipe(
                map((paramMap: ParamMap) => paramMap.get('id')),
                switchMap((id: string) => this.deskDataService.getData(id))
            )
            .subscribe((desk: TaskCard) => {
                if (desk) {
                    this.taskCards.push(desk);
                }
            });
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private onMouseDown(e: MouseEvent, index: number): boolean {
        this.dragNDropService.currentCard = this.taskCards[index];
        this.dragNDropService.currentCard.isDrag = true;
        this.dragNDropService.currentIndex = index;

        const target: any = e.target;

        this.maxZIndex++;
        target.parentNode.style.zIndex = this.maxZIndex.toString();

        this.dragNDropService.setShift(
            e,
            this.dragNDropService.getCoords(target)
        );

        return false;
    }

    @HostListener('document:mouseup', ['$event'])
    private onMouseUp(e: MouseEvent): void {
        if (!this.dragNDropService.currentCard) {
            return;
        } else if (
            this.dragNDropService.isIntersect(
                e,
                this.dragNDropService.deleteCoords
            ) &&
            this.dragNDropService.currentCard.isDrag
        ) {
            this.dragNDropService.currentCard = undefined;
            this.taskCards.splice(this.dragNDropService.currentIndex, 1);
        } else if (
            this.dragNDropService.isIntersect(
                e,
                this.dragNDropService.addCoords
            ) &&
            this.dragNDropService.currentCard.isDrag &&
            this.dragNDropService.currentCard.isNew
        ) {
            this.dragNDropService.currentCard = undefined;
            this.taskCards.splice(this.dragNDropService.currentIndex, 1);
        } else {
            this.dragNDropService.currentCard.isDrag = false;
        }
    }
}
