import { Component, OnInit } from '@angular/core';
import { Desk } from 'src/app/models/desk.model';
import { DeskHttpService } from 'src/app/services/desk-http.service';
import { DeskDto } from 'src/app/models/deskDto.model';
import { MongoResponse } from 'src/app/models/mongo-response.model';

@Component({
    selector: 'nym-desk-list',
    templateUrl: './desk-list.component.html',
    styleUrls: ['./desk-list.component.scss'],
})
export class DeskListComponent implements OnInit {
    public desks: Desk[] = [];

    constructor(private deskHttp: DeskHttpService) {}

    public ngOnInit(): void {
        this.deskHttp.getDesksList().subscribe(
            (res: DeskDto): void => {
                if (res && res.status === 200) {
                    this.desks = res.data;
                }
            },
            (error: Error) => {
                // TODO here will be popup message
                // console.log(error);
            }
        );
    }

    public addLine(e: string): void {
        this.deskHttp.addDesk(e).subscribe(
            (res: MongoResponse) => {
                if (res && res.result.ok) {
                    this.desks = [...this.desks, ...res.ops];
                } else {
                    // TODO here will be popup message
                    // console.log(res);
                }
            },
            (error: Error) => {
                // TODO here will be popup message
                // console.log(error);
            }
        );
    }
}
