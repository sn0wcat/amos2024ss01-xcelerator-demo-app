import { faker } from '@faker-js/faker';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { firstValueFrom, Observable, of } from 'rxjs';

import { ITimeSeriesRequestParameter } from '../models';
import { INSIGHT_HUB_OPTIONS } from '../tokens';
import { XdIotTimeSeriesService } from './iot-time-series.service';
import { XdTokenManagerService } from './token-manager.service';
import { IInsightHub } from 'common-backend-models';

interface MockSelectParameter {
	flow: number;
	pressure: number;
}

describe('XdIotTimeSeriesService', () => {
	let service: XdIotTimeSeriesService;
	let httpService: HttpService;
    let insightHubOptions: IInsightHub;

	beforeEach(async () => {
		const httpServiceMock = {
			get: jest.fn().mockImplementation(() => of({ data: {} })),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				XdIotTimeSeriesService,
				{
					provide: HttpService,
					useValue: httpServiceMock,
				},
				{
					provide: INSIGHT_HUB_OPTIONS,
					useValue: {
						apiUrl: 'https://gateway.eu1.mindsphere.io/api',
						apiKey: 'test',
					},
				},
				{
					provide: XdTokenManagerService,
					useValue: {
						getOrCreateBearerToken: jest.fn().mockReturnValue(of('test_token')),
					},
				},
				{
					provide: Logger,
					useValue: {
						error: jest.fn(),
					},
				},
			],
		}).compile();

		service = module.get<XdIotTimeSeriesService>(XdIotTimeSeriesService);
		httpService = module.get<HttpService>(HttpService);
        insightHubOptions = module.get(INSIGHT_HUB_OPTIONS);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('getTimeSeriesData', () => {
		it('should get time series data', async () => {
			const mockResponse = { test: 'test' };
			const getSpy = jest
				.spyOn(httpService, 'get')
				.mockReturnValue(of({ data: mockResponse }) as Observable<AxiosResponse>);
			const params: ITimeSeriesRequestParameter<MockSelectParameter> = {
				from: faker.date.past(),
				to: faker.date.recent(),
				limit: faker.number.int(),
				select: [ 'flow', 'pressure' ],
			};
			const assetId = faker.string.uuid();
			const propertySetName = faker.lorem.word(1);

			const response = await firstValueFrom(
				service.getTimeSeriesData<MockSelectParameter, any>(
					assetId,
					propertySetName,
					params,
				),
			);

			expect(getSpy).toHaveBeenCalledTimes(1);
			expect(getSpy).toHaveBeenCalledWith(
				`https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${propertySetName}`,
				{
					headers: {
						Authorization: 'Bearer test_token',
					},
					params: {
						...params,
					},
				},
			);
			expect(response).toEqual(mockResponse);
		});
	});

    describe('isLocalSession', () => {
        it('should return true for isLocalSession when apiKey and apiUrl are undefined', () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            insightHubOptions.apiKey = null;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            insightHubOptions.apiUrl = null;

            expect(service.isLocalSession()).toBe(true);
        });

        it('should return true for isLocalSession when apiKey and apiUrl are empty strings', () => {
            insightHubOptions.apiKey = '';
            insightHubOptions.apiUrl = '';

            expect(service.isLocalSession()).toBe(true);
        });

        it('should return true for isLocalSession when apiKey is defined and apiUrl is undefined', () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
           insightHubOptions.apiUrl = null;

            expect(service.isLocalSession()).toBe(true);
        });

        it('should return true for isLocalSession when apiKey is undefined and apiUrl is defined', () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            insightHubOptions.apiKey = null;

            expect(service.isLocalSession()).toBe(true);
        });

        it('should return true for isLocalSession when apiKey is defined and apiUrl is an empty string', () => {
            insightHubOptions.apiUrl = '';

            expect(service.isLocalSession()).toBe(true);
        });

        it('should return true for isLocalSession when apiKey is an empty string and apiUrl is defined', () => {
            insightHubOptions.apiKey = '';

            expect(service.isLocalSession()).toBe(true);
        });

        it('should return false for isLocalSession when apiKey and apiUrl are defined', () => {
            expect(service.isLocalSession()).toBe(false);
        });
    });
});
