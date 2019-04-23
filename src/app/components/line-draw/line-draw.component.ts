import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ConnectedTaskCards } from 'src/app/models/connected-task-cards';
import { MatDialog } from '@angular/material';
import { ConfigDialogComponent } from '../config-dialog/config-dialog.component';

@Component({
    selector: 'nym-line-draw',
    templateUrl: './line-draw.component.html',
    styleUrls: ['./line-draw.component.scss'],
})
export class LineDrawComponent {
    @Input() public connectedTaskCards: ConnectedTaskCards[];
    @Input() public isDragginNow: boolean;
    @Output() public deleteLine: EventEmitter<string> = new EventEmitter<
        string
    >();

    constructor(public dialog: MatDialog) {}

    public onLineClick(index: number): void {
        const dialogRef: any = this.dialog.open(ConfigDialogComponent, {
            width: '160px',
            data: { name: 'Line config' },
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
                        this.connectedTaskCards[index].color = result;
                        break;
                    case 'green':
                        this.connectedTaskCards[index].color = result;
                        break;
                    case 'blue':
                        this.connectedTaskCards[index].color = result;
                        break;
                }
            }
        );
    }
}
