import React from 'react';
import { X, Users, MapPin, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { DatabaseRow } from '../types/outage';

interface OperationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rows: DatabaseRow[];
  pendingRows: DatabaseRow[];
  restoredRows: DatabaseRow[];
}

export const OperationsDrawer: React.FC<OperationsDrawerProps> = ({
  isOpen,
  onClose,
  rows,
  pendingRows,
  restoredRows,
}) => {
  if (!isOpen) return null;

  // 1. Pending by Municipality
  const pendingByMuni: Record<string, number> = {};
  pendingRows.forEach((r) => {
    const m = r.municipality || 'UNSPECIFIED';
    pendingByMuni[m] = (pendingByMuni[m] || 0) + 1;
  });
  const sortedPendingMuni = Object.entries(pendingByMuni).sort((a, b) => b[1] - a[1]);

  // 2. Pending by Issue
  const pendingByIssue: Record<string, number> = {};
  pendingRows.forEach((r) => {
    const issue = r.napStatus || r.finding || 'UNSPECIFIED';
    pendingByIssue[issue] = (pendingByIssue[issue] || 0) + 1;
  });
  const sortedPendingIssue = Object.entries(pendingByIssue).sort((a, b) => b[1] - a[1]);

  // 3. Technician Workload
  const techWorkload: Record<string, { active: number; oldestDays: number }> = {};
  pendingRows.forEach((r) => {
    const tech = r.ospTeam || 'UNASSIGNED';
    if (!techWorkload[tech]) techWorkload[tech] = { active: 0, oldestDays: 0 };
    techWorkload[tech].active++;
    if (r.dateEndorsed) {
      const days = Math.max(0, (Date.now() - new Date(r.dateEndorsed).getTime()) / 86400000);
      if (days > techWorkload[tech].oldestDays) {
        techWorkload[tech].oldestDays = days;
      }
    }
  });
  const sortedTech = Object.entries(techWorkload).sort((a, b) => b[1].active - a[1].active);

  // 4. Aging Monitor
  let under24h = 0;
  let between24and48h = 0;
  let over48h = 0;
  pendingRows.forEach((r) => {
    if (r.dateEndorsed) {
      const days = Math.max(0, (Date.now() - new Date(r.dateEndorsed).getTime()) / 86400000);
      if (days < 1) under24h++;
      else if (days <= 2) between24and48h++;
      else over48h++;
    } else {
      under24h++;
    }
  });

  // 5. Restored by Tech
  const restoredByTech: Record<string, number> = {};
  restoredRows.forEach((r) => {
    const t = r.ospTeam || 'UNASSIGNED';
    restoredByTech[t] = (restoredByTech[t] || 0) + 1;
  });
  const sortedRestoredTech = Object.entries(restoredByTech).sort((a, b) => b[1] - a[1]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              NOC Operations Details
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Granular breakdowns of technician backlogs, aging, and municipal queues.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Aging Distribution */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-rose-500" />
              SLA Aging Monitor ({pendingRows.length} Active)
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-center">
                <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                  &lt; 24 Hours
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-emerald-900 dark:text-emerald-200 mt-1">
                  {under24h}
                </div>
                <div className="text-[10px] text-emerald-600 font-mono">
                  {pendingRows.length ? `${((under24h / pendingRows.length) * 100).toFixed(0)}%` : '0%'}
                </div>
              </div>

              <div className="p-2.5 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-center">
                <div className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase">
                  24–48 Hours
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-amber-900 dark:text-amber-200 mt-1">
                  {between24and48h}
                </div>
                <div className="text-[10px] text-amber-600 font-mono">
                  {pendingRows.length ? `${((between24and48h / pendingRows.length) * 100).toFixed(0)}%` : '0%'}
                </div>
              </div>

              <div className="p-2.5 rounded bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-center">
                <div className="text-[10px] font-bold text-rose-800 dark:text-rose-300 uppercase">
                  &gt; 48h Breach
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-rose-900 dark:text-rose-200 mt-1">
                  {over48h}
                </div>
                <div className="text-[10px] text-rose-600 font-mono">
                  {pendingRows.length ? `${((over48h / pendingRows.length) * 100).toFixed(0)}%` : '0%'}
                </div>
              </div>
            </div>
          </div>

          {/* Pending by Municipality */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-500" />
              Pending by Municipality
            </h3>
            <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <th className="py-2 px-3">Municipality</th>
                    <th className="py-2 px-3 text-right">Active Count</th>
                    <th className="py-2 px-3 text-right">Share %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                  {sortedPendingMuni.map(([muni, cnt]) => (
                    <tr key={muni} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-1.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                        {muni}
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono tabular-nums font-semibold text-rose-600">
                        {cnt}
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono tabular-nums text-slate-500">
                        {pendingRows.length ? `${((cnt / pendingRows.length) * 100).toFixed(1)}%` : '0%'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Technician Active Workload */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-500" />
              Field Technician Active Load
            </h3>
            <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <th className="py-2 px-3">Technician / OSP Team</th>
                    <th className="py-2 px-3 text-right">Active Tickets</th>
                    <th className="py-2 px-3 text-right">Oldest Age</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                  {sortedTech.map(([tech, data]) => (
                    <tr key={tech} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-1.5 px-3 font-mono font-medium text-slate-800 dark:text-slate-200">
                        {tech}
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        {data.active}
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono tabular-nums text-rose-600">
                        {data.oldestDays.toFixed(1)} days
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
