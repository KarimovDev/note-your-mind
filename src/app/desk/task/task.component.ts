import { Component, OnInit, Input } from '@angular/core';
import { ITask } from 'src/app/model/itask';

@Component({
    selector: 'nym-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
    @Input() public tasks: ITask[];

    constructor() {}

    public ngOnInit(): void {}
}
