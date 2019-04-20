import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { DeskHttpService } from 'src/app/services/desk-http.service';
import { Subscription } from 'rxjs';
import { MongoDto } from 'src/app/models/mongo-dto.model';

const USER_NOT_FOUND_ERROR: string = 'auth/user-not-found';
const DEFAULT: string = 'DEFAULT';
const ERROR_MESSAGE: any = {
    [DEFAULT]: 'Неизвестная ошибка. Попробуйте позже',
    [USER_NOT_FOUND_ERROR]: 'Неверные имя пользователя и пароль',
};

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
        private httpDesk: DeskHttpService
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

    public signUp(): void {
        const email: string = this.form.value.email;
        const pass: string = this.form.value.password;

        this.subscription.push(
            this.httpDesk.addUser(email, pass).subscribe(
                (res: MongoDto) => {
                    if (res && res.result.ok) {
                        this.authService.sendLogining(res.data[0] as User);
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
                    if (res && res.status === 200) {
                        this.authService.sendLogining(res.data[0] as User);
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
