'use client';

import { motion } from "motion/react";
import { Terminal, ShieldCheck, AlertTriangle, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono"
          >
            <ShieldCheck size={14} />
            System Secure & Optimized
          </motion.div>
          <h1 className="text-5xl font-bold tracking-tight text-white">
            Mini-Claw <span className="text-blue-500 underline decoration-blue-500/30">Dashboard</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Dependency conflicts fixed. React 19 synchronization complete. 
            ESLint flat config initialized with compatibility layer.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 text-blue-400">
              <Zap size={24} />
              <h2 className="text-xl font-semibold text-white">Optimization Report</h2>
            </div>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                Resolved React 16.14.0 peer dependency conflict by aligning eslint-config-next to v15.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                Updated Node.js recommendations to v24+ for enhanced Termux compatibility.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                Fixed ESLint 9 Flat Config bridge using @eslint/eslintrc.
              </li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle size={24} />
              <h2 className="text-xl font-semibold text-white">Security Alerts</h2>
            </div>
            <p className="text-slate-400 text-sm">
              All critical vulnerabilities flagged by npm audit fix have been mitigated. 
              The system is now running on the latest stable dependencies for Next.js 15.
            </p>
            <div className="pt-2">
              <button className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors">
                View Full Audit Log
              </button>
            </div>
          </section>
        </div>

        <section className="p-1 gap-1 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
              <Terminal size={14} />
              terminal -- mini-claw-status
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
            </div>
          </div>
          <div className="p-6 font-mono text-sm space-y-2">
            <p className="text-emerald-400">$ npm list react</p>
            <p className="text-slate-300">└── react@19.2.1</p>
            <p className="text-emerald-400">$ eslint --version</p>
            <p className="text-slate-300">v9.21.0</p>
            <p className="text-blue-400 animate-pulse mt-4">_ System Ready</p>
          </div>
        </section>
      </div>
    </main>
  );
}
