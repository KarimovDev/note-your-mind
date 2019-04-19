import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Desk } from '../models/desk.model';

@Injectable()
export class AppStateService {
    public currentDesk: Desk;
    public desks: Desk[] = [];

    constructor() {}

    private newSaving: Subject<undefined> = new Subject<undefined>();
    public newSaving$: Observable<MouseEvent> = this.newSaving.asObservable();
    public sendSaving(): void {
        this.newSaving.next();
    }
}
