import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../../../models/task.model';

@Component({
    selector: 'nym-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
    @Input() public tasks: Task[];

    public onDeleteClick(index: number): void {
        this.tasks.splice(index, 1);
    }
}
