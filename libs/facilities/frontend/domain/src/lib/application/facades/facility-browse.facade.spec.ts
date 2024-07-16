import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';

import { FacilitiesRequestService } from '../../infrastructure/facilities-request.service';
import { FacilityBrowseFacade } from './facility-browse.facade';

describe('FacilityBrowseFacade', () => {
    let service: FacilityBrowseFacade;
    let facilitiesRequestService: FacilitiesRequestService;

    beforeEach(() => {
        const facilitiesRequestServiceMock = {
            getAllFacilities: jest.fn().mockReturnValue(of([])),
            getFacility: jest.fn().mockReturnValue(of({})),
        };

        TestBed.configureTestingModule({
            providers: [
                FacilityBrowseFacade,
                { provide: FacilitiesRequestService, useValue: facilitiesRequestServiceMock },
            ],
        });

        service = TestBed.inject(FacilityBrowseFacade);
        facilitiesRequestService = TestBed.inject(FacilitiesRequestService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getAllTimeseries', () => {
        it('should call getAllFacilities of TimeseriesRequestService', async () => {
            await firstValueFrom(service.getAllFacilities());
            expect(facilitiesRequestService.getAllFacilities).toHaveBeenCalledTimes(1);
        });
    });
});
