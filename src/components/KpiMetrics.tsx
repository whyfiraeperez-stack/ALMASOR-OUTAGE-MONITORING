import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Layers, Activity, Sparkles } from 'lucide-react';

interface KpiMetricsProps {
  totalRecords: number;
  pendingCount: number;
  restoredCount: number;
  pendingRate: string;
  isRepairedMode: boolean;
  formulaErrorsCount: number;
  blankFixedCount: number;
  onJumpToNapDown: () => void;
  onOpenDataDoctor: () => void;
}

export const KpiMetrics: React.FC<KpiMetricsProps> = ({
  totalRecords,
  pendingCount,
  restoredCount,
  pendingRate,
  isRepairedMode,
  formulaErrorsCount,
  blankFixedCount,
  onJumpToNapDown,
  onOpenDataDoctor,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {/* 1. Active NAP Down (Primary Urgent Action) */}
      <div
        onClick={onJumpToNapDown}
        className="cursor-pointer bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-950/80 hover:border-rose-400 dark:hover:border-rose-700/80 rounded-lg p-3.5 transition-all shadow-xs group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 tracking-wide uppercase">
            Active NAP Down
          </span>
          <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tabular-nums text-rose-700 dark:text-rose-400">
            {pendingCount.toLocaleString()}
          </span>
          <span className="text-[11px] text-rose-600/80 dark:text-rose-400/80 font-medium">
            Pending Final
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span>Action Required</span>
          <span aria-hidden="true">·</span>
          <span>1:1 Parity</span>
        </div>
      </div>

      {/* 2. Total Outages Scanned */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 tracking-wide uppercase">
            Database Records
          </span>
          <Layers className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {totalRecords.toLocaleString()}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span>Active filter scope</span>
          <span aria-hidden="true">·</span>
          <span>Google Sheets</span>
        </div>
      </div>

      {/* 3. Restored Incidents */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 tracking-wide uppercase">
            Restored Total
          </span>
          <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tabular-nums text-teal-700 dark:text-teal-400">
            {restoredCount.toLocaleString()}
          </span>
          {isRepairedMode && (
            <span className="text-[10px] text-emerald-600 font-semibold">
              +420 repaired
            </span>
          )}
        </div>
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span>Restored rate</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">
            {totalRecords ? `${((restoredCount / totalRecords) * 100).toFixed(1)}%` : '0%'}
          </span>
        </div>
      </div>

      {/* 4. Pending Rate */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 tracking-wide uppercase">
            Pending Rate
          </span>
          <Activity className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {pendingRate}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span>Pending ÷ Total</span>
          <span aria-hidden="true">·</span>
          <span>Target &lt; 1.5%</span>
        </div>
      </div>

      {/* 5. Formula Integrity */}
      <div
        onClick={onOpenDataDoctor}
        className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 rounded-lg p-3.5 transition-all shadow-xs group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 tracking-wide uppercase">
            Formula Integrity
          </span>
          <AlertTriangle className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={`text-2xl font-bold font-mono tabular-nums ${isRepairedMode ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {isRepairedMode ? '0 errors' : `${formulaErrorsCount} #REF!`}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span>{isRepairedMode ? 'All 17 fixed' : 'Barangay VLOOKUP'}</span>
          <span aria-hidden="true">·</span>
          <span>Agent ready</span>
        </div>
      </div>

      {/* 6. Data Doctor Status */}
      <div
        onClick={onOpenDataDoctor}
        className="cursor-pointer bg-slate-900 text-white border border-slate-800 hover:border-teal-500/80 rounded-lg p-3.5 transition-all shadow-xs group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-teal-400 tracking-wide uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-teal-400" />
            Data Doctor
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tabular-nums text-white">
            {isRepairedMode ? 'Cleaned' : 'Raw Mode'}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1.5">
          <span>{isRepairedMode ? `${blankFixedCount + formulaErrorsCount} auto-repaired` : 'Click to repair'}</span>
        </div>
      </div>
    </div>
  );
};
