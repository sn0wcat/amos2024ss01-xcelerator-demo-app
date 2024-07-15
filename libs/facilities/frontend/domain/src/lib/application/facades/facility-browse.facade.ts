import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { FacilitiesRequestService } from '../../infrastructure/facilities-request.service';
import { randomIconFromString } from '../helpers/facade-helper';

/**
 * Browse facades service.
 */
@Injectable({ providedIn: 'root' })
export class FacilityBrowseFacade {

    constructor(private readonly _scanService: FacilitiesRequestService) {}

	/**
	 * Get all the facilities.
	 */
	public getAllFacilities() {
		return this._scanService.getAllFacilities().pipe(
			map((timeSeriesItem) => {
				return timeSeriesItem.map((timeSeriesItem) => {
					return {
						id: timeSeriesItem.assetId,
						icon: randomIconFromString(timeSeriesItem.description),
						cases: timeSeriesItem.cases,
						heading: timeSeriesItem.name,
						subheading: timeSeriesItem.description,
						status: timeSeriesItem.status,
						location: timeSeriesItem.location,
					};
				});
			}),
		);
	}
}
