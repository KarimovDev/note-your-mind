import { Component, OnInit } from '@angular/core';
import { Desk } from 'src/app/models/desk.model';
import { DeskHttpService } from 'src/app/services/desk-http.service';
import { MongoDto } from 'src/app/models/mongo-dto.model';
import { AppStateService } from 'src/app/services/app-state.service';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { take, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
    selector: 'nym-desk-list',
    templateUrl: './desk-list.component.html',
    styleUrls: ['./desk-list.component.scss'],
})
export class DeskListComponent implements OnInit {
    public desks: Desk[] = [];
    public currentUser: User;
    private subscription: Subscription[] = [];

    constructor(
        private httpDesk: DeskHttpService,
        private appState: AppStateService,
        private authService: AuthService
    ) {}

    public ngOnInit(): void {
        this.subscription.push(
            this.authService.newUser$.subscribe((user: User) => {
                this.currentUser = user;

                this.subscription.push(
                    this.httpDesk.getDesksList(this.currentUser._id).subscribe(
                        (res: MongoDto): void => {
                            if (res && res.status === 200) {
                                this.appState.desks = res.data as Desk[];
                                this.desks = res.data as Desk[];
                            }
                        },
                        (error: Error) => {
                            // TODO here will be popup message
                        }
                    )
                );
            })
        );
    }

    public ngOnDestroy(): void {
        this.subscription.forEach((el: Subscription) => el.unsubscribe());
    }

    public addLine(name: string): void {
        this.subscription.push(
            this.httpDesk.addDesk(this.currentUser._id, name).subscribe(
                (res: MongoDto) => {
                    if (res && res.result.ok) {
                        this.desks = [...this.desks, ...(res.data as Desk[])];
                        this.appState.desks = this.desks;
                    } else {
                        // TODO here will be popup message
                    }
                },
                (error: Error) => {
                    // TODO here will be popup message
                }
            )
        );
    }

    public onDeleteClick(index: number): void {
        const id: string = this.desks[index]._id;

        this.subscription.push(
            this.httpDesk.deleteDesk(id).subscribe(
                (res: MongoDto) => {
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
            )
        );
    }
}
