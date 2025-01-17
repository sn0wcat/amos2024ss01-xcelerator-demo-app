import { ICaseResponse } from 'cases-shared-models';
import { TTimeSeriesData } from 'common-shared-models';

import { EPumpStatus } from '../enums';
import { IPumpMetrics } from './pump-metrics.interface';

/**
 * Interface for a time series data item response
 */
export interface ITimeSeriesDataItemResponse {
	/**
	 * The time of the data
	 */
	time: Date;

	/**
	 * The data for the time
	 */
	[key: string]: TTimeSeriesData;
}

/**
 * Interface for a time series response
 */
export interface ITimeSeriesItemResponse {
	/**
	 * The assetId id for an asset
	 */
	assetId: string;

	/**
	 * The name of the aspect
	 */
	propertySetName: string;

	/**
	 * The variables of the aspect
	 */
	variables?: {
		name: string;
		unit: string;
	}[];
}

export interface IFacilitiesResponse {
	/**
	 * The asset id for an asset
	 */
	assetId: string;

	/**
	 * The name of the asset
	 */
	name: string;

	/**
	 * The type of the asset
	 */
	typeId: string;

	/**
	 * The description of the asset
	 */
	description: string;

	/**
	 * The status of the asset
	 */
	status: EPumpStatus;

    /**
     * The indicator message of the asset
     */
    indicatorMsg: string;

    /**
     * The data analytics of the asset
     */
    metrics: IPumpMetrics[];

	/**
	 * The variables of the asset
	 */
	variables: any;

	location?: IFacilityLocation;

	/**
	 * The createdAt timestamp of the asset
	 */
	createdAt: Date;

	/**
	 * The updatedAt timestamp of the asset
	 */
	updatedAt: Date;

	cases: Pick<ICaseResponse, 'id'>[];
}

export interface IFacilityLocation {
	/**
	 * The country of the facility location
	 */
	country?: string;

	/**
	 * The region of the facility location
	 */
	region?: string;

	/**
	 * The locality of the facility location
	 */
	locality?: string;

	/**
	 * The street address of the facility location
	 */
	streetAddress?: string;

	/**
	 * The postal code of the facility location
	 */
	postalCode?: string;

	/**
	 * The longitude of the facility location
	 */
	longitude?: number;

	/**
	 * The latitude of the facility location
	 */
	latitude?: number;
}
