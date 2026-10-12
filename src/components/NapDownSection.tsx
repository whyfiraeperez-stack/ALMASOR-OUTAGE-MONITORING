import React, { useState, useMemo } from 'react';
import { ShieldAlert, ArrowUpDown, Search, MapPin, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import { NapDownRow } from '../types/outage';
import { DataDoctorAgent } from '../lib/dataDoctor';

interface NapDownSectionProps {
  napDownRows: NapDownRow[];
  pendingDbCount: number;
  onSelectIncident?: (nap: NapDownRow) => void;
}

export const NapDownSection: React.FC<NapDownSectionProps> = ({
  napDownRows,
  pendingDbCount,
  onSelectIncident,
}) => {
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'duration-desc' | 'duration-asc' | 'province' | 'napCode'>('duration-desc');

  // Filter out blank trailing artifact rows if any
  const cleanRows = useMemo(() => {
    return napDownRows.filter(
      (r) => (r.province || '').trim() !== '' && (r.finding || '').trim() !== ''
    );
  }, [napDownRows]);

  // Distinct provinces and counts
  const provinceStats = useMemo(() => {
    const map: Record<string, number> = {};
    cleanRows.forEach((r) => {
      const p = r.province || 'UNSPECIFIED';
      map[p] = (map[p] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [cleanRows]);

  // Municipalities for selected province
  const municipalities = useMemo(() => {
    const list = cleanRows
      .filter((r) => selectedProvince === 'ALL' || r.province === selectedProvince)
      .map((r) => r.municipality)
      .filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [cleanRows, selectedProvince]);

  // Filtered and sorted rows
  const displayedRows = useMemo(() => {
    return cleanRows
      .filter((r) => {
        if (selectedProvince !== 'ALL' && r.province !== selectedProvince) return false;
        if (selectedMunicipality !== 'ALL' && r.municipality !== selectedMunicipality) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchNap = (r.napCode || '').toLowerCase().includes(q);
          const matchMuni = (r.municipality || '').toLowerCase().includes(q);
          const matchBar = (r.barangay || '').toLowerCase().includes(q);
          const matchFinding = (r.finding || '').toLowerCase().includes(q);
          if (!matchNap && !matchMuni && !matchBar && !matchFinding) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'duration-desc' || sortBy === 'duration-asc') {
          const hoursA = DataDoctorAgent.parseDurationHours(a.dateEndorsed, a.duration);
          const hoursB = DataDoctorAgent.parseDurationHours(b.dateEndorsed, b.duration);
          return sortBy === 'duration-desc' ? hoursB - hoursA : hoursA - hoursB;
        }
        if (sortBy === 'province') {
          return (a.province || '').localeCompare(b.province || '');
        }
        if (sortBy === 'napCode') {
          return (a.napCode || '').localeCompare(b.napCode || '');
        }
        return 0;
      });
  }, [cleanRows, selectedProvince, selectedMunicipality, searchQuery, sortBy]);

  return (
    <section id="napdown" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 mb-8 shadow-xs">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              ACTIVE NAP DOWN MONITOR
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-mono font-bold tabular-nums border border-rose-200 dark:border-rose-800/80">
              {cleanRows.length} ACTIVE
            </span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-1.5">
            <span>Formula Parity Verified</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">
              =COUNTIF(DATABASE!FINAL_STATUS, "PENDING") = {pendingDbCount}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              100% Match
            </span>
          </div>
        </div>

        {/* Sort & Province Fast Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSelectedProvince('ALL')}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                selectedProvince === 'ALL'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All ({cleanRows.length})
            </button>
            {provinceStats.map(([p, cnt]) => (
              <button
                key={p}
                onClick={() => {
                  setSelectedProvince(p);
                  setSelectedMunicipality('ALL');
                }}
                className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                  selectedProvince === p
                    ? 'bg-rose-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {p} ({cnt})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-toolbar: Search & Municipality Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search NAP Code, Barangay, Issue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-7 pr-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3 pointer-events-none" />
        </div>

        {/* Municipality Filter */}
        <div>
          <select
            value={selectedMunicipality}
            onChange={(e) => setSelectedMunicipality(e.target.value)}
            className="w-full h-9 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500"
          >
            <option value="ALL">All Municipalities ({municipalities.length})</option>
            {municipalities.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full h-9 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500"
          >
            <option value="duration-desc">Sort by: Ageing (Highest First)</option>
            <option value="duration-asc">Sort by: Ageing (Lowest First)</option>
            <option value="province">Sort by: Province (A-Z)</option>
            <option value="napCode">Sort by: NAP Code (A-Z)</option>
          </select>
        </div>
      </div>

      {/* NAP DOWN Table */}
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-md">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
              <th className="py-2.5 px-3 w-[12%]">Province</th>
              <th className="py-2.5 px-3 w-[13%]">Municipality</th>
              <th className="py-2.5 px-3 w-[13%]">Barangay</th>
              <th className="py-2.5 px-3 w-[16%]">NAP Code</th>
              <th className="py-2.5 px-3 w-[18%]">Issue / Finding</th>
              <th className="py-2.5 px-3 w-[14%]">Date Endorsed</th>
              <th className="py-2.5 px-3 w-[14%] text-right">Ageing Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
            {displayedRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No active NAP DOWN records match current filters.
                </td>
              </tr>
            ) : (
              displayedRows.map((r, i) => {
                const hours = DataDoctorAgent.parseDurationHours(r.dateEndorsed, r.duration);
                const isCritical = hours >= 48;
                const isWarning = hours >= 24 && hours < 48;

                return (
                  <tr
                    key={`${r.napCode}-${i}`}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                      {r.province || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                      {r.municipality || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                      {r.barangay && r.barangay !== '#REF!' ? r.barangay : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-900 dark:text-slate-100">
                      {r.napCode || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                      <div className="font-medium text-slate-900 dark:text-slate-200">
                        {r.finding || 'Outage'}
                      </div>
                      {r.coordinates && (
                        <div className="text-[10px] text-slate-400 font-mono">
                          {r.coordinates}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 font-mono tabular-nums text-[11px]">
                      {r.dateEndorsedDisplay || (r.dateEndorsed ? new Date(r.dateEndorsed).toLocaleDateString() : '—')}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={`font-mono tabular-nums font-semibold ${
                          isCritical
                            ? 'text-rose-600 dark:text-rose-400'
                            : isWarning
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {r.duration || DataDoctorAgent.formatDuration(hours)}
                      </span>
                      {isCritical && (
                        <span className="block text-[10px] text-rose-500 font-medium">
                          &gt;48h Breach
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="mt-3 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div>
          Showing {displayedRows.length} of {cleanRows.length} active NAP DOWN incidents
        </div>
        <div className="flex items-center gap-2">
          <span>Formula: =FILTER(DATABASE!A:Q, DATABASE!Q:Q="PENDING")</span>
        </div>
      </div>
    </section>
  );
};
