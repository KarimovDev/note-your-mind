import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';
import { User } from '../../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    public canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        return this.authService.newUser$.pipe(
            take(1),
            map((user: User) => {
                if (!!user) {
                    return true;
                }

                this.router.navigate(['login']);

                return false;
            })
        );
    }
}
