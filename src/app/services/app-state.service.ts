import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Desk } from '../models/desk.model';

@Injectable()
export class AppStateService {
    public currentDesk: Desk;
    public desks: Desk[] = [];

    private newSaving: Subject<void> = new Subject<void>();
    public newSaving$: Observable<void> = this.newSaving.asObservable();
    public sendSaving(): void {
        this.newSaving.next();
    }
}
