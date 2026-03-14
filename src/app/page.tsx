"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Header from "@/components/Header";
import DateRangePicker from "@/components/DateRangePicker";
import HorizonSlider from "@/components/HorizonSlider";
import ChartComponent from "@/components/ChartComponent";
import StatsCards from "@/components/StatsCards";
import { fetchActuals, fetchForecasts } from "@/lib/api";
import { buildChartData, computeMetrics } from "@/lib/dataUtils";
import { FuelHHRecord, WindForRecord, ChartDataPoint, ErrorMetrics } from "@/lib/types";

export default function HomePage() {
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-01-07");
  const [horizonHours, setHorizonHours] = useState(4);

  const [actuals, setActuals] = useState<FuelHHRecord[]>([]);
  const [forecasts, setForecasts] = useState<WindForRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [actualsData, forecastData] = await Promise.all([
        fetchActuals(startDate, endDate),
        fetchForecasts(startDate, endDate),
      ]);
      setActuals(actualsData);
      setForecasts(forecastData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch data from BMRS API"
      );
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const chartData: ChartDataPoint[] = useMemo(() => {
    if (actuals.length === 0) return [];
    return buildChartData(actuals, forecasts, horizonHours);
  }, [actuals, forecasts, horizonHours]);

  const metrics: ErrorMetrics = useMemo(() => {
    return computeMetrics(chartData);
  }, [chartData]);

  const handleStartDateChange = (date: string) => {
    if (date > endDate) {
      setEndDate(date);
    }
    setStartDate(date);
  };

  const handleEndDateChange = (date: string) => {
    if (date < startDate) {
      setStartDate(date);
    }
    setEndDate(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
          />
          <HorizonSlider value={horizonHours} onChange={setHorizonHours} />
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-400">
                Failed to load data
              </p>
              <p className="text-xs text-red-400/70 mt-0.5">{error}</p>
              <button
                onClick={loadData}
                className="mt-2 text-xs font-semibold text-red-300 hover:text-red-200 
                           underline underline-offset-2 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <StatsCards metrics={metrics} loading={loading} />

        <ChartComponent
          data={chartData}
          loading={loading}
          horizonHours={horizonHours}
        />

        <footer className="text-center py-4 border-t border-slate-800/50">
          <p className="text-xs text-slate-500">
            Data source:{" "}
            <a
              href="https://bmrs.elexon.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-500/70 hover:text-cyan-400 transition-colors"
            >
              BMRS Elexon
            </a>{" "}
            · Wind generation outturn (FUELHH) & forecast (WINDFOR) · January
            2024
          </p>
        </footer>
      </main>
    </div>
  );
}
