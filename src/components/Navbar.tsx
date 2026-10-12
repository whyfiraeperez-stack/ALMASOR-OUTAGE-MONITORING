import React from 'react';
import { RefreshCw, ShieldAlert, Cpu, Database, Wrench } from 'lucide-react';

interface NavbarProps {
  autoRefreshSec: number;
  setAutoRefreshSec: (sec: number) => void;
  secondsRemaining: number;
  isSyncing: boolean;
  onRefreshClick: () => void;
  isRepairedMode: boolean;
  setIsRepairedMode: (val: boolean) => void;
  onOpenDataDoctor: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  autoRefreshSec,
  setAutoRefreshSec,
  secondsRemaining,
  isSyncing,
  onRefreshClick,
  isRepairedMode,
  setIsRepairedMode,
  onOpenDataDoctor,
  activeTab,
  setActiveTab,
  pendingCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('overview');
            }}
            className="flex items-center gap-2.5 text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-teal-400 transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-teal-400"></span>
            <span>ALMASOR NOC // MONITOR</span>
          </a>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => setActiveTab('overview')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'overview'
                  ? 'text-teal-400 border-teal-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:border-slate-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('napdown')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'napdown'
                  ? 'text-teal-400 border-teal-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:border-slate-600'
              }`}
            >
              <span>NAP Down</span>
              <span className="text-xs px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 font-mono tabular-nums border border-rose-800/60">
                {pendingCount}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('provinces')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'provinces'
                  ? 'text-teal-400 border-teal-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:border-slate-600'
              }`}
            >
              Pending by Province
            </button>
            <button
              onClick={() => setActiveTab('formulas')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'formulas'
                  ? 'text-teal-400 border-teal-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:border-slate-600'
              }`}
            >
              Formula Lab
            </button>
            <button
              onClick={onOpenDataDoctor}
              className="hover:text-teal-300 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent text-teal-400 flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-teal-400" />
              <span>Data Doctor Agent</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action with refresh controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Auto refresh timer and dropdown */}
            <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-800/80 px-2.5 py-1.5 rounded-md border border-slate-700/80">
              <span className="text-slate-400 font-mono tabular-nums">
                {autoRefreshSec > 0 ? `${secondsRemaining}s` : 'Paused'}
              </span>
              <select
                value={autoRefreshSec}
                onChange={(e) => setAutoRefreshSec(Number(e.target.value))}
                className="bg-transparent text-slate-300 text-xs outline-none cursor-pointer border-l border-slate-700 pl-2 pr-1"
                aria-label="Auto-refresh interval"
              >
                <option value={10} className="bg-slate-800 text-white">10s</option>
                <option value={30} className="bg-slate-800 text-white">30s</option>
                <option value={60} className="bg-slate-800 text-white">60s</option>
                <option value={0} className="bg-slate-800 text-white">Off</option>
              </select>
            </div>

            {/* Quick Refresh CTA */}
            <button
              onClick={onRefreshClick}
              disabled={isSyncing}
              className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-teal-400 rounded-md hover:bg-teal-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 disabled:opacity-60 cursor-pointer shadow-sm active:scale-98"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
