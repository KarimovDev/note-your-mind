import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MongoDto } from '../models/mongo-dto.model';
import { TaskCard } from '../models/task-card.model';
import { serverIp, serverPort } from '../constants/backend.const';

@Injectable()
export class DeskHttpService {
    constructor(private http: HttpClient) {}

    public getDesksList(id: string): Observable<MongoDto> {
        const params: HttpParams = new HttpParams().set('id', id);
        const options: { params: HttpParams } = { params: params };

        return this.http.get<MongoDto>(
            `http://${serverIp}:${serverPort}/api/desks`,
            options
        );
    }

    public getTasks(id: string): Observable<MongoDto> {
        const params: HttpParams = new HttpParams().set('id', id);
        const options: { params: HttpParams } = { params: params };

        return this.http.get<MongoDto>(
            `http://${serverIp}:${serverPort}/api/tasks`,
            options
        );
    }

    public getUser(email: string, pass: string): Observable<MongoDto> {
        let params: HttpParams = new HttpParams();
        const options: { params: HttpParams } = { params: params };

        params = params.append('email', email);
        params = params.append('pass', pass);

        return this.http.get<MongoDto>(
            `http://${serverIp}:${serverPort}/api/users`,
            options
        );
    }

    public addDesk(id: string, name: string): Observable<MongoDto> {
        return this.http.post<MongoDto>(`http://${serverIp}:${serverPort}/api/desks`, {
            _userId: id,
            name: name,
        });
    }

    public addUser(email: string, pass: string): Observable<MongoDto> {
        return this.http.post<MongoDto>(`http://${serverIp}:${serverPort}/api/users`, {
            email: email,
            pass: pass,
        });
    }

    public saveTasks(
        taskCards: TaskCard[],
        deletedCardsIds: string[]
    ): Observable<MongoDto> {
        return this.http.post<MongoDto>(`http://${serverIp}:${serverPort}/api/tasks`, {
            taskCards: taskCards,
            deletedCardsIds: deletedCardsIds,
        });
    }

    public deleteDesk(id: string): Observable<MongoDto> {
        const params: HttpParams = new HttpParams().set('id', id);
        const options: { params: HttpParams } = { params: params };

        return this.http.delete<MongoDto>(
            `http://${serverIp}:${serverPort}/api/desks`,
            options
        );
    }
}
