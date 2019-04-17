import { Component, OnInit, HostListener } from '@angular/core';
import { TaskCard } from '../../models/taskcard.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { DeskHttpService } from 'src/app/services/desk-http.service';
import { TaskDto } from 'src/app/models/taskDto.model';
import { DraggableService } from 'src/app/services/draggable.service';

@Component({
    selector: 'nym-desk',
    templateUrl: './desk.component.html',
    styleUrls: ['./desk.component.scss'],
})
export class DeskComponent implements OnInit {
    public taskCards: TaskCard[] = [];
    private maxZIndex: number = 0;
    private subscription: Subscription;
    public cardWidth: number = 350;
    private cardHeight: number = 50;
    private getNewCard(top: number, left: number): TaskCard {
        return {
            _id: 'uniqueID',
            name: 'New task',
            tasks: [],
            top: top + 'px',
            left: left + 'px',
            zIndex: ++this.maxZIndex,
            opacity: 0.5,
            isNew: true,
            isDrag: true,
        };
    }

    @HostListener('document:mousemove', ['$event'])
    private onMouseMove(e: MouseEvent): void {
        if (
            this.draggable.currentCard &&
            this.draggable.currentCard.isDrag
        ) {
            this.draggable.currentCard.top =
                e.pageY - this.draggable.shiftY + 'px';
            this.draggable.currentCard.left =
                e.pageX - this.draggable.shiftX + 'px';
        }
    }

    /*@HostListener('document:selectstart')
    private onSelectStart(): boolean {
        return false;
    }

    @HostListener('document:mousedown')
    private onMouseDownDoc(): boolean {
        return false;
    }*/

    constructor(
        private draggable: DraggableService,
        private route: ActivatedRoute,
        private httpDesk: DeskHttpService
    ) {
        this.subscription = draggable.newTaskCreating$.subscribe(
            (e: MouseEvent) => {
                this.taskCards.push(
                    this.getNewCard(
                        e.pageY - this.cardHeight / 2,
                        e.pageX - this.cardWidth / 2
                    )
                );
                draggable.currentIndex = this.taskCards.length - 1;
                draggable.currentCard = this.taskCards[
                    draggable.currentIndex
                ];

                this.draggable.shiftX = this.cardWidth / 2;
                this.draggable.shiftY = this.cardHeight / 2;
            }
        );
    }

    public ngOnInit(): void {
        this.route.paramMap
            .pipe(
                map((paramMap: ParamMap) => paramMap.get('id')),
                switchMap((id: string) => this.httpDesk.getTasks(id))
            )
            .subscribe(
                (res: TaskDto): void => {
                    if (res) {
                        if (res.status === 200) {
                            this.taskCards = res.data;
                        }
                    }
                },
                (error: Error) => {
                    // TODO here will be popup message
                    // console.log(error);
                }
            );
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private onMouseDown(e: MouseEvent, index: number): boolean {
        this.draggable.currentCard = this.taskCards[index];
        this.draggable.currentCard.isDrag = true;
        this.draggable.currentCard.zIndex = ++this.maxZIndex;
        this.draggable.currentCard.opacity = 0.5;
        this.draggable.currentIndex = index;

        const target: any = (e.target as Element).parentNode.parentNode;

        this.draggable.setShift(
            e,
            this.draggable.getCoords(target)
        );

        return false;
    }

    public addLine(e: string, i: number): void {
        this.taskCards[i].tasks.push({ name: e, date: new Date() });
    }

    @HostListener('document:mouseup', ['$event'])
    private onMouseUp(e: MouseEvent): void {
        if (!this.draggable.currentCard) {
            return;
        } else if (
            this.draggable.isIntersect(
                e,
                this.draggable.deleteCoords
            ) &&
            this.draggable.currentCard.isDrag
        ) {
            this.draggable.currentCard.isDrag = false;
            this.draggable.currentCard = undefined;
            this.taskCards.splice(this.draggable.currentIndex, 1);
        } else if (
            this.draggable.isIntersect(
                e,
                this.draggable.addCoords
            ) &&
            this.draggable.currentCard.isDrag &&
            this.draggable.currentCard.isNew
        ) {
            this.draggable.currentCard.isDrag = false;
            this.draggable.currentCard = undefined;
            this.taskCards.splice(this.draggable.currentIndex, 1);
        } else {
            this.draggable.currentCard.opacity = 1;
            this.draggable.currentCard.isDrag = false;
            this.draggable.currentCard.isNew = false;
        }
    }
}
