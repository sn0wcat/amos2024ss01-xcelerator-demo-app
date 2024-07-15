import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { FacilitiesRequestService } from '../../infrastructure/facilities-request.service';
import { MetricsRequestService } from '../../infrastructure/metrics-request.service';
import { TimeSeriesRequestService } from '../../infrastructure/timeseries-request.service';
import { FacilityDetailFacade } from './facility-detail.facade';

describe('FacilityDetailFacade', () => {
	let service: FacilityDetailFacade;
	let facilitiesRequestService: FacilitiesRequestService;

	beforeEach(() => {
		const facilitiesRequestServiceMock = {
			getAllFacilities: jest.fn().mockReturnValue(of([])),
			getFacility: jest.fn().mockReturnValue(of({})),
		};

		TestBed.configureTestingModule({
			providers: [
				FacilityDetailFacade,
				{
					provide: FacilitiesRequestService,
					useValue: facilitiesRequestServiceMock,
				},
				{
					provide: TimeSeriesRequestService,
					useValue: {
						getTimeSeriesItems: jest.fn().mockReturnValue(of([])),
						getTimeSeriesDataItems: jest.fn().mockReturnValue(of([])),
					},
				},
				{
					provide: MetricsRequestService,
					useValue: {
						getMetrics: jest.fn().mockReturnValue(of([])),
					},
				},
			],
		});

		service = TestBed.inject(FacilityDetailFacade);
		facilitiesRequestService = TestBed.inject(FacilitiesRequestService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('getFacility', () => {
		it('should call getFacility of FacilitiesRequestService with correct parameters', () => {
			const assetId = 'testAssetId';

			service.getFacility(assetId);
			expect(facilitiesRequestService.getFacility).toHaveBeenCalledWith({ assetId });
		});
	});
});
