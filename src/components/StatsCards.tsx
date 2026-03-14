"use client";

import React from "react";
import { ErrorMetrics } from "@/lib/types";

interface StatsCardsProps {
  metrics: ErrorMetrics;
  loading: boolean;
}

interface StatCardData {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  gradient: string;
  textColor: string;
}

export default function StatsCards({ metrics, loading }: StatsCardsProps) {
  const cards: StatCardData[] = [
    {
      label: "Mean Abs. Error",
      value: loading ? "—" : metrics.mae.toLocaleString(),
      unit: "MW",
      gradient: "from-blue-500/20 to-cyan-500/20",
      textColor: "text-blue-400",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: "RMSE",
      value: loading ? "—" : metrics.rmse.toLocaleString(),
      unit: "MW",
      gradient: "from-emerald-500/20 to-teal-500/20",
      textColor: "text-emerald-400",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      label: "Max Error",
      value: loading ? "—" : metrics.maxError.toLocaleString(),
      unit: "MW",
      gradient: "from-amber-500/20 to-orange-500/20",
      textColor: "text-amber-400",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
    },
    {
      label: "MAPE",
      value: loading ? "—" : `${metrics.mape}`,
      unit: "%",
      gradient: "from-violet-500/20 to-purple-500/20",
      textColor: "text-violet-400",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      ),
    },
    {
      label: "Data Points",
      value: loading ? "—" : metrics.dataPoints.toLocaleString(),
      unit: "pts",
      gradient: "from-cyan-500/20 to-sky-500/20",
      textColor: "text-cyan-400",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M4 7h16M4 12h16M4 17h8" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-xl bg-gradient-to-br ${card.gradient} 
                      border border-slate-700/40 p-4 shadow-lg
                      hover:border-slate-600/60 transition-all duration-300
                      hover:shadow-xl hover:-translate-y-0.5`}
        >
          <div className={`${card.textColor} mb-2 opacity-80`}>
            {card.icon}
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-2xl font-bold text-white tabular-nums ${
                loading ? "animate-pulse" : ""
              }`}
            >
              {card.value}
            </span>
            <span className="text-xs font-medium text-slate-400">
              {card.unit}
            </span>
          </div>
          <p className="mt-1 text-xs font-medium text-slate-400">
            {card.label}
          </p>
        </div>
      ))}
    </div>
  );
}
