import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { DeskHttpService } from '../../services/desk-http.service';
import { Subscription } from 'rxjs';
import { MongoDto } from '../../models/mongo-dto.model';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'tfs-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    public form: FormGroup;
    private errorMessage: string = '';
    private subscription: Subscription[] = [];

    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private router: Router,
        private httpDesk: DeskHttpService,
        private snackBar: MatSnackBar
    ) {}

    public ngOnInit(): void {
        this.form = this.formBuilder.group({
            email: ['test@test.test', [Validators.required, Validators.email]],
            password: [
                'test123',
                [Validators.required, Validators.minLength(6)],
            ],
        });

        this.subscription.push(
            this.authService.newUser$.subscribe((user: User) => {
                if (!!user) {
                    this.form.reset();
                    this.router.navigate(['desks']);
                }
            })
        );
    }

    public ngOnDestroy(): void {
        this.subscription.forEach((el: Subscription) => el.unsubscribe());
    }

    public get email(): AbstractControl {
        return this.form.get('email');
    }

    public get password(): AbstractControl {
        return this.form.get('password');
    }

    private showPopup(message: string): void {
        this.snackBar.open(message, 'OK', {
            duration: 3000,
        });
    }

    public signUp(): void {
        const email: string = this.form.value.email;
        const pass: string = this.form.value.password;

        this.subscription.push(
            this.httpDesk.addUser(email, pass).subscribe(
                (res: MongoDto) => {
                    if (res.status === 200) {
                        this.authService.sendLogining(res.data[0] as User);
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

    public submit(): void {
        if (this.form.invalid) {
            return;
        }

        this.errorMessage = '';

        const email: string = this.form.value.email;
        const pass: string = this.form.value.password;

        this.subscription.push(
            this.httpDesk.getUser(email, pass).subscribe(
                (res: MongoDto): void => {
                    if (res.status === 200) {
                        this.authService.sendLogining(res.data[0] as User);
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
}
