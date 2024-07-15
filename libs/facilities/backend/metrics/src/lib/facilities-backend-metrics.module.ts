import { Module } from '@nestjs/common';
import { XdPrismaModule } from 'common-backend-prisma';
import { XdTimeseriesModule } from 'facilities-backend-timeseries';

import { XdMetricsController } from './controller/metrics.controller';
import { XdMetricsService } from './services/metrics.service';

@Module({
	imports: [XdTimeseriesModule, XdPrismaModule],
	controllers: [XdMetricsController],
	providers: [XdMetricsService],
	exports: [XdMetricsService],
})
export class XdMetricsModule {}
