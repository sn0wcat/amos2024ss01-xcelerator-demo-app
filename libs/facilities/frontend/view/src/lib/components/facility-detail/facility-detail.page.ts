import { CommonModule, Location } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	OnInit,
	Signal,
	signal,
	ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FacilityDetailFacade } from '@frontend/facilities/frontend/domain';
import { StatusToColorRecord } from '@frontend/facilities/frontend/models';
import { themeSwitcher } from '@siemens/ix';
import { IxModule, ModalService } from '@siemens/ix-angular';
import { convertThemeName, registerTheme } from '@siemens/ix-echarts';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { IPumpMetrics } from 'facilities-shared-models';
import { defaults, map } from 'lodash';
import { NgxEchartsModule } from 'ngx-echarts';
import { $enum } from 'ts-enum-util';

import LockModalComponent from './lock-modal/lock-modal.component';
import { barChartOptions, environmentOptions, pumpOptions } from './models/const';
import { EMetricsCategory } from './models/metrics-category.enum';
import { METRIC_CATEGORY_COLOR_INFORMATION } from './models/metrics-category-information.map';
import { PUMP_METRICS_FULL_NAME_MAP } from './models/pump-metrics-full-name.map';

@Component({
	selector: 'lib-facility-detail',
	standalone: true,
	imports: [CommonModule, IxModule, NgxEchartsModule, LockModalComponent, RouterLink],
	templateUrl: './facility-detail.page.html',
	styleUrl: './facility-detail.page.scss',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacilityDetailPage implements OnInit {

    protected readonly StatusToColorRecord = StatusToColorRecord;
    protected readonly assetId = this._route.snapshot.params['id'];

    protected readonly facility = toSignal(this._detailsFacade.getFacility(this.assetId));

    protected readonly theme = signal(convertThemeName(themeSwitcher.getCurrentTheme()));
    protected readonly locked = signal(true);

    private readonly pumpData = toSignal(this._detailsFacade.getPumpData(this.assetId));
    private readonly envData = toSignal(this._detailsFacade.getEnvironmentData(this.assetId));
    private readonly metricsData = toSignal(this._detailsFacade.getPumpMetrics(this.assetId));

	protected readonly pumpChart: Signal<EChartsOption | undefined> = computed(() => {
		const pumpData = this.pumpData();
		const pumpChart = {
			...pumpOptions,
		};

		if (!pumpData) return pumpChart;

		if (!pumpChart.series || !(pumpChart.series instanceof Array)) return undefined;

		pumpChart.series[0].data = pumpData.map((item) => [item.time, item['Flow']]);
		pumpChart.series[1].data = pumpData.map((item) => [item.time, item['MotorCurrent']]);
		pumpChart.series[2].data = pumpData.map((item) => [
			item.time,
			item['StuffingBoxTemperature'],
		]);
		pumpChart.series[3].data = pumpData.map((item) => [item.time, item['PressureIn']]);
		pumpChart.series[4].data = pumpData.map((item) => [item.time, item['PressureOut']]);
		return pumpChart;
	});

	protected readonly envChart: Signal<EChartsOption | undefined> = computed(() => {
		const envData = this.envData();

		if (!envData) return undefined;

		const envChart = {
			...environmentOptions,
		};

		if (!envChart.series || !(envChart.series instanceof Array)) return undefined;

		envChart.series[0].data = envData.map((item) => [item.time, item['Temperature']]);
		envChart.series[1].data = envData.map((item) => [item.time, item['Humidity']]);
		envChart.series[2].data = envData.map((item) => [item.time, item['Pressure']]);
		return envChart;
	});

	protected readonly metricsChart: Signal<EChartsOption | undefined> = computed(() => {
		const metricsData = this.metricsData();

		if (!metricsData) return undefined;

		const xAxisData = map(metricsData, (item) =>
			PUMP_METRICS_FULL_NAME_MAP[item.name].replace(/ /g, '\n').trim(),
		);
		const seriesKeys = $enum(EMetricsCategory).getValues();

		const seriesData = map(seriesKeys, (key) => {
			return {
				name: METRIC_CATEGORY_COLOR_INFORMATION[key].abbreviation,
				data: map(metricsData, (item: IPumpMetrics) => item[key]),
				type: 'bar',
				emphasis: { focus: 'series' },
				itemStyle: { color: METRIC_CATEGORY_COLOR_INFORMATION[key].color },
			};
		});

		return defaults(barChartOptions, {
			xAxis: {
				type: 'category',
				data: xAxisData,
				nameLocation: 'middle',
				axisLabel: {
					width: 100,
					overflow: 'truncate',
					interval: 0,
				},
			},
			series: seriesData,
		});
	});

	constructor(
		private readonly _route: ActivatedRoute,
		protected readonly location: Location,
		private readonly _modalService: ModalService,
        private readonly _detailsFacade: FacilityDetailFacade,
	) {}

	ngOnInit() {
		registerTheme(echarts);

		themeSwitcher.themeChanged.on((theme: string) => {
			this.theme.set(convertThemeName(theme));
		});
	}

	async changeLocked() {
		const currentValue = this.locked();
		const instance = await this._modalService.open({
			content: LockModalComponent,
			data: { locked: currentValue },
		});

		// modal closes on confirm and dismisses on cancel
		instance.onClose.on(() => {
			this.locked.set(!currentValue);
		});
	}

    getCasesText(cases: number,){
        switch (cases) {
            case 0:
                return 'There are no cases regarding this facility';
            case 1:
                return 'There is one case regarding this facility';
            default:
                return `There are ${cases} cases regarding this facility`;
        }
    }

}
