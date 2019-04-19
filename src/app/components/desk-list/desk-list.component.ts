import { Component, OnInit } from '@angular/core';
import { Desk } from 'src/app/models/desk.model';
import { DeskHttpService } from 'src/app/services/desk-http.service';
import { DeskDto } from 'src/app/models/desk-dto.model';
import { MongoResponse } from 'src/app/models/mongo-response.model';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
    selector: 'nym-desk-list',
    templateUrl: './desk-list.component.html',
    styleUrls: ['./desk-list.component.scss'],
})
export class DeskListComponent implements OnInit {
    public desks: Desk[] = [];

    constructor(
        private httpDesk: DeskHttpService,
        private appState: AppStateService
    ) {}

    public ngOnInit(): void {
        this.httpDesk.getDesksList().subscribe(
            (res: DeskDto): void => {
                if (res && res.status === 200) {
                    this.appState.desks = res.data;
                    this.desks = res.data;
                }
            },
            (error: Error) => {
                // TODO here will be popup message
            }
        );
    }

    public addLine(name: string): void {
        this.httpDesk.addDesk(name).subscribe(
            (res: MongoResponse) => {
                if (res && res.result.ok) {
                    this.desks = [...this.desks, ...res.ops];
                    this.appState.desks = this.desks;
                } else {
                    // TODO here will be popup message
                }
            },
            (error: Error) => {
                // TODO here will be popup message
            }
        );
    }

    public onDeleteClick(index: number): void {
        const id: string = this.desks[index]._id;

        this.httpDesk.deleteDesk(id).subscribe(
            (res: MongoResponse) => {
                if (res) {
                    // TODO here will be popup message
                    this.desks.splice(index, 1);
                    this.appState.desks = this.desks;
                } else {
                    // TODO here will be popup message
                }
            },
            (error: Error) => {
                // TODO here will be popup message
            }
        );
    }
}
