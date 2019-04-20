import { NgModule } from '@angular/core';
import {
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    MatListModule,
    MatCardModule,
    MatSnackBarModule,
} from '@angular/material';

@NgModule({
    exports: [
        MatSidenavModule,
        MatToolbarModule,
        MatDividerModule,
        MatListModule,
        MatCardModule,
        MatSnackBarModule,
    ],
})
export class UiKitModule {}
