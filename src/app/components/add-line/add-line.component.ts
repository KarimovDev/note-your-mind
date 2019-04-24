import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ValidationErrors,
} from '@angular/forms';
import { AddLineEmit } from 'src/app/models/add-line-emit.model';

@Component({
    selector: 'nym-add-line',
    templateUrl: './add-line.component.html',
    styleUrls: ['./add-line.component.scss'],
})
export class AddLineComponent implements OnInit {
    @Input() public isWithDate: boolean;

    public submited: boolean = false;

    @Output() private addLine: EventEmitter<AddLineEmit> = new EventEmitter<
        AddLineEmit
    >();

    public form: FormGroup;

    constructor(private formBuilder: FormBuilder) {}

    public getErrors(value: string): ValidationErrors | any {
        return this.form.get(value).errors;
    }

    public ngOnInit(): void {
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            date: [''],
        });
    }

    public onSubmit(): void {
        if (this.form.invalid) {
            this.submited = true;

            return;
        } else {
            this.submited = false;
        }

        const dateString: string = this.form.value.date;
        const date: Date = dateString ? new Date(dateString) : new Date();

        this.addLine.emit({ name: this.form.value.title, date: date });

        this.form.reset();
    }
}
