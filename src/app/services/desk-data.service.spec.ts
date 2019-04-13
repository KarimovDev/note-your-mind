import { TestBed } from '@angular/core/testing';

import { DeskDataService } from './desk-data.service';

describe('DeskDataService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DeskDataService = TestBed.get(DeskDataService);

        expect(service).toBeTruthy();
    });
});
