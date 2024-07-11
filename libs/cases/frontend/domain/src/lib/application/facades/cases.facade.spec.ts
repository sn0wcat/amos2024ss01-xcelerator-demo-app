import { TestBed } from '@angular/core/testing';
import { ICaseParams } from 'cases-shared-models';
import { firstValueFrom, of } from 'rxjs';

import { XdCasesRequestService } from '../../infrastructure/cases-request.service';
import { XdCasesFacade } from './cases.facade';

describe('XdCasesFacade', () => {
	let facade: XdCasesFacade;
	let casesRequestService: XdCasesRequestService;

	beforeEach(() => {
		const timeseriesRequestServiceMock = {
			getTimeSeries: jest.fn().mockReturnValue(of({})),
			getAllCases: jest.fn().mockReturnValue(of([])),
			createCase: jest.fn().mockReturnValue(of({})),
			updateCase: jest.fn().mockReturnValue(of({})),
			deleteCase: jest.fn().mockReturnValue(of({})),
		};

		TestBed.configureTestingModule({
			providers: [
				XdCasesFacade,
				{ provide: XdCasesRequestService, useValue: timeseriesRequestServiceMock },
			],
		});

		facade = TestBed.inject(XdCasesFacade);
		casesRequestService = TestBed.inject(XdCasesRequestService);
	});

	it('should be created', () => {
		expect(facade).toBeTruthy();
	});

	describe('getAllTimeseries', () => {
		it('should call getAllTimeseries of TimeseriesRequestService', async () => {
			const response = await firstValueFrom(facade.getAllCases());

			expect(casesRequestService.getAllCases).toHaveBeenCalledTimes(1);
			expect(response).toEqual([]);
		});
	});

	describe('getTimeSeries', () => {
		it('should call getTimeSeries of TimeseriesRequestService with correct parameters', async () => {
			const params: ICaseParams = { id: 1 } as ICaseParams;

			const response = await firstValueFrom(facade.getTimeSeries(params));

			expect(casesRequestService.getTimeSeries).toHaveBeenCalledWith(params);
			expect(response).toEqual({});
		});
	});

	describe('createCase', () => {
		it('should call createCase of CasesRequestService with correct parameters', async () => {
			const body = { id: 1 } as any;

			await firstValueFrom(facade.createCase(body));

			expect(casesRequestService.createCase).toHaveBeenCalledWith(body);
		});
	});

	describe('updateCase', () => {
		it('should call updateCase of CasesRequestService with correct parameters', async () => {
			const params: ICaseParams = { id: 1 } as ICaseParams;
			const body = { id: 1 } as any;

			await firstValueFrom(facade.updateCase(params, body));

			expect(casesRequestService.updateCase).toHaveBeenCalledWith(params, body);
		});
	});

	describe('deleteCase', () => {
		it('should call deleteCase of CasesRequestService with correct parameters', async () => {
			const params: ICaseParams = { id: 1 } as ICaseParams;

			await firstValueFrom(facade.deleteCase(params));

			expect(casesRequestService.deleteCase).toHaveBeenCalledWith(params);
		});
	});
});
