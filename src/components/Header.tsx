"use client";

import React from "react";

export default function Header() {
  return (
    <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 px-6 py-5 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-blue-500/10 animate-pulse" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/25">
            <svg
              className="w-7 h-7 text-white animate-[spin_4s_linear_infinite]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <path d="M12 10V2L8 6" />
              <path d="M12 14l6 6 -2-5" />
              <path d="M10 12l-8 2 5-2" />
            </svg>
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Wind Forecast Monitor
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              UK National Grid · BMRS Elexon Data · January 2024
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">
            Connected
          </span>
        </div>
      </div>
    </header>
  );
}
