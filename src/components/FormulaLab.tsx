import React, { useState } from 'react';
import { Calculator, Copy, Check, Info, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { REVERSE_ENGINEERED_FORMULAS } from '../lib/dataDoctor';

export const FormulaLab: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Interactive formula tester state
  const [testSourceStatus, setTestSourceStatus] = useState<string>('');
  const [testDateEndorsed, setTestDateEndorsed] = useState<string>('2026-10-10');
  const [testDateRestored, setTestDateRestored] = useState<string>('');

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Simulating exact Google Sheets formula
  const simulatedFinalStatus = (() => {
    const s = testSourceStatus.trim();
    if (s !== '') return s;
    if (testDateRestored.trim() !== '') return 'RESTORED';
    if (testDateEndorsed.trim() !== '') return 'PENDING';
    return 'BLANK';
  })();

  return (
    <section id="formulas" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 mb-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              SPREADSHEET FORMULA LABORATORY & REVERSE-ENGINEERING
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Exact mathematical formulas extracted and verified across 10,454 Google Sheets records.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
        {/* Formula 1: Final Status */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-md p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              1. Final Status Column Formula
            </span>
            <button
              onClick={() => copyToClipboard('finalStatus', REVERSE_ENGINEERED_FORMULAS.finalStatusFormula)}
              className="text-xs px-2 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded text-slate-600 dark:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedKey === 'finalStatus' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'finalStatus' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="mt-2 p-2.5 bg-slate-900 text-teal-300 font-mono text-xs rounded overflow-x-auto">
            {REVERSE_ENGINEERED_FORMULAS.finalStatusFormula}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
            {REVERSE_ENGINEERED_FORMULAS.finalStatusFormulaExplanation}
          </p>
          <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded border border-amber-200 dark:border-amber-800/60">
            <strong>Historical Formula Omission:</strong> In rows 3–458 and row 9853, the formula was never dragged up, leaving 457 rows as BLANK even though 420 of them have <code>sourceStatus = RESTORED</code>.
          </div>
        </div>

        {/* Formula 2: NAP Down Count */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-md p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              2. NAP Down Count & Query Formula
            </span>
            <button
              onClick={() => copyToClipboard('napDown', REVERSE_ENGINEERED_FORMULAS.napDownCountFormula)}
              className="text-xs px-2 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded text-slate-600 dark:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedKey === 'napDown' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'napDown' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="mt-2 p-2.5 bg-slate-900 text-teal-300 font-mono text-xs rounded overflow-x-auto">
            {REVERSE_ENGINEERED_FORMULAS.napDownCountFormula}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
            {REVERSE_ENGINEERED_FORMULAS.napDownCountExplanation}
          </p>
          <div className="mt-2 text-[11px] text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 p-2 rounded border border-teal-200 dark:border-teal-800/60">
            <strong>1:1 Mathematical Parity:</strong> Counting NAP DOWN by counting <code>FINAL STATUS = 'PENDING'</code> produces the exact true active count of <strong>83</strong>, pruning the empty trailing row 1000 from the sheet.
          </div>
        </div>

        {/* Formula 3: Duration / Aging */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-md p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              3. Ageing Duration Formula
            </span>
            <button
              onClick={() => copyToClipboard('duration', REVERSE_ENGINEERED_FORMULAS.durationAgingFormula)}
              className="text-xs px-2 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded text-slate-600 dark:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedKey === 'duration' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'duration' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="mt-2 p-2.5 bg-slate-900 text-teal-300 font-mono text-xs rounded overflow-x-auto">
            {REVERSE_ENGINEERED_FORMULAS.durationAgingFormula}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
            {REVERSE_ENGINEERED_FORMULAS.durationAgingExplanation}
          </p>
        </div>

        {/* Formula 4: Root Cause of 17 #REF! Errors */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-md p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wide flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              4. Root Cause of 17 #REF! Errors
            </span>
            <button
              onClick={() => copyToClipboard('refError', REVERSE_ENGINEERED_FORMULAS.refErrorCause)}
              className="text-xs px-2 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded text-slate-600 dark:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedKey === 'refError' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'refError' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="mt-2 p-2.5 bg-slate-900 text-rose-300 font-mono text-xs rounded overflow-x-auto">
            {REVERSE_ENGINEERED_FORMULAS.refErrorCause}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
            {REVERSE_ENGINEERED_FORMULAS.refErrorCauseExplanation}
          </p>
          <div className="mt-2 text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded border border-emerald-200 dark:border-emerald-800/60">
            <strong>Agent Healing:</strong> Our Data Doctor cleans these 17 damaged cells automatically by resolving geographic sectors from municipality coordinates.
          </div>
        </div>
      </div>

      {/* Interactive Formula Playground */}
      <div className="mt-6 p-4 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50/50 dark:bg-slate-800/40">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-3 flex items-center gap-1.5">
          <FileSpreadsheet className="w-3.5 h-3.5 text-teal-500" />
          Interactive Spreadsheet Formula Evaluator
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Col O: sourceStatus
            </label>
            <input
              type="text"
              placeholder="(Leave blank or type RESTORED)"
              value={testSourceStatus}
              onChange={(e) => setTestSourceStatus(e.target.value)}
              className="w-full h-8 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Col N: dateEndorsed
            </label>
            <input
              type="text"
              value={testDateEndorsed}
              onChange={(e) => setTestDateEndorsed(e.target.value)}
              className="w-full h-8 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Col P: dateRestored
            </label>
            <input
              type="text"
              placeholder="(Leave blank if active outage)"
              value={testDateRestored}
              onChange={(e) => setTestDateRestored(e.target.value)}
              className="w-full h-8 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Col Q: Evaluated FINAL STATUS
            </label>
            <div className={`h-8 px-3 rounded flex items-center font-mono font-bold text-xs ${
              simulatedFinalStatus === 'PENDING'
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
            }`}>
              {simulatedFinalStatus}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
