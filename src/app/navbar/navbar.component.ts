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
        this.dragNDropService.deleteCoords = this.dragNDropService.getCoords(
            document.querySelector('#delete')
        );
    }
}
