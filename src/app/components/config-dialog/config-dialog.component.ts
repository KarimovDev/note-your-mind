import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
    name: string;
}

@Component({
    selector: 'nym-config-dialog',
    templateUrl: './config-dialog.component.html',
    styleUrls: ['./config-dialog.component.scss'],
})
export class ConfigDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfigDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    public onNoClick(): void {
        this.dialogRef.close();
    }
}
