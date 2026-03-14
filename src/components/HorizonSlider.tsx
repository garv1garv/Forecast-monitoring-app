"use client";

import React from "react";

interface HorizonSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function HorizonSlider({ value, onChange }: HorizonSliderProps) {
  const getHorizonLabel = (h: number): string => {
    if (h === 0) return "Now-cast";
    if (h <= 4) return "Short-term";
    if (h <= 12) return "Intra-day";
    if (h <= 24) return "Day-ahead";
    return "2-Day Ahead";
  };

  const getHorizonColor = (h: number): string => {
    if (h <= 4) return "text-emerald-400";
    if (h <= 12) return "text-cyan-400";
    if (h <= 24) return "text-blue-400";
    return "text-violet-400";
  };

  return (
    <div className="rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 p-5 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-5 h-5 text-violet-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Forecast Horizon
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tabular-nums">
              {value}
            </span>
            <span className="text-sm font-medium text-slate-400">hours</span>
          </div>
          <span
            className={`text-sm font-semibold ${getHorizonColor(value)} 
            px-2.5 py-1 rounded-full bg-slate-900/60 border border-slate-700/50`}
          >
            {getHorizonLabel(value)}
          </span>
        </div>

        <div className="relative">
          <input
            id="horizon-slider"
            type="range"
            min="0"
            max="48"
            step="1"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer
                       bg-gradient-to-r from-emerald-500 via-cyan-500 via-blue-500 to-violet-500
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                       [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/30
                       [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
                       [&::-webkit-slider-thumb]:hover:scale-125
                       [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
                       [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white
                       [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer"
          />
        </div>

        <div className="flex justify-between text-xs text-slate-500 font-mono">
          <span>0h</span>
          <span>12h</span>
          <span>24h</span>
          <span>36h</span>
          <span>48h</span>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500 italic">
        Show the latest forecast published at least {value}h before each target
        time
      </p>
    </div>
  );
}
