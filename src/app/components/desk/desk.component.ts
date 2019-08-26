import { Component, OnInit, HostListener } from '@angular/core';
import { TaskCard } from '../../models/task-card.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DeskHttpService } from '../../services/desk-http.service';
import { DraggableService } from '../../services/draggable.service';
import { AppStateService } from '../../services/app-state.service';
import { MongoDto } from '../../models/mongo-dto.model';
import { Desk } from '../../models/desk.model';
import { MatSnackBar, MatDialog } from '@angular/material';
import { UUID } from 'angular2-uuid';
import { LineDrawingService } from 'src/app/services/line-drawing.service';
import { Coords } from 'src/app/models/coords.model';
import { ConnectedTaskCards } from 'src/app/models/connected-task-cards.model';
import { InputParamsSaveTasks } from 'src/app/models/input-params-save-tasks.model';
import { AddLineEmit } from 'src/app/models/add-line-emit.model';
import { ConfigDialogComponent } from '../config-dialog/config-dialog.component';
import { DeskColors } from 'src/app/enums/desk-colors.enum';

@Component({
    selector: 'nym-desk',
    templateUrl: './desk.component.html',
    styleUrls: ['./desk.component.scss'],
})
export class DeskComponent implements OnInit {
    public taskCards: TaskCard[] = [];
    private deletedConnIds: string[] = [];
    private deletedCardsIds: string[] = [];
    private maxZIndex: number = 0;
    private subscription: Subscription[] = [];
    public cardWidth: number = 350;
    private cardHeight: number = 50;
    private pressedTaskCard: number;
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
            isNew: true,
            isButtonPressed: false,
            isAddBlockOpen: false,
        };
    }

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
        private lineDraw: LineDrawingService,
        public dialog: MatDialog
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
                const inputParams: InputParamsSaveTasks = {
                    taskCards: this.taskCards,
                    deletedCardsIds: this.deletedCardsIds,
                    connectedTaskCards: this.connectedTaskCards,
                    deletedConnIds: this.deletedConnIds,
                };

                this.httpDesk.saveTasks(inputParams).subscribe(
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
                            const result: {
                                taskCards: TaskCard[];
                                connectedTaskCards: ConnectedTaskCards[];
                            } = res.data as {
                                taskCards: TaskCard[];
                                connectedTaskCards: ConnectedTaskCards[];
                            };

                            this.taskCards = result.taskCards;
                            this.connectedTaskCards = result.connectedTaskCards;
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

    private startDragging(index: number): void {
        this.draggable.currentCard = this.taskCards[index];
        this.draggable.currentCard.zIndex = ++this.maxZIndex;
        this.draggable.currentIndex = index;
    }

    public addLine(emitted: AddLineEmit, i: number): void {
        this.taskCards[i].tasks.push(emitted);
    }

    public toggleAddBlock(index: number): void {
        this.taskCards[index].isAddBlockOpen = !this.taskCards[index]
            .isAddBlockOpen;
        this.taskCards[index].zIndex = ++this.maxZIndex;
    }

    @HostListener('document:mousemove', ['$event'])
    private onMouseMove(e: MouseEvent): void {
        if (this.draggable.currentCard) {
            this.draggable.currentCard.top =
                e.pageY - this.draggable.shiftY + 'px';
            this.draggable.currentCard.left =
                e.pageX - this.draggable.shiftX + 'px';

            this.updateLineCoords(e, this.draggable.currentCard._id);
        }
    }

    private onMouseDown(e: MouseEvent, index: number): boolean {
        if (this.pressedTaskCard !== undefined) {
            this.taskCards[this.pressedTaskCard].isButtonPressed = false;
            this.pressedTaskCard = undefined;
        }

        const target: any = (e.target as Element).parentNode.parentNode;

        this.draggable.setShift(e, this.draggable.getCoords(target));
        this.lineDraw.setLineShift(e, target.parentNode.parentNode);

        this.startDragging(index);

        return false;
    }

    @HostListener('document:mouseup', ['$event'])
    private onMouseUp(e: MouseEvent): void {
        this.draggable.setDeleteCoords();
        this.draggable.setAddCoords();

        const dragCard: TaskCard = this.draggable.currentCard;
        const isOnDelete: boolean = this.draggable.isIntersect(
            e,
            this.draggable.deleteCoords
        );
        const isOnAdd: boolean = this.draggable.isIntersect(
            e,
            this.draggable.addCoords
        );

        if (!dragCard) {
            return;
        } else if (isOnDelete) {
            this.deleteTaskCard();
        } else if (isOnAdd && dragCard.isNew) {
            this.deleteTaskCard();
        } else {
            this.stopDragging();
        }
    }

    private stopDragging(): void {
        this.draggable.currentCard.isNew = false;
        this.draggable.currentCard = undefined;
    }

    private deleteTaskCard(): void {
        this.deleteLines(this.draggable.currentCard._id);
        this.deletedCardsIds.push(this.draggable.currentCard._id);
        this.draggable.currentCard = undefined;
        this.taskCards.splice(this.draggable.currentIndex, 1);
    }

    private addLineToDraw(el1: number, el2: number): void {
        const selector1: string = this.taskCards[el1]._id;
        const selector2: string = this.taskCards[el2]._id;

        const isBlocksAlreadyConnected: boolean = this.isBlocksAlreadyConnected(
            selector1,
            selector2
        );

        if (!isBlocksAlreadyConnected) {
            const coords1: Coords = this.lineDraw.getCenterCoords(
                document.querySelector(`#id${selector1}`)
            );
            const coords2: Coords = this.lineDraw.getCenterCoords(
                document.querySelector(`#id${selector2}`)
            );

            this.connectedTaskCards.push({
                _id: UUID.UUID(),
                color: DeskColors.Blue,
                _deskId: this.appState.currentDesk._id,
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
        let result: boolean = false;

        this.connectedTaskCards.forEach((el: ConnectedTaskCards) => {
            if (el.el1 === el1 && el.el2 === el2) {
                result = true;
            } else if (el.el1 === el2 && el.el2 === el1) {
                result = true;
            }
        });

        return result;
    }

    private deleteLines(id: string): void {
        const result: ConnectedTaskCards[] = this.connectedTaskCards.filter(
            (el: ConnectedTaskCards) => {
                if (el.el1 === id || el.el2 === id) {
                    this.onDeleteLine(el._id);
                } else {
                    return true;
                }
            }
        );

        this.connectedTaskCards = result;
    }

    private updateLineCoords(e: MouseEvent, id: string): any {
        this.connectedTaskCards.forEach((el: ConnectedTaskCards) => {
            if (el.el1 === id) {
                el.coords1 = {
                    top: e.pageY - this.lineDraw.lineShiftY,
                    left: e.pageX - this.lineDraw.lineShiftX,
                };
            } else if (el.el2 === id) {
                el.coords2 = {
                    top: e.pageY - this.lineDraw.lineShiftY,
                    left: e.pageX - this.lineDraw.lineShiftX,
                };
            }
        });
    }

    public onDeleteLine(id: string): void {
        this.deletedConnIds.push(id);
    }

    public onConnectClick(index: number): void {
        if (
            this.pressedTaskCard !== undefined &&
            this.pressedTaskCard !== index
        ) {
            this.taskCards[this.pressedTaskCard].isButtonPressed = false;
            this.addLineToDraw(this.pressedTaskCard, index);
            this.pressedTaskCard = undefined;
        } else {
            this.taskCards[index].isButtonPressed = !this.taskCards[index]
                .isButtonPressed;
            this.pressedTaskCard = this.taskCards[index].isButtonPressed
                ? index
                : undefined;
        }
    }

    public onBlockParamClick(index: number): void {
        const dialogRef: any = this.dialog.open(ConfigDialogComponent, {
            width: '200px',
            data: {
                name: 'Task config',
                params: {
                    showColor: true,
                    showUndefColor: true,
                    showDelete: false,
                },
            },
        });

        dialogRef.afterClosed().subscribe(
            (result: string): void => {
                switch (result) {
                    case 'red':
                        this.taskCards[index].color = DeskColors.Red;
                        break;
                    case 'green':
                        this.taskCards[index].color = DeskColors.Green;
                        break;
                    case 'blue':
                        this.taskCards[index].color = DeskColors.Blue;
                        break;
                    case 'undefined':
                        this.taskCards[index].color = undefined;
                        break;
                }
            }
        );
    }
}
