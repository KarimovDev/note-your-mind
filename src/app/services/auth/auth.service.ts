import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private user: BehaviorSubject<User> = new BehaviorSubject<User>(null);

    constructor(private router: Router) {}

    public logout(): void {
        const userEmpty: User = undefined;

        this.user.next(userEmpty);
        this.router.navigate(['login']);
    }

    public newUser$: Observable<User> = this.user.asObservable();
    public sendLogining(user: User): void {
        this.user.next(user);
    }
}
