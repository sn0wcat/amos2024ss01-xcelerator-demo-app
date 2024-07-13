import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
    IGetTimeSeriesParams, IPumpMetrics,
} from 'facilities-shared-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetricsRequestService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _baseRoute = '/api/metrics';

    /**
     * Get the metrics for the asset
     *
     * @param params
     */
    public getMetrics(params: IGetTimeSeriesParams): Observable<IPumpMetrics[]> {
        return this._httpClient.get<IPumpMetrics[]>(`${this._baseRoute}/${params.assetId}/${params.propertySetName}`);
    }

}
