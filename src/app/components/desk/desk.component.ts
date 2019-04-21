import { Component, OnInit, HostListener } from '@angular/core';
import { TaskCard } from '../../models/task-card.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DeskHttpService } from '../../services/desk-http.service';
import { DraggableService } from '../../services/draggable.service';
import { AppStateService } from '../../services/app-state.service';
import { MongoDto } from '../../models/mongo-dto.model';
import { Desk } from '../../models/desk.model';
import { MatSnackBar } from '@angular/material';
import { UUID } from 'angular2-uuid';
import { LineDrawingService } from 'src/app/services/line-drawing.service';
import { Coords } from 'src/app/models/coords.model';
import { ConnectedTaskCards } from 'src/app/models/connected-task-cards';

@Component({
    selector: 'nym-desk',
    templateUrl: './desk.component.html',
    styleUrls: ['./desk.component.scss'],
})
export class DeskComponent implements OnInit {
    public taskCards: TaskCard[] = [];
    private deletedCardsIds: string[] = [];
    private maxZIndex: number = 0;
    private subscription: Subscription[] = [];
    public cardWidth: number = 350;
    private cardHeight: number = 50;
    private pressedTaskCards: number;
    public connectedTaskCards: ConnectedTaskCards[] = [];
    private getNewCard(top: number, left: number): TaskCard {
        return {
            _id: UUID.UUID(),
            _deskId: this.appState.currentDesk._id,
            name: 'New task',
            tasks: [],
            top: top + 'px',
            left: left + 'px',
            zIndex: ++this.maxZIndex,
            opacity: 0.5,
            isNew: true,
            isDrag: true,
            isButtonPressed: false,
        };
    }

    @HostListener('document:mousemove', ['$event'])
    private onMouseMove(e: MouseEvent): void {
        if (this.draggable.currentCard && this.draggable.currentCard.isDrag) {
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

    private showPopup(message: string): void {
        this.snackBar.open(message, 'OK', {
            duration: 3000,
        });
    }

    constructor(
        private draggable: DraggableService,
        private route: ActivatedRoute,
        private httpDesk: DeskHttpService,
        private router: Router,
        private appState: AppStateService,
        private snackBar: MatSnackBar,
        private lineDraw: LineDrawingService
    ) {
        this.subscription.push(
            draggable.newTaskCreating$.subscribe((e: MouseEvent) => {
                this.taskCards.push(
                    this.getNewCard(
                        e.pageY - this.cardHeight / 2,
                        e.pageX - this.cardWidth / 2
                    )
                );
                draggable.currentIndex = this.taskCards.length - 1;
                draggable.currentCard = this.taskCards[draggable.currentIndex];

                this.draggable.shiftX = this.cardWidth / 2;
                this.draggable.shiftY = this.cardHeight / 2;
            })
        );
        this.subscription.push(
            appState.newSaving$.subscribe(() => {
                this.httpDesk
                    .saveTasks(this.taskCards, this.deletedCardsIds)
                    .subscribe(
                        (res: MongoDto) => {
                            if (res.status === 200) {
                                this.showPopup('Saved');
                            } else {
                                this.showPopup(res.message);
                            }
                        },
                        (error: Error) => {
                            this.showPopup(error.message);
                        }
                    );
            })
        );
    }

    public ngOnInit(): void {
        const id: string = this.route.snapshot.paramMap.get('id');

        this.appState.currentDesk = undefined;

        this.appState.desks.forEach((el: Desk) => {
            if (el._id === id) {
                this.appState.currentDesk = el;
            }
        });

        if (this.appState.currentDesk) {
            this.httpDesk.getTasks(id).subscribe(
                (res: MongoDto): void => {
                    if (res) {
                        if (res.status === 200) {
                            this.taskCards = res.data as TaskCard[];
                        }
                    }
                },
                (error: Error) => {
                    this.showPopup(error.message);
                }
            );
        } else {
            this.router.navigate(['']);
        }
    }

    public ngOnDestroy(): void {
        this.subscription.forEach((el: Subscription) => el.unsubscribe());
        this.subscription = [];
    }

    private onMouseDown(e: MouseEvent, index: number): boolean {
        this.draggable.currentCard = this.taskCards[index];
        this.draggable.currentCard.isDrag = true;
        this.draggable.currentCard.zIndex = ++this.maxZIndex;
        this.draggable.currentCard.opacity = 0.5;
        this.draggable.currentIndex = index;

        if (this.pressedTaskCards !== undefined) {
            this.taskCards[this.pressedTaskCards].isButtonPressed = false;
            this.pressedTaskCards = undefined;
        }

        const target: any = (e.target as Element).parentNode.parentNode;

        this.draggable.setShift(e, this.draggable.getCoords(target));

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
            this.draggable.isIntersect(e, this.draggable.deleteCoords) &&
            this.draggable.currentCard.isDrag
        ) {
            this.deletedCardsIds.push(this.draggable.currentCard._id);
            this.draggable.currentCard.isDrag = false;
            this.draggable.currentCard = undefined;
            this.taskCards.splice(this.draggable.currentIndex, 1);
        } else if (
            this.draggable.isIntersect(e, this.draggable.addCoords) &&
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

        this.changeLineCoords();
    }

    private addLineToDraw(el1: number, el2: number): void {
        const selector1: string = this.taskCards[el1]._id;
        const selector2: string = this.taskCards[el2]._id;

        const isBlocksAlreadyConnected: boolean = this.isBlocksAlreadyConnected(selector1, selector2);

        if (!isBlocksAlreadyConnected) {
            const coords1: Coords = this.lineDraw.getCenterCoords(
                document.querySelector(`#id${selector1}`)
            );
            const coords2: Coords = this.lineDraw.getCenterCoords(
                document.querySelector(`#id${selector2}`)
            );

            this.connectedTaskCards.push({
                el1: selector1,
                coords1: coords1,
                el2: selector2,
                coords2: coords2,
            });
        } else {
            this.showPopup('Those blocks have already connected');
        }
    }

    private isBlocksAlreadyConnected(el1: string, el2: string): boolean {
        return false;
    }

    private changeLineCoords(): void {}

    public onConnectClick(index: number): void {
        if (this.pressedTaskCards !== undefined) {
            this.taskCards[this.pressedTaskCards].isButtonPressed = false;
            this.addLineToDraw(this.pressedTaskCards, index);
            this.pressedTaskCards = undefined;
        } else {
            this.taskCards[index].isButtonPressed = true;
            this.pressedTaskCards = index;
        }
    }
}
