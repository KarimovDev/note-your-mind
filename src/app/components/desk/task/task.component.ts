import { Component, OnInit, Input } from '@angular/core';
import { Task } from 'src/app/models/task.model';

@Component({
    selector: 'nym-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
    @Input() public tasks: Task[];

    constructor() {}

    public ngOnInit(): void {}
}
