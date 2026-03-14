"use client";

import React from "react";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangePickerProps) {
  return (
    <div className="rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 p-5 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-5 h-5 text-cyan-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Date Range
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="start-date"
            className="block text-xs font-medium text-slate-400 mb-1.5"
          >
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            min="2024-01-01"
            max="2024-01-31"
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/70 border border-slate-600/50 text-slate-200 text-sm font-mono
                       focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40
                       transition-all duration-200 hover:border-slate-500/70 cursor-pointer
                       [color-scheme:dark]"
          />
        </div>

        <div>
          <label
            htmlFor="end-date"
            className="block text-xs font-medium text-slate-400 mb-1.5"
          >
            End Date
          </label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            min="2024-01-01"
            max="2024-01-31"
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/70 border border-slate-600/50 text-slate-200 text-sm font-mono
                       focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40
                       transition-all duration-200 hover:border-slate-500/70 cursor-pointer
                       [color-scheme:dark]"
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500 italic">
        Data available for January 2024 only
      </p>
    </div>
  );
}
