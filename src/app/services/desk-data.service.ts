import { Injectable } from '@angular/core';
import { ITaskCard } from '../model/itaskcard';

@Injectable()
export class DeskDataService {
    public getData(): ITaskCard[] {
        return [
            {
                id: '1',
                name: 'Tasks 1',
                tasks: [
                    { name: 'Do 1', date: new Date('10.04.2015') },
                    { name: 'Do 2', date: new Date('10.01.2015') },
                    { name: 'Do 3', date: new Date('10.23.2018') },
                ],
                top: "150px",
                left: "50px",
            },
            {
                id: '2',
                name: 'Tasks 2',
                tasks: [
                    { name: 'Do 11', date: new Date('10.04.2015') },
                    { name: 'Do 22', date: new Date('10.01.2015') },
                    { name: 'Do 33', date: new Date('10.23.2018') },
                ],
                top: "350px",
                left: "230px",
            },
            {
                id: '3',
                name: 'Tasks 3',
                tasks: [
                    { name: 'Do 111', date: new Date('10.04.2015') },
                    { name: 'Do 222', date: new Date('10.01.2015') },
                    { name: 'Do 333', date: new Date('10.23.2018') },
                ],
                top: "650px",
                left: "360px",
            },
        ];
    }
}
