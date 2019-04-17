import { TestBed } from '@angular/core/testing';

import { DraggableService } from './draggable.service';

describe('DragNDropService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DraggableService = TestBed.get(DraggableService);

        expect(service).toBeTruthy();
    });
});
