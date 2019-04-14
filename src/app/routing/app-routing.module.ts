import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { DeskComponent } from '../components/desk/desk.component';
import { DeskListComponent } from '../components/desk-list/desk-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: ':id',
                component: DeskComponent,
            },
            {
                path: '',
                component: DeskListComponent,
            },
        ],
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
