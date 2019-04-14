import { Component, OnInit } from '@angular/core';
import { DragNDropService } from '../services/drag-n-drop.service';

@Component({
    selector: 'nym-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    constructor(private dragNDropService: DragNDropService) {}

    public ngOnInit(): void {
        this.dragNDropService.setDeleteCoords(document.querySelector('#delete'));
        this.dragNDropService.setAddCoords(document.querySelector('#add'));
    }

    private onAddTask(e: MouseEvent): void {
        this.dragNDropService.sendNewTaskCreating(e);
    }
}
