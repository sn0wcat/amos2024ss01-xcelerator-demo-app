import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { ICaseParams, ICaseResponse } from 'cases-shared-models';
import { firstValueFrom, of } from 'rxjs';

import { CasesRequestService } from './cases-request.service';

describe('CasesRequestService', () => {
	let service: CasesRequestService;
	let httpClient: HttpClient;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ HttpClientTestingModule ],
			providers: [
				CasesRequestService,
				{
					provide: HttpClient,
					useValue: {
						get: jest.fn(),
						post: jest.fn(),
						put: jest.fn(),
						delete: jest.fn(),
					},
				},
			],
		});

		service = TestBed.inject(CasesRequestService);
		httpClient = TestBed.inject(HttpClient);
	});

	describe('getAllCases', () => {
		it('should forward the request to the backend', async () => {
			const mockResponse: ICaseResponse[] = [];

			const spy = jest.spyOn(httpClient, 'get').mockReturnValue(of(mockResponse));

			const result = await firstValueFrom(service.getAllCases());
			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith('/api/case');
			expect(result).toEqual(mockResponse);
		});
	});

	describe('getTimeSeries', () => {
		it('should forward the request to the backend', async () => {
			const params = { id: faker.number.int() } as ICaseParams;
			const mockResponse: ICaseParams[] = [ { id: faker.number.int() } ] as ICaseParams[];

			const spy = jest.spyOn(httpClient, 'get').mockReturnValue(of(mockResponse));

			const result = await firstValueFrom(service.getTimeSeries(params));
			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith(`/api/case/${params.id}`);
			expect(result).toEqual(mockResponse);
		});
	});

	describe('createCase', () => {
		it('should forward the request to the backend', async () => {
			const body = { id: faker.number.int() } as any;
			const mockResponse = { id: faker.number.int() } as ICaseResponse;

			const spy = jest.spyOn(httpClient, 'post').mockReturnValue(of(mockResponse));

			const result = await firstValueFrom(service.createCase(body));
			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith('/api/case', body);
			expect(result).toEqual(mockResponse);
		});
	});

	describe('updateCase', () => {
		it('should forward the request to the backend', async () => {
			const params = { id: faker.number.int() } as ICaseParams;
			const body = { id: faker.number.int() } as any;
			const mockResponse = { id: faker.number.int() } as ICaseResponse;

			const spy = jest.spyOn(httpClient, 'put').mockReturnValue(of(mockResponse));

			const result = await firstValueFrom(service.updateCase(params, body));
			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith(`/api/case/${params.id}`, body);
			expect(result).toEqual(mockResponse);
		});
	});

	describe('deleteCase', () => {
		it('should forward the request to the backend', async () => {
			const params = { id: faker.number.int() } as ICaseParams;
			const mockResponse = { id: faker.number.int() } as ICaseResponse;

			const spy = jest.spyOn(httpClient, 'delete').mockReturnValue(of(mockResponse));

			const result = await firstValueFrom(service.deleteCase(params));
			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith(`/api/case/${params.id}`);
			expect(result).toEqual(mockResponse);
		});
	});
});
