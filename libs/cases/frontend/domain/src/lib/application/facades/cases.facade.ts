import { inject, Injectable } from '@angular/core';
import { ICaseParams, ICaseResponse, ICreateCaseBody } from 'cases-shared-models';
import { Observable } from 'rxjs';

import { XdCasesRequestService } from '../../infrastructure/cases-request.service';

/**
 * Browse facades service.
 */
@Injectable({ providedIn: 'root' })
export class XdCasesFacade {
	private readonly _scanService = inject(XdCasesRequestService);

	/**
	 * Get all cases via infrastructure.
	 */
	public getAllCases(): Observable<ICaseResponse[]> {
		return this._scanService.getAllCases();
	}

	/**
	 * Get time series data via backend
	 *
	 * @param params
	 */
	public getTimeSeries(params: ICaseParams): Observable<ICaseResponse[]> {
		return this._scanService.getTimeSeries(params);
	}

    /**
     * Creates a new Case
     *
     * @param body
     */
	public createCase(body: ICreateCaseBody): Observable<ICaseResponse> {
		return this._scanService.createCase(body);
	}

    /**
     * Updates an existing Case
     *
     * @param params
     * @param body
     */
    public updateCase(params: ICaseParams, body: ICreateCaseBody): Observable<ICaseResponse> {
        return this._scanService.updateCase(params,body);
    }

    /**
     * Deletes an undesired Case
     *
     * @param params
     */
    public deleteCase(params: ICaseParams): Observable<ICaseResponse> {
        return this._scanService.deleteCase(params);
    }
}
