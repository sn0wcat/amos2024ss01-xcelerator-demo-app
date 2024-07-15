import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { IGetTimeSeriesParams, IPumpMetrics } from 'facilities-shared-models';
import { firstValueFrom, of } from 'rxjs';

import { MetricsRequestService } from './metrics-request.service';
import { TimeSeriesRequestService } from './timeseries-request.service';

describe('MetricsService', () => {
    let service: MetricsRequestService;
    let httpClient: HttpClient;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [
                TimeSeriesRequestService,
                {
                    provide: HttpClient,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        });

        service = TestBed.inject(MetricsRequestService);
        httpClient = TestBed.inject(HttpClient);
    });

    describe('getMetrics', () => {
        it('should fetch time series data', async () => {
            const mockResponse: IPumpMetrics[] = [];

            const params: IGetTimeSeriesParams = {
                assetId: faker.string.uuid(),
                propertySetName: 'PumpData',
            };

            const spy = jest.spyOn(httpClient, 'get').mockReturnValue(of(mockResponse));

            const result = await firstValueFrom(service.getMetrics(params));
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(
                `/api/metrics/${params.assetId}/${params.propertySetName}`,
            );
            expect(result).toEqual(mockResponse);
        });
    });
});
