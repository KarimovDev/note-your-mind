import { Component, OnInit } from '@angular/core';
import { Desk } from 'src/app/models/desk.model';
import { DeskDataService } from 'src/app/services/desk-data.service';

@Component({
    selector: 'nym-desk-list',
    templateUrl: './desk-list.component.html',
    styleUrls: ['./desk-list.component.scss'],
})
export class DeskListComponent implements OnInit {
    public desks: Desk[] = [];

    constructor(private deskDataService: DeskDataService) {}

    public ngOnInit(): void {
        this.desks = this.deskDataService.getDesks();
    }
}
