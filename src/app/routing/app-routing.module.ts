import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { DeskComponent } from '../components/desk/desk.component';
import { DeskListComponent } from '../components/desk-list/desk-list.component';
import { LoginComponent } from '../components/login/login.component';
import { AuthGuard } from '../services/auth/auth.guard';
import { IntroComponent } from '../components/intro/intro.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'desks',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'desks/:id',
                component: DeskComponent,
            },
            {
                path: '',
                component: DeskListComponent,
            },
        ],
    },
    {
        path: '',
        component: IntroComponent,
    },
    {
        path: '**',
        component: NotFoundComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
