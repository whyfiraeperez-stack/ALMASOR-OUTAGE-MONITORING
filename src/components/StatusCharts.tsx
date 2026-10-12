import React from 'react';
import { DatabaseRow } from '../types/outage';

interface StatusChartsProps {
  rows: DatabaseRow[];
  totalRows: number;
  pendingCount: number;
  restoredCount: number;
  selectedDate: string;
}

export const StatusCharts: React.FC<StatusChartsProps> = ({
  rows,
  totalRows,
  pendingCount,
  restoredCount,
  selectedDate,
}) => {
  // Compute final status counts
  const counts: Record<string, number> = {};
  rows.forEach((r) => {
    const s = (r.finalStatus || '').trim() || 'BLANK';
    counts[s] = (counts[s] || 0) + 1;
  });

  const sortedStatuses = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  // Compute Restored for the selected day
  const restoredOfDay = rows.filter((r) => {
    if ((r.finalStatus || '').toUpperCase() !== 'RESTORED') return false;
    if (selectedDate !== 'ALL') {
      const dKey = r.dateRestored ? r.dateRestored.slice(0, 10) : '';
      return dKey === selectedDate;
    }
    return true;
  }).length;

  const compareTotal = pendingCount + restoredOfDay;
  const pendingSharePct = compareTotal > 0 ? (pendingCount / compareTotal) * 100 : 0;
  const restoredSharePct = compareTotal > 0 ? (restoredOfDay / compareTotal) * 100 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Panel 1: Database Final Status */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            DATABASE FINAL STATUS
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Counts evaluated directly from the DATABASE FINAL STATUS column.
          </p>
        </div>

        {/* Visual Distribution Bars */}
        <div className="mt-4 space-y-2">
          {sortedStatuses.slice(0, 6).map(([status, count]) => {
            const pct = totalRows > 0 ? (count / totalRows) * 100 : 0;
            const isPending = status.toUpperCase() === 'PENDING';
            const isRestored = status.toUpperCase() === 'RESTORED';

            return (
              <div key={status} className="text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium ${isPending ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                    {status} {isPending && '· ACTION REQUIRED'}
                  </span>
                  <span className="font-mono tabular-nums text-slate-500">
                    {count.toLocaleString()} ({pct.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isPending
                        ? 'bg-rose-500'
                        : isRestored
                        ? 'bg-teal-500'
                        : 'bg-slate-400 dark:bg-slate-600'
                    }`}
                    style={{ width: `${Math.max(2, Math.min(100, pct))}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Table */}
        <div className="mt-5 overflow-hidden border border-slate-200 dark:border-slate-800 rounded-md">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                <th className="py-2 px-3">Final Status</th>
                <th className="py-2 px-3 text-right">Count</th>
                <th className="py-2 px-3 text-right">Share %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
              {sortedStatuses.map(([status, count]) => {
                const share = totalRows > 0 ? ((count / totalRows) * 100).toFixed(1) : '0.0';
                const isPending = status.toUpperCase() === 'PENDING';

                return (
                  <tr
                    key={status}
                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/40 ${
                      isPending ? 'bg-rose-50/60 dark:bg-rose-950/20 font-bold text-rose-700 dark:text-rose-400' : ''
                    }`}
                  >
                    <td className="py-2 px-3 flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isPending
                            ? 'bg-rose-500'
                            : status.toUpperCase() === 'RESTORED'
                            ? 'bg-teal-500'
                            : 'bg-slate-400'
                        }`}
                      ></span>
                      <span>{status}</span>
                      {isPending && (
                        <span className="text-[10px] text-rose-600 font-extrabold uppercase">
                          Action Required
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">
                      {count.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-500">
                      {share}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Panel 2: PENDING vs RESTORED Comparison */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs flex flex-col">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            PENDING vs RESTORED COMPARISON
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active Pending vs Restored resolutions for selected filter scope.
          </p>
        </div>

        <div className="my-auto py-8 flex flex-col items-center justify-center">
          {/* Conic Donut Chart */}
          <div className="relative w-44 h-44 rounded-full flex items-center justify-center shadow-inner"
            style={{
              background: `conic-gradient(#f43f5e 0% ${pendingSharePct}%, #14b8a6 ${pendingSharePct}% 100%)`
            }}
          >
            {/* Center cutout */}
            <div className="w-32 h-32 rounded-full bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center shadow-xs">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Pending Share
              </span>
              <span className="text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
                {pendingSharePct.toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
                {pendingCount} of {compareTotal}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-xs text-xs">
            <div className="p-2.5 rounded border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20">
              <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>PENDING</span>
              </div>
              <div className="mt-1 text-lg font-bold font-mono tabular-nums text-rose-900 dark:text-rose-200">
                {pendingCount.toLocaleString()}
              </div>
              <div className="text-[10px] text-rose-600 font-mono">
                {pendingSharePct.toFixed(1)}%
              </div>
            </div>

            <div className="p-2.5 rounded border border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/20">
              <div className="flex items-center gap-1.5 font-bold text-teal-700 dark:text-teal-400">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                <span>RESTORED</span>
              </div>
              <div className="mt-1 text-lg font-bold font-mono tabular-nums text-teal-900 dark:text-teal-200">
                {restoredOfDay.toLocaleString()}
              </div>
              <div className="text-[10px] text-teal-600 font-mono">
                {restoredSharePct.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
          Date Scope: {selectedDate === 'ALL' ? 'All historical records' : selectedDate}
        </div>
      </div>
    </div>
  );
};
