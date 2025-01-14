import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICaseParams, ICaseResponse, ICreateCaseBody } from 'cases-shared-models';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class CasesRequestService {

    constructor(private readonly _httpClient: HttpClient) {}

	/**
	 * Get all cases via backend
	 */
	public getAllCases(): Observable<ICaseResponse[]> {
		return this._httpClient.get<ICaseResponse[]>('/api/case');
	}

	/**
	 * Get time series data via backend
	 *
	 * @param {ICaseParams} params
	 */
	public getTimeSeries(params: ICaseParams): Observable<ICaseResponse[]> {
		return this._httpClient.get<ICaseResponse[]>(`/api/case/${params.id}`);
	}

	/**
	 * Create new Case
	 * @param {ICreateCaseBody} body
	 *
	 */
	public createCase(body: ICreateCaseBody) {
		return this._httpClient.post<ICaseResponse>('/api/case', body);
	}

	/**
	 *
	 * @param params
	 * @param body
	 */
	public updateCase(params: ICaseParams, body: ICreateCaseBody) {
		return this._httpClient.put<ICaseResponse>(`/api/case/${params.id}`, body);
	}

	/**
	 * Delete case by Id
	 * @param params
	 */
	public deleteCase(params: ICaseParams) {
		return this._httpClient.delete<ICaseResponse>(`/api/case/${params.id}`);
	}
}
