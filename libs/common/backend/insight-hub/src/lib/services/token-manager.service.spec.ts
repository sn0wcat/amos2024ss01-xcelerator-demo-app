import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { firstValueFrom, Observable, of } from 'rxjs';

import { ITokenManagerResponse } from '../models/interfaces/token-manager-response.interface';
import { INSIGHT_HUB_OPTIONS } from '../tokens';
import { XdTokenManagerService } from './token-manager.service';

describe('XdTokenManagerService', () => {
	let service: XdTokenManagerService;
	let httpService: HttpService;

	beforeEach(async () => {
		const httpServiceMock = {
			post: jest.fn().mockImplementation(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				XdTokenManagerService,
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
			],
		}).compile();

		service = module.get(XdTokenManagerService);
		httpService = module.get<HttpService>(HttpService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('getOrCreateBearerToken', () => {
		it('should create bearer token', async () => {
			const mockResponse = {
				data: {
					access_token: 'test_token',
					timestamp: Date.now(),
					expires_in: 3600,
				},
			};
			const postSpy = jest
				.spyOn(httpService, 'post')
				.mockReturnValue(
					of(mockResponse) as Observable<AxiosResponse<ITokenManagerResponse>>,
				);

			const token = await firstValueFrom(service.getOrCreateBearerToken());

			expect(postSpy).toHaveBeenCalledTimes(1);
			expect(postSpy).toHaveBeenCalledWith(
				`https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
				{
					grant_type: 'client_credentials',
					appName: 'amos',
					appVersion: 'v1.0.0',
					hostTenant: 'castidev',
					userTenant: 'castidev',
				},
				{
					headers: {
						'X-SPACE-AUTH-KEY': `Bearer test`,
					},
				},
			);
			expect(token).toEqual(mockResponse.data.access_token);
		});
	});

    it('should use cached bearer token', async () => {
        const mockResponse = {
            data: {
                access_token: 'test_token',
                timestamp: Date.now(),
                expires_in: 3600,
            },
        };
        const postSpy = jest
            .spyOn(httpService, 'post')
            .mockReturnValue(
                of(mockResponse) as Observable<AxiosResponse<ITokenManagerResponse>>,
            );

        const token = await firstValueFrom(service.getOrCreateBearerToken());
        const cachedToken = await firstValueFrom(service.getOrCreateBearerToken());

        // Ensure that the post method was only called once and the if block was executed only once
        expect(postSpy).toHaveBeenCalledTimes(1);
        expect(cachedToken).toEqual(token);
    });

    it('should create new bearer token if the cached token is expired', async () => {
        const mockResponse = {
            data: {
                access_token: 'test_token',
                timestamp: Date.now(),
                expires_in: 1,
            },
        };
        const postSpy = jest
            .spyOn(httpService, 'post')
            .mockReturnValue(
                of(mockResponse) as Observable<AxiosResponse<ITokenManagerResponse>>,
            );

        await firstValueFrom(service.getOrCreateBearerToken());
        await new Promise((resolve) => setTimeout(resolve, 1010));
        await firstValueFrom(service.getOrCreateBearerToken());

        expect(postSpy).toHaveBeenCalledTimes(2);
    });
});
