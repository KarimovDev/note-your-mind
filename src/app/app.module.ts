import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { DeskComponent } from './components/desk/desk.component';
import { TaskComponent } from './components/desk/task/task.component';
import localeRu from '@angular/common/locales/ru';
import { DeskDataService } from './services/desk-data.service';
import { registerLocaleData } from '@angular/common';
import { DragNDropService } from './services/drag-n-drop.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DeskListComponent } from './components/desk-list/desk-list.component';

registerLocaleData(localeRu, 'ru');
@NgModule({
    declarations: [
        AppComponent,
        DeskComponent,
        TaskComponent,
        NavbarComponent,
        NotFoundComponent,
        DeskListComponent,
    ],
    imports: [BrowserModule, AppRoutingModule],
    providers: [
        DeskDataService,
        DragNDropService,
        {
            provide: LOCALE_ID,
            useValue: 'ru',
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
