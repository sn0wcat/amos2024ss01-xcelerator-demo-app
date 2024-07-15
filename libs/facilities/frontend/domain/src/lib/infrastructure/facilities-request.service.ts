import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    IFacilitiesResponse,
    IGetFacilitiesParams,
} from 'facilities-shared-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacilitiesRequestService {

    private readonly _baseRoute = '/api/facilities';

    constructor(private readonly _httpClient: HttpClient) {}

    public getAllFacilities(): Observable<IFacilitiesResponse[]> {
        return this._httpClient.get<IFacilitiesResponse[]>(this._baseRoute);
    }

    public getFacility(
        params: IGetFacilitiesParams,
    ): Observable<IFacilitiesResponse> {

        return this._httpClient.get<IFacilitiesResponse>(
            `${this._baseRoute}/${params.assetId}`,
        );
    }

}
