import { inject, Injectable } from '@angular/core';
import { faker } from '@faker-js/faker';
import * as dayjs from 'dayjs';
import { map } from 'rxjs';

import { FacilitiesRequestService } from '../../infrastructure/facilities-request.service';
import { MetricsRequestService } from '../../infrastructure/metrics-request.service';
import { TimeSeriesRequestService } from '../../infrastructure/timeseries-request.service';

/**
 * Facade for the details page of a facility
 */
@Injectable({ providedIn: 'root' })
export class XdDetailsFacade {
	private readonly _facilitiesService = inject(FacilitiesRequestService);
	private readonly _timeseriesService = inject(TimeSeriesRequestService);
	private readonly _metricsService = inject(MetricsRequestService);

	/**
	 * Get facility
	 * @param assetId The asset id.
	 * @TODO: This method should NOT map the response data and add fake data. In a later ticket, we will provide a meaningful implementation.
	 */
	public getFacility(assetId: string) {
		return this._facilitiesService.getFacility({ assetId: assetId }).pipe(
			map((timeSeriesItem) => {
				return {
					id: timeSeriesItem.assetId,
					icon: faker.helpers.arrayElement([
						'battery-empty',
						'water-fish',
						'water-plant',
						'truck',
					]),
					cases: timeSeriesItem.cases,
					heading: timeSeriesItem.name,
					subheading: timeSeriesItem.description,
					status: timeSeriesItem.status,
					metrics: timeSeriesItem.metrics,
					indicatorMsg: timeSeriesItem.indicatorMsg,
					pumps: faker.number.int({ min: 0, max: 99 }),
					location: timeSeriesItem.location,
				};
			}),
		);
	}

    /**
     * Returns the metrics for the asset
     *
     * @param assetId
     * @param propertySetName
     */
	public getMetrics(assetId: string, propertySetName: string) {
		return this._metricsService.getMetrics({ assetId, propertySetName });
	}

	/**
	 * Get a list of all the available timeSeries properties
	 * @param assetId The asset id.
	 */
	public getTimeSeriesItems(assetId: string) {
		return this._timeseriesService.getTimeSeriesItems({ assetId });
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
