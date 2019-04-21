import { NgModule } from '@angular/core';
import {
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    MatListModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule,
} from '@angular/material';
import { ConfigDialogComponent } from '../components/config-dialog/config-dialog.component';

@NgModule({
    exports: [
        MatSidenavModule,
        MatToolbarModule,
        MatDividerModule,
        MatListModule,
        MatCardModule,
        MatSnackBarModule,
        MatDialogModule
    ],
    entryComponents: [ConfigDialogComponent],
})
export class UiKitModule {}
