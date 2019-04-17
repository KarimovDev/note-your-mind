import { TestBed } from '@angular/core/testing';

import { DeskHttpService } from './desk-http.service';

describe('DeskHttpService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DeskHttpService = TestBed.get(DeskHttpService);

        expect(service).toBeTruthy();
    });
});
