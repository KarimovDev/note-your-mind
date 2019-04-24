import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ConnectedTaskCards } from '../../models/connected-task-cards.model';
import { MatDialog } from '@angular/material';
import { ConfigDialogComponent } from '../config-dialog/config-dialog.component';
import { DeskColors } from 'src/app/enums/desk-colors.enum';

@Component({
    selector: 'nym-line-draw',
    templateUrl: './line-draw.component.html',
    styleUrls: ['./line-draw.component.scss'],
})
export class LineDrawComponent {
    @Input() public connectedTaskCards: ConnectedTaskCards[];
    @Output() public deleteLine: EventEmitter<string> = new EventEmitter<
        string
    >();

    constructor(public dialog: MatDialog) {}

    public onLineClick(index: number): void {
        const dialogRef: any = this.dialog.open(ConfigDialogComponent, {
            width: '160px',
            data: {
                name: 'Line config',
                params: {
                    showColor: true,
                    showUndefColor: false,
                    showDelete: true,
                },
            },
        });

        dialogRef.afterClosed().subscribe(
            (result: string): void => {
                switch (result) {
                    case 'delete':
                        this.deleteLine.emit(
                            this.connectedTaskCards[index]._id
                        );
                        this.connectedTaskCards.splice(index, 1);
                        break;
                    case 'red':
                        this.connectedTaskCards[index].color = DeskColors.Red;
                        break;
                    case 'green':
                        this.connectedTaskCards[index].color = DeskColors.Green;
                        break;
                    case 'blue':
                        this.connectedTaskCards[index].color = DeskColors.Blue;
                        break;
                }
            }
        );
    }
}
