import { CommonModule, Location } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	OnInit,
	Signal,
	signal,
	ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { XdDetailsFacade } from '@frontend/facilities/frontend/domain';
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
import { Colors } from './models/colors';
import { EMetricsCategory } from './models/metrics-category.enum';
import { METRIC_CATEGORY_COLOR_INFORMATION } from './models/metrics-category-information.map';
import { PUMP_METRICS_FULL_NAME_MAP } from './models/pump-metrics-full-name.map';

@Component({
	selector: 'lib-detail',
	standalone: true,
	imports: [CommonModule, IxModule, NgxEchartsModule, LockModalComponent, RouterLink],
	templateUrl: './facility-detail.page.html',
	styleUrl: './facility-detail.page.scss',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacilityDetailPage implements OnInit {
	protected readonly notificationText = computed(() => {
		const facility = this.facility();
		if (!facility) return undefined;

		switch (facility.cases.length) {
			case 0:
				return 'There are no cases regarding this facility';
			case 1:
				return 'There is one case regarding this facility';
			default:
				return `There are ${facility.cases.length} cases regarding this facility`;
		}
	});

	protected theme = signal(convertThemeName(themeSwitcher.getCurrentTheme()));
	protected readonly locked = signal(true);
	protected readonly StatusToColorRecord = StatusToColorRecord;
	protected readonly _assetId = this.route.snapshot.params['id'];
	private readonly _currentTime = new Date();
	private readonly _28MinutesAgo = new Date(this._currentTime.getTime() - 28 * 60 * 1000);
	private readonly _detailsFacade = inject(XdDetailsFacade);
	protected readonly facility = toSignal(this._detailsFacade.getFacility(this._assetId));
	protected readonly pumpData = toSignal(this._detailsFacade.getPumpData(this._assetId));
	protected readonly envData = toSignal(this._detailsFacade.getEnvironmentData(this._assetId));
	protected readonly metricsData = toSignal(
		this._detailsFacade.getMetrics(this._assetId, 'PumpData'),
	);

	private readonly defaultOptions: EChartsOption = {
		tooltip: {
			trigger: 'axis',
			renderMode: 'auto',
			axisPointer: {
				axis: 'auto',
				crossStyle: {
					textStyle: {
						precision: 2,
					},
				},
			},
		},
		xAxis: {
			type: 'time',
			name: 'Time',
			nameLocation: 'middle',
			nameGap: 30,
		},
		yAxis: {
			type: 'value',
			name: 'Value',
			nameLocation: 'middle',
			nameGap: 30,
		},
		legend: {
			top: 30,
			left: 20,
			right: 20,
		},
		grid: {
			top: 80,
		},
	};
	private readonly barChartOptions: EChartsOption = {
		tooltip: {
			trigger: 'axis',
			renderMode: 'auto',
			axisPointer: {
				axis: 'auto',
				crossStyle: {
					textStyle: {
						precision: 2,
					},
				},
			},
		},
		legend: {
			top: 30,
			left: 80,
		},
		grid: {
			top: 80,
		},
		title: {
			text: 'Pump Metrics',
			left: 'center',
		},
		yAxis: {
			type: 'value',
			nameLocation: 'middle',
		},
	};
	private readonly pumpOptions: EChartsOption = {
		...this.defaultOptions,
		title: {
			text: 'Pump Data',
			left: 'center',
		},
		series: [
			{
				name: 'Flow (l/s)',
				type: 'line',
				itemStyle: { color: Colors.WATER },
				lineStyle: { color: Colors.WATER },
			},
			{
				name: 'Motor Current (V)',
				type: 'line',
				itemStyle: { color: Colors.MOTORCURRENT },
				lineStyle: { color: Colors.MOTORCURRENT },
			},
			{
				name: 'Stuffing Box Temperature (°C)',
				type: 'line',
				itemStyle: { color: Colors.TEMPERATURE },
				lineStyle: { color: Colors.TEMPERATURE },
			},
			{
				name: 'Pressure In (hPa)',
				type: 'line',
				itemStyle: { color: Colors.PRESSURE1 },
				lineStyle: { color: Colors.PRESSURE1 },
			},
			{
				name: 'Pressure Out (hPa)',
				type: 'line',
				itemStyle: { color: Colors.PRESSURE2 },
				lineStyle: { color: Colors.PRESSURE2 },
			},
		],
	};
	protected readonly pumpChart: Signal<EChartsOption | undefined> = computed(() => {
		const pumpData = this.pumpData();
		const pumpChart = {
			...this.pumpOptions,
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
	private readonly envOptions: EChartsOption = {
		...this.defaultOptions,
		title: {
			text: 'Environment Data',
			left: 'center',
		},
		series: [
			{
				name: 'Temperature (°C)',
				type: 'line',
				itemStyle: { color: Colors.TEMPERATURE },
				lineStyle: { color: Colors.TEMPERATURE },
			},
			{
				name: 'Humidity (%)',
				type: 'line',
				itemStyle: { color: Colors.WATER },
				lineStyle: { color: Colors.WATER },
			},
			{
				name: 'Pressure (kPa)',
				type: 'line',
				itemStyle: { color: Colors.PRESSURE1 },
				lineStyle: { color: Colors.PRESSURE1 },
			},
		],
	};

	protected readonly envChart: Signal<EChartsOption | undefined> = computed(() => {
		const envData = this.envData();

		if (!envData) return undefined;

		const envChart = {
			...this.envOptions,
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

		return defaults(this.barChartOptions, {
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
		protected route: ActivatedRoute,
		protected location: Location,
		private readonly _modalService: ModalService,
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

	mapNth(n: number) {
		switch (n) {
			case 1:
				return 'First';
			case 2:
				return 'Second';
			case 3:
				return `${n}rd`;
			default:
				return `${n}th`;
		}
	}
}
