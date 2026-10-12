import React from 'react';
import { Filter, RotateCcw, Search, Sparkles, Check } from 'lucide-react';
import { FilterState } from '../types/outage';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  options: {
    province?: string[];
    status?: string[];
    finding?: string[];
    rfo?: string[];
    concern?: string[];
  };
  months: string[];
  dates: string[];
  onReset: () => void;
  isRepairedMode: boolean;
  setIsRepairedMode: (val: boolean) => void;
  matchCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  options,
  months,
  dates,
  onReset,
  isRepairedMode,
  setIsRepairedMode,
  matchCount,
  totalCount,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 mb-6 shadow-xs">
      {/* Top Filter Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            NOC Telemetry Filters
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono tabular-nums">
            ({matchCount.toLocaleString()} / {totalCount.toLocaleString()} records)
          </span>
        </div>

        {/* Data Mode Switch (Raw vs Repaired by Agent) */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-md p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setIsRepairedMode(false)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                !isRepairedMode
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Raw Sheet Data
            </button>
            <button
              onClick={() => setIsRepairedMode(true)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                isRepairedMode
                  ? 'bg-teal-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Data Doctor Cleaned</span>
            </button>
          </div>

          <button
            onClick={onReset}
            className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Select Filters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 mt-3">
        {/* Month */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Month
          </label>
          <select
            value={filters.month}
            onChange={(e) => setFilters((prev) => ({ ...prev, month: e.target.value, date: 'ALL' }))}
            className="w-full h-8 px-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500"
          >
            <option value="ALL">All Months</option>
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Restored Date
          </label>
          <select
            value={filters.date}
            onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))}
            className="w-full h-8 px-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500"
          >
            <option value="ALL">All Dates</option>
            {dates.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Province */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Province
          </label>
          <select
            value={filters.province}
            onChange={(e) => setFilters((prev) => ({ ...prev, province: e.target.value }))}
            className="w-full h-8 px-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500"
          >
            <option value="ALL">All Provinces</option>
            {(options.province || []).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Final Status */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Final Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="w-full h-8 px-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500"
          >
            <option value="ALL">All Statuses</option>
            {(options.status || []).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Findings */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Findings / Issue
          </label>
          <select
            value={filters.finding}
            onChange={(e) => setFilters((prev) => ({ ...prev, finding: e.target.value }))}
            className="w-full h-8 px-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500 truncate"
          >
            <option value="ALL">All Findings</option>
            {(options.finding || []).map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* RFO */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            RFO (Root Cause)
          </label>
          <select
            value={filters.rfo}
            onChange={(e) => setFilters((prev) => ({ ...prev, rfo: e.target.value }))}
            className="w-full h-8 px-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500 truncate"
          >
            <option value="ALL">All RFO</option>
            {(options.rfo || []).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Search Text
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="NAP, municipality..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="w-full h-8 pl-6 pr-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500"
            />
            <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
