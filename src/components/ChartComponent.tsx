"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ChartDataPoint } from "@/lib/types";
import { format, parseISO } from "date-fns";

interface ChartComponentProps {
  data: ChartDataPoint[];
  loading: boolean;
  horizonHours: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const timeStr = label
    ? format(parseISO(label), "dd MMM HH:mm")
    : "";

  const actual = payload.find((p: any) => p.dataKey === "actual");
  const forecast = payload.find((p: any) => p.dataKey === "forecast");
  const actualVal = actual?.value;
  const forecastVal = forecast?.value;

  const error =
    actualVal != null && forecastVal != null
      ? Math.abs(actualVal - forecastVal)
      : null;

  return (
    <div className="rounded-lg bg-slate-900/95 backdrop-blur-md border border-slate-600/50 p-3 shadow-2xl min-w-[180px]">
      <p className="text-xs font-mono text-slate-400 mb-2">{timeStr}</p>
      <div className="space-y-1.5">
        {actualVal != null && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-xs text-slate-300">Actual</span>
            </div>
            <span className="text-sm font-bold text-blue-400 tabular-nums">
              {actualVal.toLocaleString()} MW
            </span>
          </div>
        )}
        {forecastVal != null && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-300">Forecast</span>
            </div>
            <span className="text-sm font-bold text-emerald-400 tabular-nums">
              {forecastVal.toLocaleString()} MW
            </span>
          </div>
        )}
        {error != null && (
          <div className="flex items-center justify-between gap-4 pt-1.5 border-t border-slate-700/50">
            <span className="text-xs text-slate-400">Error</span>
            <span className="text-sm font-bold text-amber-400 tabular-nums">
              {error.toLocaleString()} MW
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChartComponent({
  data,
  loading,
  horizonHours,
}: ChartComponentProps) {
  const formattedData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      timeLabel: d.time,
    }));
  }, [data]);

  if (loading) {
    return (
      <div className="rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-5 w-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span className="text-sm text-slate-400">
            Fetching data from BMRS Elexon API...
          </span>
        </div>
        <div className="h-[400px] bg-slate-900/40 rounded-lg animate-pulse flex items-center justify-center">
          <div className="text-slate-600 text-sm">Loading chart data...</div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 p-6 shadow-xl">
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-center">
            <svg
              className="w-12 h-12 text-slate-600 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 3v18h18" />
              <path d="M7 16l4-8 4 4 4-8" />
            </svg>
            <p className="text-slate-400 text-sm">
              No data for selected range. Adjust the date range.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Actual vs. Forecast Generation
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Wind power generation (MW) · Horizon: {horizonHours}h ahead
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full bg-blue-500" />
            <span className="text-slate-400">Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full bg-emerald-500 opacity-80" style={{ borderTop: '1px dashed' }} />
            <span className="text-slate-400">Forecast</span>
          </div>
        </div>
      </div>

      <div className="h-[400px] md:h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              strokeOpacity={0.5}
              vertical={false}
            />

            <XAxis
              dataKey="timeLabel"
              tickFormatter={(val) => {
                try {
                  return format(parseISO(val), "dd/MM HH:mm");
                } catch {
                  return val;
                }
              }}
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickLine={{ stroke: "#475569" }}
              interval="preserveStartEnd"
              minTickGap={50}
            />

            <YAxis
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickLine={{ stroke: "#475569" }}
              tickFormatter={(val) =>
                val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val
              }
              label={{
                value: "Generation (MW)",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#64748b", fontSize: 12 },
                offset: 0,
              }}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ display: "none" }} />

            <Area
              type="monotone"
              dataKey="actual"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#actualGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#3b82f6", stroke: "#1e293b", strokeWidth: 2 }}
              name="Actual"
              connectNulls={false}
            />

            <Area
              type="monotone"
              dataKey="forecast"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="6 3"
              fill="url(#forecastGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#10b981",
                stroke: "#1e293b",
                strokeWidth: 2,
              }}
              name="Forecast"
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
