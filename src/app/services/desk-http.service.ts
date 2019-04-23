import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MongoDto } from '../models/mongo-dto.model';
import { environment } from 'src/environments/environment';
import { InputParamsSaveTasks } from '../models/input-params-save-tasks.model';

@Injectable()
export class DeskHttpService {
    constructor(private http: HttpClient) {}

    public getDesksList(id: string): Observable<MongoDto> {
        const params: HttpParams = new HttpParams().set('id', id);
        const options: { params: HttpParams } = { params: params };

        return this.http.get<MongoDto>(
            `http://${environment.serverIp}:${
                environment.serverPort
            }/api/desks`,
            options
        );
    }

    public getTasks(id: string): Observable<MongoDto> {
        const params: HttpParams = new HttpParams().set('id', id);
        const options: { params: HttpParams } = { params: params };

        return this.http.get<MongoDto>(
            `http://${environment.serverIp}:${
                environment.serverPort
            }/api/tasks`,
            options
        );
    }

    public getUser(email: string, pass: string): Observable<MongoDto> {
        let params: HttpParams = new HttpParams();

        params = params.append('email', email);
        params = params.append('pass', pass);

        const options: { params: HttpParams } = { params: params };

        return this.http.get<MongoDto>(
            `http://${environment.serverIp}:${
                environment.serverPort
            }/api/users`,
            options
        );
    }

    public addDesk(id: string, name: string): Observable<MongoDto> {
        return this.http.post<MongoDto>(
            `http://${environment.serverIp}:${
                environment.serverPort
            }/api/desks`,
            {
                _userId: id,
                name: name,
            }
        );
    }

    public addUser(email: string, pass: string): Observable<MongoDto> {
        return this.http.post<MongoDto>(
            `http://${environment.serverIp}:${
                environment.serverPort
            }/api/users`,
            {
                email: email,
                pass: pass,
            }
        );
    }

    public saveTasks(inputParams: InputParamsSaveTasks): Observable<MongoDto> {
        return this.http.post<MongoDto>(
            `http://${environment.serverIp}:${
                environment.serverPort
            }/api/tasks`,
            {
                taskCards: inputParams.taskCards,
                deletedCardsIds: inputParams.deletedCardsIds,
                connectedTaskCards: inputParams.connectedTaskCards,
                deletedConnIds: inputParams.deletedConnIds,
            }
        );
    }

    public deleteDesk(id: string): Observable<MongoDto> {
        const params: HttpParams = new HttpParams().set('id', id);
        const options: { params: HttpParams } = { params: params };

        return this.http.delete<MongoDto>(
            `http://${environment.serverIp}:${
                environment.serverPort
            }/api/desks`,
            options
        );
    }
}
