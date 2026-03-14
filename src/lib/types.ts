export interface FuelHHRecord {
  dataset: string;
  publishTime: string;
  startTime: string;
  settlementDate: string;
  settlementPeriod: number;
  fuelType: string;
  generation: number;
}

export interface WindForRecord {
  dataset: string;
  publishTime: string;
  startTime: string;
  generation: number;
}

export interface ChartDataPoint {
  time: string;
  actual: number | null;
  forecast: number | null;
  error: number | null;
}

export interface ErrorMetrics {
  mae: number;
  rmse: number;
  maxError: number;
  mape: number;
  dataPoints: number;
}

export interface DateRange {
  start: string;
  end: string;
}
