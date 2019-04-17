import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AddLineComponent } from './add-line.component';

@NgModule({
    declarations: [AddLineComponent],
    exports: [AddLineComponent],
    imports: [CommonModule, ReactiveFormsModule],
})
export class AddLineModule {}
