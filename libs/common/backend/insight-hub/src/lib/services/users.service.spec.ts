import { faker } from '@faker-js/faker';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { firstValueFrom, Observable, of } from 'rxjs';

import { INSIGHT_HUB_OPTIONS } from '../tokens';
import { XdTokenManagerService } from './token-manager.service';
import { XdUsersService } from './users.service';

describe('XdUsersService', () => {
	let service: XdUsersService;
	let httpService: HttpService;

	beforeEach(async () => {
		const httpServiceMock = {
			get: jest.fn().mockImplementation(() => of({ data: {} })),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				XdUsersService,
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

		service = module.get<XdUsersService>(XdUsersService);
		httpService = module.get<HttpService>(HttpService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('getUsersData', () => {
		it('should get users data', async () => {
			const mockResponse = { test: faker.lorem.word() };
			const getSpy = jest
				.spyOn(httpService, 'get')
				.mockReturnValue(of({ data: mockResponse }) as Observable<AxiosResponse>);

			const response = await firstValueFrom(service.getUsersData());

			expect(response).toEqual(mockResponse);
			expect(getSpy).toBeCalledTimes(1);
		});
	});
});
