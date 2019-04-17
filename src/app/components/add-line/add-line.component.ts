import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ValidationErrors,
} from '@angular/forms';

@Component({
    selector: 'nym-add-line',
    templateUrl: './add-line.component.html',
    styleUrls: ['./add-line.component.scss'],
})
export class AddLineComponent implements OnInit {
    @Output() private addLine: EventEmitter<string> = new EventEmitter<
        string
    >();

    public form: FormGroup;

    constructor(private formBuilder: FormBuilder) {}

    public getErrors(value: string): ValidationErrors | any {
        return this.form.get(value).errors;
    }

    public ngOnInit(): void {
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
        });
    }

    public onSubmit(): void {
        this.addLine.emit(this.form.value.title);

        this.form.reset();
    }
}
