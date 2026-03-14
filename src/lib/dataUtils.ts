import { FuelHHRecord, WindForRecord, ChartDataPoint, ErrorMetrics } from "./types";

export function buildChartData(
  actuals: FuelHHRecord[],
  forecasts: WindForRecord[],
  horizonHours: number
): ChartDataPoint[] {
  const forecastsByTarget = new Map<string, WindForRecord[]>();
  for (const fc of forecasts) {
    const key = fc.startTime;
    if (!forecastsByTarget.has(key)) {
      forecastsByTarget.set(key, []);
    }
    forecastsByTarget.get(key)!.push(fc);
  }

  const chartData: ChartDataPoint[] = [];

  for (const actual of actuals) {
    const targetTime = new Date(actual.startTime).getTime();
    const horizonMs = horizonHours * 60 * 60 * 1000;
    const cutoff = targetTime - horizonMs;

    const targetHour = new Date(actual.startTime);
    targetHour.setMinutes(0, 0, 0);
    const targetHourISO = targetHour.toISOString();

    const candidates = [
      ...(forecastsByTarget.get(actual.startTime) || []),
      ...(forecastsByTarget.get(targetHourISO) || []),
    ];

    const eligible = candidates.filter((fc) => {
      const publishTime = new Date(fc.publishTime).getTime();
      return publishTime <= cutoff;
    });

    let bestForecast: WindForRecord | null = null;
    let bestPublishTime = -Infinity;
    for (const fc of eligible) {
      const pt = new Date(fc.publishTime).getTime();
      if (pt > bestPublishTime) {
        bestPublishTime = pt;
        bestForecast = fc;
      }
    }

    const forecastValue = bestForecast ? bestForecast.generation : null;
    const errorValue =
      forecastValue !== null
        ? Math.abs(actual.generation - forecastValue)
        : null;

    chartData.push({
      time: actual.startTime,
      actual: actual.generation,
      forecast: forecastValue,
      error: errorValue,
    });
  }

  return chartData;
}

export function computeMetrics(data: ChartDataPoint[]): ErrorMetrics {
  const pairs = data.filter(
    (d) => d.actual !== null && d.forecast !== null
  ) as Array<{ actual: number; forecast: number; error: number }>;

  if (pairs.length === 0) {
    return { mae: 0, rmse: 0, maxError: 0, mape: 0, dataPoints: 0 };
  }

  const errors = pairs.map((p) => Math.abs(p.actual - p.forecast));
  const pctErrors = pairs.map((p) =>
    p.actual !== 0 ? (Math.abs(p.actual - p.forecast) / p.actual) * 100 : 0
  );

  const mae = errors.reduce((s, e) => s + e, 0) / errors.length;
  const rmse = Math.sqrt(
    errors.reduce((s, e) => s + e * e, 0) / errors.length
  );
  const maxError = Math.max(...errors);
  const mape = pctErrors.reduce((s, e) => s + e, 0) / pctErrors.length;

  return {
    mae: Math.round(mae),
    rmse: Math.round(rmse),
    maxError: Math.round(maxError),
    mape: Math.round(mape * 10) / 10,
    dataPoints: pairs.length,
  };
}
