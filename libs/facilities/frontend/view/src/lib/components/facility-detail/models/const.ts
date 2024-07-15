import { EChartsOption } from 'echarts';

import { colors } from './colors.enum';

/**
 * There is an insane amount of options that can be set for the echarts
 * since the facility-details page is already crowded enough I decided to
 * move all these options to a separate file.
 */
export const defaultOptions: EChartsOption = {
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

export const barChartOptions: EChartsOption = {
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

export const pumpOptions: EChartsOption = {
    ...defaultOptions,
    title: {
        text: 'Pump Data',
        left: 'center',
    },
    series: [
        {
            name: 'Flow (l/s)',
            type: 'line',
            itemStyle: { color: colors.WATER },
            lineStyle: { color: colors.WATER },
        },
        {
            name: 'Motor Current (V)',
            type: 'line',
            itemStyle: { color: colors.MOTORCURRENT },
            lineStyle: { color: colors.MOTORCURRENT },
        },
        {
            name: 'Stuffing Box Temperature (°C)',
            type: 'line',
            itemStyle: { color: colors.TEMPERATURE },
            lineStyle: { color: colors.TEMPERATURE },
        },
        {
            name: 'Pressure In (hPa)',
            type: 'line',
            itemStyle: { color: colors.PRESSURE1 },
            lineStyle: { color: colors.PRESSURE1 },
        },
        {
            name: 'Pressure Out (hPa)',
            type: 'line',
            itemStyle: { color: colors.PRESSURE2 },
            lineStyle: { color: colors.PRESSURE2 },
        },
    ],
};

export const environmentOptions: EChartsOption = {
    ...defaultOptions,
    title: {
        text: 'Environment Data',
        left: 'center',
    },
    series: [
        {
            name: 'Temperature (°C)',
            type: 'line',
            itemStyle: { color: colors.TEMPERATURE },
            lineStyle: { color: colors.TEMPERATURE },
        },
        {
            name: 'Humidity (%)',
            type: 'line',
            itemStyle: { color: colors.WATER },
            lineStyle: { color: colors.WATER },
        },
        {
            name: 'Pressure (kPa)',
            type: 'line',
            itemStyle: { color: colors.PRESSURE1 },
            lineStyle: { color: colors.PRESSURE1 },
        },
    ],
};
