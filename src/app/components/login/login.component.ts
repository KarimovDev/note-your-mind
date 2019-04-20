import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

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

    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private router: Router
    ) {}

    public get email(): AbstractControl {
        return this.form.get('email');
    }

    public get password(): AbstractControl {
        return this.form.get('password');
    }

    public ngOnInit(): void {
        this.form = this.formBuilder.group({
            email: ['test@test.test', [Validators.required, Validators.email]],
            password: [
                'test123',
                [Validators.required, Validators.minLength(6)],
            ],
        });
    }

    public signUp(): void {}

    public submit(): void {
        if (this.form.invalid) {
            return;
        }

        this.errorMessage = '';

        this.authService.newUser$.subscribe(
            () => {
                this.form.reset();
                this.router.navigate(['desks']);
            },
            (error: Error) => {
                // TODO here will be popup message
                const code: string = error.message;

                this.errorMessage =
                    ERROR_MESSAGE[code] || ERROR_MESSAGE.DEFAULT;
            }
        );

        this.authService.sendLogining();
    }
}
