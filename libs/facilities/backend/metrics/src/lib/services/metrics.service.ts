import { checkPumpStatus } from '@frontend/facilities/backend/utils';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'common-backend-prisma';
import { XdTimeseriesService } from 'facilities-backend-timeseries';
import { ITimeSeriesPumpReport } from 'facilities-shared-models';
import { from, map, switchMap } from 'rxjs';
import dayjs = require('dayjs');
import { pick } from 'lodash';

@Injectable()
export class XdMetricsService {
	constructor(
		@Inject(forwardRef(() => PrismaService))
		private readonly prismaService: PrismaService,

		private readonly timeSeriesService: XdTimeseriesService,
	) {}

	/**
	 * Get the metrics for the asset
	 *
	 * @param assetId
	 * @param propertySetName
	 */
	public getMetricsForAsset(assetId: string, propertySetName: string) {
		return this.timeSeriesService
			.getTimeSeries({
				assetId,
				propertySetName,
				from: dayjs().subtract(60, 'minute').toDate(),
			})
			.pipe(
				switchMap((data) => {
					return this.upsertMetrics(assetId, propertySetName, data);
				}),
			);
	}

	/**
	 * Calculates and upserts the metrics for the asset
	 *
	 * @param assetId
	 * @param propertySetName
	 * @param data
	 * @private
	 */
	private upsertMetrics(assetId: string, propertySetName: string, data: unknown): any {
		switch (propertySetName) {
			case 'PumpData': {
				const { status, indicatorMsg, metrics } = checkPumpStatus(
					data as unknown as ITimeSeriesPumpReport[],
				);
				return from(
					this.prismaService.metrics.deleteMany({
						where: {
							assetId: assetId,
						},
					}),
				).pipe(
					switchMap(() => {
						return this.prismaService.asset
							.update({
								where: {
									assetId,
								},
								data: {
									status,
									indicatorMsg,
									metrics: {
										create: metrics,
									},
								},
							})
							.metrics();
					}),
					map((metrics) =>
						metrics.map((m) => ({
							...pick(m, [
								'name',
								'min',
								'max',
								'variance',
								'standardDeviation',
								'coefficientOfVariation',
								'mean',
							]),
						})),
					),
				);
			}
		}
	}
}
