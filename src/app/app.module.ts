import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { DeskComponent } from './components/desk/desk.component';
import { TaskComponent } from './components/desk/task/task.component';
import localeRu from '@angular/common/locales/ru';
import { registerLocaleData } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DeskListComponent } from './components/desk-list/desk-list.component';
import { DeskHttpService } from './services/desk-http.service';
import { HttpClientModule } from '@angular/common/http';
import { AddLineModule } from './components/add-line/add-line.module';
import { DraggableService } from './services/draggable.service';
import { AppStateService } from './services/app-state.service';
import { DeleteButtonComponent } from './components/delete-button/delete-button.component';
import { LoginModule } from './components/login/login.module';
import { IntroComponent } from './components/intro/intro.component';
import { UiKitModule } from './shared/ui-kit.module';
import { LineDrawingService } from './services/line-drawing.service';
import { LineDrawComponent } from './components/line-draw/line-draw.component';
import { ConfigDialogComponent } from './components/config-dialog/config-dialog.component';

registerLocaleData(localeRu, 'ru');
@NgModule({
    declarations: [
        AppComponent,
        DeskComponent,
        TaskComponent,
        NavbarComponent,
        NotFoundComponent,
        DeskListComponent,
        DeleteButtonComponent,
        IntroComponent,
        LineDrawComponent,
        ConfigDialogComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        AddLineModule,
        LoginModule,
        BrowserAnimationsModule,
        UiKitModule,
    ],
    providers: [
        DeskHttpService,
        DraggableService,
        AppStateService,
        LineDrawingService,
        {
            provide: LOCALE_ID,
            useValue: 'ru',
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
