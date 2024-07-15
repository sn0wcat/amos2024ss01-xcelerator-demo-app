import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import { map } from 'rxjs';

import { FacilitiesRequestService } from '../../infrastructure/facilities-request.service';
import { MetricsRequestService } from '../../infrastructure/metrics-request.service';
import { TimeSeriesRequestService } from '../../infrastructure/timeseries-request.service';
import { randomIconFromString } from '../helpers/facade-helper';

/**
 * Facade for the details page of a facility
 */
@Injectable({ providedIn: 'root' })
export class FacilityDetailFacade {

    constructor(private readonly _facilitiesService: FacilitiesRequestService,
                private readonly _timeseriesService: TimeSeriesRequestService,
                private readonly _metricsService: MetricsRequestService
    ) {}

	/**
	 * Get facility
	 * @param assetId The asset id.
	 */
	public getFacility(assetId: string) {
		return this._facilitiesService.getFacility({ assetId: assetId }).pipe(
			map((timeSeriesItem) => {
				return {
					id: timeSeriesItem.assetId,
					icon: randomIconFromString(timeSeriesItem.description),
					cases: timeSeriesItem.cases,
					heading: timeSeriesItem.name,
					subheading: timeSeriesItem.description,
					status: timeSeriesItem.status,
					metrics: timeSeriesItem.metrics,
					indicatorMsg: timeSeriesItem.indicatorMsg,
					location: timeSeriesItem.location,
				};
			}),
		);
	}

    /**
     * Returns the metrics for the pump
     *
     * @param assetId
     */
	public getPumpMetrics(assetId: string) {
		return this._metricsService.getMetrics({ assetId, propertySetName: 'PumpData' });
	}

	/**
	 * Get the specific data of a time series property of a facility of the last 28 minutes
	 *
	 * @param assetId The asset id.
	 */
	public getPumpData(assetId: string) {
		return this._timeseriesService.getTimeSeriesDataItems(
			{ assetId, propertySetName: 'PumpData' },
			{
				from: dayjs().subtract(28, 'minute').toDate(),
				to: dayjs().toDate(),
			},
		);
	}

	/**
	 * Get the environment data of a facility of the last 24 hours
	 *
	 * @param assetId
	 */
	public getEnvironmentData(assetId: string) {
		return this._timeseriesService.getTimeSeriesDataItems(
			{ assetId, propertySetName: 'Environment' },
			{
				from: dayjs().subtract(24, 'hours').toDate(),
				to: dayjs().toDate(),
			},
		);
	}

}
