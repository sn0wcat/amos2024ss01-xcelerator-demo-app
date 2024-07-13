import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ESwaggerTag } from 'common-backend-swagger';
import { GetTimeSeriesParamsDto } from 'facilities-backend-timeseries';

import { XdMetricsService } from '../services/metrics.service';

@ApiTags(ESwaggerTag.METRICS)
@Controller('metrics')
export class XdMetricsController {
    constructor(private readonly metricsService: XdMetricsService) {

    }

    /**
     * Get the metrics for the asset
     *
     * @param params
     */
    @Get(':assetId/:propertySetName')
    @ApiOkResponse({ description: 'Returns metrics data for an asset' })
    public getMetricsForAsset(
        @Param() params: GetTimeSeriesParamsDto,
    ) {
        return this.metricsService.getMetricsForAsset(params.assetId, params.propertySetName);
    }
}
