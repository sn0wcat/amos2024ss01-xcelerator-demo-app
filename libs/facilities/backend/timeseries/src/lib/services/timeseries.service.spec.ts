import { faker } from '@faker-js/faker';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { XdIotTimeSeriesService } from 'common-backend-insight-hub';
import { XdTokenManagerService } from 'common-backend-insight-hub';
import { PrismaService } from 'common-backend-prisma';
import { ESortOrder, IGetTimeSeriesParams, IGetTimeseriesQuery } from 'facilities-shared-models';
import { lastValueFrom, of } from 'rxjs';

import { XdTimeseriesService } from './timeseries.service';

const INSIGHT_HUB_OPTIONS = 'INSIGHT_HUB_OPTIONS';

function normalizeDate(date: Date, precision = 3): Date {
    const factor = Math.pow(10, precision);
    return new Date(Math.floor(date.getTime() / factor) * factor);
}

describe('TimeseriesService', () => {
	let service: XdTimeseriesService;
	let prisma: PrismaService = new PrismaService();
	let iothub: XdIotTimeSeriesService;

	beforeEach(async () => {
		const prismaServiceMock = {
			onModuleInit: jest.fn(),

			selectKeysFromJSON: prisma.selectKeysFromJSON,
			isTTimeSeriesData: prisma.isTTimeSeriesData,
			timeSeriesDataItem: {
				findMany: jest.fn().mockImplementation(() => [
					{
						time: new Date(),
						data: JSON.stringify({ test: 'test', test2: 'test2' }),
					},
				]),
				findFirst: jest.fn().mockImplementation(() => [
					{
						time: new Date(),
						data: JSON.stringify({ test: 'test', test2: 'test2' }),
					},
				]),

				upsert: jest.fn(),
			},
			asset: {
				upsert: jest.fn(),
			},
			timeSeriesItem: {
				findUnique: jest.fn(),
			},
			$transaction: jest.fn(),
		};

		const httpServiceMock = {
			get: jest.fn().mockImplementation(() => of({ data: {} })),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				XdTimeseriesService,
				{
					provide: PrismaService,
					useValue: prismaServiceMock,
				},
				{
					provide: HttpService,
					useValue: httpServiceMock,
				},
				{
					provide: XdIotTimeSeriesService,
					useValue: {
						getTimeSeriesData: jest.fn().mockReturnValue(of([])),
						isLocalSession: jest.fn().mockReturnValue(true),
					},
				},
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

		service = module.get<XdTimeseriesService>(XdTimeseriesService);
		prisma = module.get<PrismaService>(PrismaService);
		iothub = module.get<XdIotTimeSeriesService>(XdIotTimeSeriesService);
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('getTimeSeriesFromDB', () => {
		it('should return the correct time series data', async () => {
			const flow = faker.string.sample();
			const presure = faker.string.sample();
			const findManyResult = {
				name: faker.string.sample(),
				location: {},
				time: faker.date.recent(),
				timeSeriesItemAssetId: faker.string.uuid(),
				timeSeriesItemPropertySetName: faker.string.sample(),
				data: JSON.stringify({ flow: flow, presure: presure }) as Prisma.JsonValue,
			};

			const findManySpy = jest
				.spyOn(prisma.timeSeriesDataItem, 'findMany')
				.mockResolvedValue([findManyResult]);

			const params: IGetTimeSeriesParams = {
				assetId: findManyResult.timeSeriesItemAssetId,
				propertySetName: findManyResult.timeSeriesItemPropertySetName,
			};

			const result = await lastValueFrom(
				service.getTimeSeriesFromDB({
					...params,
					select: ['flow', 'presure'],
				}),
			);

			expect(findManySpy).toHaveBeenCalledTimes(1);

			expect(result[0]['flow']).toEqual(flow);
		});

		it('should call selectKeysFromJSON only with the selected Props', async () => {
			const flow = faker.string.sample();
			const presure = faker.string.sample();
			const findManyResult = {
				name: faker.string.sample(),
				location: {},
				time: new Date(),
				timeSeriesItemAssetId: faker.string.uuid(),
				timeSeriesItemPropertySetName: faker.string.sample(),
				data: JSON.stringify({ flow: flow, presure: presure }) as Prisma.JsonValue,
			};

			const findManySpy = jest
				.spyOn(prisma.timeSeriesDataItem, 'findMany')
				.mockResolvedValue([findManyResult]);

			const params: IGetTimeSeriesParams = {
				assetId: findManyResult.timeSeriesItemAssetId,
				propertySetName: findManyResult.timeSeriesItemPropertySetName,
			};

			const query: IGetTimeseriesQuery = {
				select: ['flow'],
			};

			const result = await lastValueFrom(
				service.getTimeSeriesFromDB({
					...params,
					...query,
				}),
			);

			expect(findManySpy).toHaveBeenCalledTimes(1);

			expect(result[0]['flow']).toEqual(flow);
            expect(normalizeDate(result[0]['time'])).toEqual(normalizeDate(findManyResult.time));
		});

		it('should call the iothub service if the local param is set to true', async () => {
			const getTimeSeriesDataSpy = jest
				.spyOn(iothub, 'getTimeSeriesData')
				.mockReturnValue(of([]));

			const findManySpy = jest
				.spyOn(prisma.timeSeriesDataItem, 'findMany')
				.mockResolvedValue([]);

			const params: IGetTimeSeriesParams = {
				assetId: faker.string.uuid(),
				propertySetName: faker.string.sample(),
			};

			const query: IGetTimeseriesQuery = {
				select: ['flow'],
			};

			await lastValueFrom(
				service.getTimeSeriesFromApi({
					...params,
					...query,
				}),
			);

			expect(findManySpy).toHaveBeenCalledTimes(0);

			expect(getTimeSeriesDataSpy).toHaveBeenCalledWith(
				params.assetId,
				params.propertySetName,
				query,
			);

			await lastValueFrom(
				service.getTimeSeriesFromDB({
					...params,
					...query,
				}),
			);

			expect(getTimeSeriesDataSpy).toHaveBeenCalledTimes(1);
			expect(findManySpy).toHaveBeenCalledTimes(1);
		});

		it('should use local db when api iot service decides its a local session', async () => {
			const getTimeSeriesDataSpy = jest
				.spyOn(iothub, 'getTimeSeriesData')
				.mockReturnValue(of([]));

			const findManySpy = jest
				.spyOn(prisma.timeSeriesDataItem, 'findMany')
				.mockResolvedValue([]);

			const isLocalSessionSpy = jest.spyOn(iothub, 'isLocalSession');

			const params: IGetTimeSeriesParams = {
				assetId: faker.string.uuid(),
				propertySetName: faker.string.sample(),
			};

			const query: IGetTimeseriesQuery = {
				select: ['flow'],
			};

			isLocalSessionSpy.mockReturnValue(false);

			await lastValueFrom(
				service.getTimeSeries({
					...params,
					...query,
				}),
			);

			isLocalSessionSpy.mockReturnValue(true);

			await lastValueFrom(
				service.getTimeSeries({
					...params,
					...query,
				}),
			);

			expect(getTimeSeriesDataSpy).toHaveBeenCalledTimes(1);
			expect(findManySpy).toHaveBeenCalledTimes(1);
		});

		it('should use the correct args to query the time series data', async () => {
			const findManySpy = jest
				.spyOn(prisma.timeSeriesDataItem, 'findMany')
				.mockResolvedValue([]);

			const params: IGetTimeSeriesParams = {
				assetId: faker.string.uuid(),
				propertySetName: faker.string.sample(),
			};

			const query: IGetTimeseriesQuery = {
				from: faker.date.past(),
				to: faker.date.recent(),
				limit: faker.number.int(10),
				sort: ESortOrder.ASCENDING,
			};

			await lastValueFrom(
				service.getTimeSeriesFromDB({
					...params,
					...query,
				}),
			);

			expect(findManySpy).toHaveBeenCalledTimes(1);

            expect(findManySpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        timeSeriesItemAssetId: params.assetId,
                        timeSeriesItemPropertySetName: params.propertySetName,
                        time: expect.objectContaining({
                            gte: expect.any(Date),
                            lte: expect.any(Date),
                        }),
                    }),
                    take: query.limit,
                    orderBy: {
                        time: query.sort,
                    },
                }),
            );
		});
	});
});
