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
        private draggable: DraggableService,
        private router: Router,
        private appState: AppStateService,
        private authService: AuthService
    ) {}

    public ngOnInit(): void {
        this.draggable.setDeleteCoords(document.querySelector('#delete'));
        this.draggable.setAddCoords(document.querySelector('#add'));
    }

    private onAddTask(e: MouseEvent): void {
        this.draggable.sendNewTaskCreating(e);
    }

    private openDesksList(): void {
        this.router.navigate(['/desks']);
    }

    private logout(): void {
        this.authService.logout();
    }

    private onSaveClick(): void {
        this.appState.sendSaving();
    }
}
