import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeskDto } from '../models/desk-dto.model';
import { TaskDto } from '../models/task-dto.model';
import { MongoResponse } from '../models/mongo-response.model';
import { TaskCard } from '../models/task-card.model';

@Injectable()
export class DeskHttpService {
    constructor(private http: HttpClient) {}

    public getDesksList(): Observable<DeskDto> {
        return this.http.get<DeskDto>(`http://localhost:3000/api/desks`);
    }

    public getTasks(id: string): Observable<TaskDto> {
        const params: HttpParams = new HttpParams().set('id', id);
        const options: { params: HttpParams } = { params: params };

        return this.http.get<TaskDto>(
            `http://localhost:3000/api/tasks`,
            options
        );
    }

    public addDesk(name: string): Observable<MongoResponse> {
        return this.http.post<MongoResponse>(
            `http://localhost:3000/api/desks`,
            {
                name: name,
            }
        );
    }

    public saveTasks(
        taskCards: TaskCard[],
        deletedCardsIds: string[]
    ): Observable<MongoResponse> {
        return this.http.post<MongoResponse>(
            `http://localhost:3000/api/tasks`,
            { taskCards: taskCards, deletedCardsIds: deletedCardsIds }
        );
    }

    public deleteDesk(id: string): Observable<MongoResponse> {
        const params: HttpParams = new HttpParams().set('id', id);
        const options: { params: HttpParams } = { params: params };

        return this.http.delete<MongoResponse>(
            `http://localhost:3000/api/desks`,
            options
        );
    }
}
