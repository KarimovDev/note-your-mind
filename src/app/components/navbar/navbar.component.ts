import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DraggableService } from '../../services/draggable.service';
import { AppStateService } from '../../services/app-state.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
    selector: 'nym-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    constructor(
        public draggable: DraggableService,
        private router: Router,
        private appState: AppStateService,
        private authService: AuthService
    ) {}

    public ngOnInit(): void {
        this.draggable.deleteElement = document.querySelector('#delete');
        this.draggable.addElement = document.querySelector('#add');
    }

    public onAddTask(e: MouseEvent): void {
        this.draggable.sendNewTaskCreating(e);
    }

    public openDesksList(): void {
        this.router.navigate(['/desks']);
    }

    public logout(): void {
        this.authService.logout();
    }

    public onSaveClick(): void {
        this.appState.sendSaving();
    }
}
