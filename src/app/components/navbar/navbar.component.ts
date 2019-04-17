import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DraggableService } from 'src/app/services/draggable.service';

@Component({
    selector: 'nym-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    constructor(
        private draggable: DraggableService,
        private router: Router
    ) {}

    public ngOnInit(): void {
        this.draggable.setDeleteCoords(
            document.querySelector('#delete')
        );
        this.draggable.setAddCoords(document.querySelector('#add'));
    }

    private onAddTask(e: MouseEvent): void {
        this.draggable.sendNewTaskCreating(e);
    }

    private openDesksList(): void {
        this.router.navigate(['']);
    }
}
