import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ETimeSeriesOrdering, XdIotTimeSeriesService } from 'common-backend-insight-hub';
import { PrismaService } from 'common-backend-prisma';
import {
	IGetTimeSeriesParams,
	IGetTimeseriesQuery,
	ITimeSeriesDataItemResponse,
	ITimeSeriesItemResponse,
} from 'facilities-shared-models';
import { omit } from 'lodash';
import { from, map, Observable, switchMap } from 'rxjs';
import dayjs = require('dayjs');

@Injectable()
export class XdTimeseriesService {
	constructor(
		@Inject(forwardRef(() => PrismaService))
		private readonly prismaService: PrismaService,

		private readonly iotTimeSeriesService: XdIotTimeSeriesService,
	) {}

	/**
	 * Acts as a gateway to get the time series data from either the API or the DB.
	 *
	 * @param args - the query and parameters based arguments to get the time series data
	 */
	public getTimeSeries(args: IGetTimeSeriesParams & IGetTimeseriesQuery) {
		const result$ = this.iotTimeSeriesService.isLocalSession()
			? this.getTimeSeriesFromDB(args)
			: this.getTimeSeriesFromApi(args);

		return result$;
	}

	/**
	 * Get timeseries data based on the assetId and propertySetName from the API
	 *
	 * @param args - the query and parameters based arguments to get the time series data
	 */
	public getTimeSeriesFromApi(
		args: IGetTimeSeriesParams & IGetTimeseriesQuery,
	): Observable<ITimeSeriesDataItemResponse[] | never[]> {
		const { assetId, propertySetName, sort, ...params } = args;
		return this.iotTimeSeriesService
			.getTimeSeriesData<
				any,
				{
					_time: string;
					[key: string]: any;
				}[]
			>(assetId, propertySetName, {
				...params,
				// Todo: Fix this in a future PR
				sort: sort as unknown as ETimeSeriesOrdering,
			})
			.pipe(
				map((items) => {
					return items.map((item) => ({
						time: new Date(item._time),
						...omit(item, '_time'),
					}));
				}),
			);
	}

	private findFirstTime(assetId: string, propertySetName: string) {
		return from(
			this.prismaService.timeSeriesDataItem.findFirst({
				where: {
					timeSeriesItemAssetId: assetId,
					timeSeriesItemPropertySetName: propertySetName,
				},
				orderBy: {
					time: 'desc',
				},
			}),
		);
	}

	private normalizeTimes(time: Date, from?: Date, to?: Date) {
		let normalizedFromTime: Date | undefined;
		let normalizedToTime: Date | undefined;
		const timeDifference = dayjs().diff(time, 'millisecond', true);

		if (from) {
			normalizedFromTime = dayjs(from).subtract(timeDifference, 'millisecond').toDate();
		}
		if (to) {
			normalizedToTime = dayjs(to).subtract(timeDifference, 'millisecond').toDate();
		}

		return { normalizedFromTime, normalizedToTime, timeDifference };
	}

	/**
	 * Get timeseries data based on the assetId and propertySetName from the DB
	 *
	 * @param args - the query and parameters based arguments to get the time series data
	 */
	public getTimeSeriesFromDB(
		args: IGetTimeSeriesParams & IGetTimeseriesQuery,
	): Observable<ITimeSeriesDataItemResponse[]> {
		const { assetId, propertySetName } = args;

		return this.findFirstTime(assetId, propertySetName).pipe(
			switchMap((item) => {
				if (!item) {
					throw new HttpException('timeSeriesItem not found', HttpStatus.NOT_FOUND);
				}

				const { normalizedFromTime, normalizedToTime, timeDifference } =
					this.normalizeTimes(item.time, args.from, args.to);

				return from(
					this.prismaService.timeSeriesDataItem.findMany({
						where: {
							timeSeriesItemAssetId: assetId,
							timeSeriesItemPropertySetName: propertySetName,
							time: {
								gte: normalizedFromTime,
								lte: normalizedToTime,
							},
						},
						take: args.limit,
						orderBy: {
							time: args.sort,
						},
					}),
				).pipe(map((result) => ({ result, timeDifference })));
			}),
			map(({ result, timeDifference }) => {
				if (!Array.isArray(result)) {
					throw new HttpException(
						'Unexpected result format',
						HttpStatus.INTERNAL_SERVER_ERROR,
					);
				}

				return result.map((item) => ({
					time: dayjs(item.time).add(timeDifference, 'millisecond').toDate(),
					...this.prismaService.selectKeysFromJSON(item.data, args.select),
				}));
			}),
		);
	}

	// 	return from(
	// 		this.prismaService.timeSeriesDataItem.findMany({
	// 			where: {
	// 				timeSeriesItemAssetId: assetId,
	// 				timeSeriesItemPropertySetName: propertySetName,
	// 				time: {
	// 					gte: args.from,
	// 					lte: args.to,
	// 				},
	// 			},
	// 			take: args.limit,
	// 			orderBy: {
	// 				time: args.sort,
	// 			},
	// 		}),
	// 	).pipe(
	// 		map((items) => {
	// 			return items.map((item) => ({
	// 				time: item.time,
	// 				...this.prismaService.selectKeysFromJSON(item.data, args.select),
	// 			}));
	// 		}),
	// 		catchError((err: Error) => {
	// 			throw err;
	// 		}),
	// 	);
	// }

	/**
	 * Get all timeseries data
	 */
	public getAllTimeSeries(): Observable<ITimeSeriesItemResponse[]> {
		return from(this.prismaService.timeSeriesItem.findMany()).pipe(
			map((items) =>
				items.map((item) => ({
					assetId: item.assetId,
					propertySetName: item.propertySetName,
					variables: item.variables as {
						name: string;
						unit: string;
					}[],
				})),
			),
		);
	}

	/**
	 * Get timeseries data based on the assetId
	 */
	public getTimeSeriesForAsset(assetId: string): Observable<ITimeSeriesItemResponse[]> {
		return from(
			this.prismaService.timeSeriesItem.findMany({
				where: {
					assetId,
				},
			}),
		).pipe(
			map((items) =>
				items.map((item) => ({
					assetId: item.assetId,
					propertySetName: item.propertySetName,
					variables: item.variables as {
						name: string;
						unit: string;
					}[],
				})),
			),
		);
	}
}
