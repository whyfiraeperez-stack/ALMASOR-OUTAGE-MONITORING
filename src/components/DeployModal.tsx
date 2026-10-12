import React, { useState } from 'react';
import { X, GitBranch, Terminal, ExternalLink, Check, Copy, UploadCloud } from 'lucide-react';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployModal: React.FC<DeployModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const gitCommands = `git init
git add .
git commit -m "feat: Almasor NOC Outage Dashboard with Data Doctor Agent and Formula Parity"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/almasor-outage-monitoring.git
git push -u origin main`;

  const vercelCliCommand = `npm install -g vercel
vercel --prod`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Push to GitHub &amp; Deploy to Vercel
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* GitHub Step */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wide">
                <GitBranch className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                Step 1: Push Repository to GitHub
              </span>
              <button
                onClick={() => copy('git', gitCommands)}
                className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedKey === 'git' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'git' ? 'Copied Commands' : 'Copy Commands'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-md text-xs font-mono overflow-x-auto leading-relaxed">
              {gitCommands}
            </pre>
          </div>

          {/* Vercel Step */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wide">
                <Terminal className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                Step 2: Deploy to Vercel
              </span>
              <button
                onClick={() => copy('vercel', vercelCliCommand)}
                className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedKey === 'vercel' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'vercel' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              The project includes pre-configured <code>vercel.json</code> with automatic API proxy rewrites and SPA fallback routing.
            </p>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-md text-xs font-mono overflow-x-auto leading-relaxed">
              {vercelCliCommand}
            </pre>
          </div>

          <div className="p-3.5 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-md text-xs text-teal-900 dark:text-teal-200">
            <strong>Vercel Web UI Alternative:</strong> Import the repository directly in the <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="underline font-semibold">Vercel Dashboard</a>. Framework Preset: <code>Vite</code>. Build Command: <code>npm run build</code>. Output Directory: <code>dist</code>.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-md cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
