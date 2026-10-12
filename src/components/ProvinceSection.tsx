import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, AlertCircle, Clock } from 'lucide-react';
import { DatabaseRow } from '../types/outage';

interface ProvinceSectionProps {
  pendingRows: DatabaseRow[];
}

export const ProvinceSection: React.FC<ProvinceSectionProps> = ({ pendingRows }) => {
  const [openProvinces, setOpenProvinces] = useState<Record<string, boolean>>({
    'CAMARINES SUR': true,
    'ALBAY': true,
    'MASBATE': false,
    'CAMARINES NORTE': false,
  });

  // Group pending rows by province
  const groupedByProvince: Record<string, DatabaseRow[]> = {};
  pendingRows.forEach((r) => {
    const p = (r.province || '').trim() || 'UNSPECIFIED';
    if (!groupedByProvince[p]) groupedByProvince[p] = [];
    groupedByProvince[p].push(r);
  });

  const sortedProvinces = Object.entries(groupedByProvince).sort((a, b) => b[1].length - a[1].length);

  const toggleProvince = (province: string) => {
    setOpenProvinces((prev) => ({
      ...prev,
      [province]: !prev[province],
    }));
  };

  return (
    <section id="provinces" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 mb-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              PENDING INCIDENTS BY PROVINCE
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Segmented provincial view with issue taxonomy and granular pending incident details.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {sortedProvinces.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No pending records found matching the current filters.
          </div>
        ) : (
          sortedProvinces.map(([province, rows]) => {
            const isOpen = openProvinces[province] ?? false;

            // Issue counts
            const issuesMap: Record<string, number> = {};
            rows.forEach((r) => {
              const issue = r.napStatus || r.finding || r.concern || 'UNSPECIFIED';
              issuesMap[issue] = (issuesMap[issue] || 0) + 1;
            });
            const issueStats = Object.entries(issuesMap).sort((a, b) => b[1] - a[1]);

            return (
              <div
                key={province}
                className="border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden"
              >
                {/* Accordion Head */}
                <button
                  type="button"
                  onClick={() => toggleProvince(province)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wide">
                      {province}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-bold tabular-nums bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                      {rows.length} PENDING
                    </span>
                  </div>
                  <div className="text-slate-400">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Accordion Body */}
                {isOpen && (
                  <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                    {/* Issues Breakdown Mini-Table */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1 border border-slate-200 dark:border-slate-800 rounded p-3 bg-slate-50/50 dark:bg-slate-850">
                        <h4 className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          Top Issues in {province}
                        </h4>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {issueStats.map(([issue, cnt]) => (
                            <div key={issue} className="flex items-center justify-between text-xs">
                              <span className="text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                                {issue}
                              </span>
                              <div className="flex items-center gap-1.5 font-mono tabular-nums">
                                <span className="font-semibold text-slate-900 dark:text-white">{cnt}</span>
                                <span className="text-slate-400 text-[10px]">
                                  ({((cnt / rows.length) * 100).toFixed(0)}%)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Detail Incidents Table */}
                      <div className="md:col-span-2 overflow-x-auto border border-slate-200 dark:border-slate-800 rounded">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                              <th className="py-2 px-2.5">Municipality</th>
                              <th className="py-2 px-2.5">Barangay</th>
                              <th className="py-2 px-2.5">NAP / Issue</th>
                              <th className="py-2 px-2.5">Technician</th>
                              <th className="py-2 px-2.5 text-right">Age (Days)</th>
                              <th className="py-2 px-2.5">ETR</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                            {rows.map((r, i) => {
                              const ageDays = r.dateEndorsed
                                ? Math.max(0, (Date.now() - new Date(r.dateEndorsed).getTime()) / 86400000)
                                : null;

                              return (
                                <tr key={i} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                                  <td className="py-1.5 px-2.5 font-medium text-slate-900 dark:text-white">
                                    {r.municipality || '—'}
                                  </td>
                                  <td className="py-1.5 px-2.5 text-slate-500">
                                    {r.barangay && r.barangay !== '#REF!' ? r.barangay : '—'}
                                  </td>
                                  <td className="py-1.5 px-2.5 text-slate-700 dark:text-slate-300">
                                    {r.napStatus || r.finding || '—'}
                                  </td>
                                  <td className="py-1.5 px-2.5 text-slate-600 dark:text-slate-400 font-mono">
                                    {r.ospTeam || '—'}
                                  </td>
                                  <td className="py-1.5 px-2.5 text-right font-mono tabular-nums font-semibold text-rose-600 dark:text-rose-400">
                                    {ageDays !== null ? ageDays.toFixed(1) : '—'}
                                  </td>
                                  <td className="py-1.5 px-2.5 text-slate-500">
                                    {r.etr || 'within 24 hrs'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
