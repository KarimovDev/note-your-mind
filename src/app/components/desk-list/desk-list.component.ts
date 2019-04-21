import { Component, OnInit } from '@angular/core';
import { Desk } from '../../models/desk.model';
import { DeskHttpService } from '../../services/desk-http.service';
import { MongoDto } from '../../models/mongo-dto.model';
import { AppStateService } from '../../services/app-state.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';

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
        private authService: AuthService,
        private snackBar: MatSnackBar
    ) {}

    private showPopup(message: string): void {
        this.snackBar.open(message, 'OK', {
            duration: 3000,
        });
    }

    public ngOnInit(): void {
        this.subscription.push(
            this.authService.newUser$.subscribe((user: User) => {
                this.currentUser = user;

                if (!this.currentUser) {
                    return;
                }

                this.subscription.push(
                    this.httpDesk.getDesksList(this.currentUser._id).subscribe(
                        (res: MongoDto): void => {
                            if (res && res.status === 200) {
                                this.appState.desks = res.data as Desk[];
                                this.desks = res.data as Desk[];
                            }
                        },
                        (error: Error) => {
                            this.showPopup(error.message);
                        }
                    )
                );
            })
        );
    }

    public ngOnDestroy(): void {
        this.subscription.forEach((el: Subscription) => el.unsubscribe());
        this.subscription = [];
    }

    public addLine(name: string): void {
        this.subscription.push(
            this.httpDesk.addDesk(this.currentUser._id, name).subscribe(
                (res: MongoDto) => {
                    if (res.status === 200) {
                        this.desks = [...this.desks, ...(res.data as Desk[])];
                        this.appState.desks = this.desks;
                    } else {
                        this.showPopup(res.message);
                    }
                },
                (error: Error) => {
                    this.showPopup(error.message);
                }
            )
        );
    }

    public onDeleteClick(index: number): void {
        const id: string = this.desks[index]._id;

        this.subscription.push(
            this.httpDesk.deleteDesk(id).subscribe(
                (res: MongoDto) => {
                    if (res.status === 200) {
                        this.showPopup('Desk was deleted');
                        this.desks.splice(index, 1);
                        this.appState.desks = this.desks;
                    } else {
                        this.showPopup(res.message);
                    }
                },
                (error: Error) => {
                    this.showPopup(error.message);
                }
            )
        );
    }

    public logout(): void {
        this.authService.logout();
    }
}
