import { Injectable } from '@angular/core';
import { TaskCard } from '../models/taskcard.model';
import { Desk } from '../models/desk.model';

@Injectable()
export class DeskDataService {
    public getData(id: string): TaskCard[] {
        switch (id) {
            case '1':
                return [
                    {
                        _id: '1',
                        name: 'Tasks 1',
                        tasks: [
                            { name: 'Do 1', date: new Date('10.04.2015') },
                            { name: 'Do 2', date: new Date('10.01.2015') },
                            { name: 'Do 3', date: new Date('10.23.2018') },
                        ],
                        top: '150px',
                        left: '50px',
                    },
                    {
                        _id: '2',
                        name: 'Tasks 2',
                        tasks: [
                            { name: 'Do 11', date: new Date('10.04.2015') },
                            { name: 'Do 22', date: new Date('10.01.2015') },
                            { name: 'Do 33', date: new Date('10.23.2018') },
                        ],
                        top: '350px',
                        left: '230px',
                    },
                    {
                        _id: '3',
                        name: 'Tasks 3',
                        tasks: [
                            { name: 'Do 111', date: new Date('10.04.2015') },
                            { name: 'Do 222', date: new Date('10.01.2015') },
                            { name: 'Do 333', date: new Date('10.23.2018') },
                        ],
                        top: '650px',
                        left: '360px',
                    },
                ];
            case '2':
                return [
                    {
                        _id: '1',
                        name: 'Tasks 1',
                        tasks: [
                            { name: 'Do qwd1', date: new Date('10.04.2015') },
                            { name: 'Do 2dWQ', date: new Date('10.01.2015') },
                            { name: 'Do wqD3', date: new Date('10.23.2018') },
                        ],
                        top: '120px',
                        left: '50px',
                    },
                    {
                        _id: '2',
                        name: 'Tasks 2',
                        tasks: [
                            { name: 'Do 1231', date: new Date('10.04.2015') },
                            { name: 'Do 2qw2', date: new Date('10.01.2015') },
                            { name: 'Do 3d3', date: new Date('10.23.2018') },
                        ],
                        top: '650px',
                        left: '230px',
                    },
                    {
                        _id: '3',
                        name: 'Tasks 3',
                        tasks: [
                            {
                                name: 'Do 111qwer',
                                date: new Date('10.04.2015'),
                            },
                            {
                                name: 'Do 22qwer2',
                                date: new Date('10.01.2015'),
                            },
                            {
                                name: 'Do 333qewr',
                                date: new Date('10.23.2018'),
                            },
                        ],
                        top: '250px',
                        left: '360px',
                    },
                ];
            case '3':
                return [
                    {
                        _id: '1',
                        name: 'Tasks 1',
                        tasks: [
                            { name: 'Do 1qer', date: new Date('10.04.2015') },
                            { name: 'Do qre2', date: new Date('10.01.2015') },
                            { name: 'Do qwer3', date: new Date('10.23.2018') },
                        ],
                        top: '150px',
                        left: '20px',
                    },
                    {
                        _id: '2',
                        name: 'Tasks 2',
                        tasks: [
                            { name: 'Do 11qewr', date: new Date('10.04.2015') },
                            { name: 'Do qrew22', date: new Date('10.01.2015') },
                            { name: 'Do 33qewr', date: new Date('10.23.2018') },
                        ],
                        top: '350px',
                        left: '350px',
                    },
                    {
                        _id: '3',
                        name: 'Tasks 3',
                        tasks: [
                            { name: 'Do asdasd', date: new Date('10.04.2015') },
                            { name: 'Do eew', date: new Date('10.01.2015') },
                            { name: 'Do eqwe', date: new Date('10.23.2018') },
                        ],
                        top: '350px',
                        left: '160px',
                    },
                ];
            default:
                return [];
        }
    }
    public getDesks(): Desk[] {
        return [
            {
                _id: '1',
                name: 'Desk 1',
            },
            {
                _id: '2',
                name: 'Desk 2',
            },
            {
                _id: '3',
                name: 'Desk 3',
            },
        ];
    }
}
