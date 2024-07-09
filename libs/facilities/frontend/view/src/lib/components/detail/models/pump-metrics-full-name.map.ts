import { EPumpMetricsName } from 'facilities-shared-models';

export const PUMP_METRICS_FULL_NAME_MAP: Record<EPumpMetricsName, string> = {
    [EPumpMetricsName.MotorCurrent]: 'Motor Current (V)',
    [EPumpMetricsName.PressureOut]: 'Pressure Out',
    [EPumpMetricsName.StuffingBoxTemperature]: 'Stuffing Box Temperature (°C)',
    [EPumpMetricsName.PressureIn]: 'Pressure In (hPa)',
    [EPumpMetricsName.Flow]: 'Flow (l/s)'
}
