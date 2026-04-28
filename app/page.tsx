'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Terminal, 
  Settings, 
  FileText, 
  Globe, 
  MessageSquare, 
  Zap,
  Shield,
  Cpu,
  RefreshCcw,
  ArrowRight
} from 'lucide-react';

interface AgentActivity {
  step: string;
  result: string;
  objective?: string; // in case we add it back later
}

export default function MiniClawDashboard() {
  const [history, setHistory] = useState<AgentActivity[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);

  const fetchData = async () => {
    try {
      const [memRes, cfgRes] = await Promise.all([
        fetch('/api/memory'),
        fetch('/api/config')
      ]);

      let memData = [];
      let cfgData = null;

      if (memRes.ok) {
        try {
          memData = await memRes.json();
        } catch (e) {
          console.error('Memory API returned invalid JSON:', e);
        }
      } else {
        const text = await memRes.text();
        console.error('Memory API error:', memRes.status, text);
      }

      if (cfgRes.ok) {
        try {
          cfgData = await cfgRes.json();
        } catch (e) {
          console.error('Config API returned invalid JSON:', e);
        }
      } else {
        const text = await cfgRes.text();
        console.error('Config API error:', cfgRes.status, text);
      }
      
      setHistory(Array.isArray(memData) ? memData : []);
      if (cfgData) setConfig(cfgData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      setMounted(true);
      fetchData();
    }, 0);
    
    let isMounted = true;
    const interval = setInterval(fetchData, 5000); 
    
    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(mountTimer);
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 font-mono selection:bg-cyan-500 selection:text-black">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <header className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500 rounded-sm flex items-center justify-center text-slate-950 font-black text-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              MC
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold tracking-tight text-white uppercase">mini-claw</h1>
                <span className="px-1.5 py-0.5 bg-slate-800 text-[10px] text-slate-400 font-medium rounded uppercase border border-slate-700">alpha v1.0.0</span>
              </div>
              <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest opacity-80 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
                /termux/home/mini-claw/core
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Telegram Status</span>
              <span className="text-xs text-green-400 font-bold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                CONNECTED
              </span>
            </div>
            <div className="w-px h-10 bg-slate-800"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Gemini Pro AI</span>
              <span className="text-xs text-amber-400 font-bold uppercase">READY_TO_ACT</span>
            </div>
          </div>

          <button 
            onClick={fetchData}
            className="md:hidden p-3 border border-slate-800 rounded bg-slate-900 group active:scale-95 transition-all"
          >
            <RefreshCcw className="w-4 h-4 text-cyan-400" />
          </button>
        </header>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-12 gap-6 min-h-[70vh]">
          
          {/* Sidebar: System Diagnostics */}
          <aside className="col-span-12 lg:col-span-3 space-y-6">
            <div className="border border-slate-800 bg-slate-900/40 p-5 rounded-lg flex flex-col h-full">
              <h2 className="text-[10px] font-black text-slate-500 uppercase mb-6 tracking-[0.2em] border-b border-slate-800 pb-2">Diagnostic_Core</h2>
              
              <div className="space-y-6 flex-1">
                <section>
                  <div className="flex items-center gap-2 mb-3 text-cyan-500">
                    <Cpu className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Architecture</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span className="text-slate-500 uppercase tracking-tighter">Provider</span>
                      <span className="text-cyan-400 font-bold uppercase">{config?.provider || '---'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span className="text-slate-500 uppercase tracking-tighter">Model</span>
                      {config?.provider === 'ollama' ? (
                        <select 
                          value={config?.ollamaModel}
                          onChange={async (e) => {
                            const newModel = e.target.value;
                            await fetch('/api/config', {
                              method: 'POST',
                              body: JSON.stringify({ ollamaModel: newModel })
                            });
                            fetchData();
                          }}
                          className="bg-slate-900 text-cyan-400 border border-slate-700 rounded px-1 py-0.5 text-[10px] focus:outline-none focus:border-cyan-500 transition-colors"
                        >
                          <option value="llama3">llama3</option>
                          <option value="mistral">mistral</option>
                          <option value="phi3">phi3</option>
                          <option value="gemma">gemma</option>
                          <option value={config?.ollamaModel !== 'llama3' && config?.ollamaModel !== 'mistral' && config?.ollamaModel !== 'phi3' && config?.ollamaModel !== 'gemma' ? config?.ollamaModel : ''} hidden={config?.ollamaModel === 'llama3' || config?.ollamaModel === 'mistral' || config?.ollamaModel === 'phi3' || config?.ollamaModel === 'gemma'}>
                            {config?.ollamaModel}
                          </option>
                        </select>
                      ) : (
                        <span className="text-slate-300">{config?.geminiModel || '---'}</span>
                      )}
                    </div>
                    <div className="flex justify-between border-b border-slate-800/50 pb-1 text-[11px]">
                      <span className="text-slate-500 uppercase tracking-tighter">Environment</span>
                      <span className="text-slate-300">linux/termux</span>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-3 text-amber-500">
                    <Zap className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Toolbox_Active</span>
                  </div>
                  <ul className="space-y-2 text-[11px]">
                    <li className="flex items-center gap-2 text-slate-300 bg-slate-800/30 p-2 rounded border border-slate-800">
                      <span className="text-cyan-500">01</span> web.js
                      <div className="ml-auto w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_5px_rgba(6,182,212,0.5)]"></div>
                    </li>
                    <li className="flex items-center gap-2 text-slate-300 bg-slate-800/30 p-2 rounded border border-slate-800">
                      <span className="text-cyan-500">02</span> file.js
                      <div className="ml-auto w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                    </li>
                  </ul>
                </section>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800">
                <div className="text-[10px] text-slate-600 mb-2 uppercase font-bold">Quick_Exec</div>
                <div className="bg-black p-3 text-[11px] text-cyan-400 font-mono leading-relaxed border border-slate-800 rounded">
                  <span className="text-slate-600">$</span> npm start<br/>
                  <span className="text-green-500">[OK]</span> index.js loaded
                </div>
              </div>
            </div>
          </aside>

          {/* Center: Agent Thought Processor */}
          <main className="col-span-12 lg:col-span-6 flex flex-col gap-6">
            <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-lg p-6 flex flex-col relative overflow-hidden">
              {/* Background Geometric Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 -mr-16 -mt-16 rotate-45 pointer-events-none"></div>
              
              <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-cyan-500" />
                  <h2 className="text-sm font-black uppercase tracking-[0.15em] text-white">Live_Activity_Log</h2>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={fetchData}
                    className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold rounded border border-slate-700 transition-colors uppercase"
                  >
                    <RefreshCcw className="w-3 h-3" /> Sync
                  </button>
                  <span suppressHydrationWarning className="text-[10px] text-slate-500 font-bold">
                    {mounted ? lastUpdated.toLocaleTimeString() : '--:--:--'}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-800 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {history.length > 0 ? (
                    [...history].reverse().map((activity, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 rounded border bg-slate-900/80 border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <Terminal className="w-3 h-3 text-cyan-500" />
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step</span>
                          </div>
                          <span className="text-[9px] text-slate-600 font-mono">#{history.length - idx}</span>
                        </div>
                        
                        <div className="text-[12px] text-white font-bold leading-relaxed border-l-2 border-cyan-500 pl-3 py-1">
                          {activity.step}
                        </div>

                        <div className="bg-slate-950/50 p-2 rounded border border-slate-800/30">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[8px] font-black px-1.5 py-0.5 rounded uppercase bg-green-500/20 text-green-500">
                              Result
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono break-all whitespace-pre-wrap">
                            {typeof activity.result === 'string' ? activity.result : JSON.stringify(activity.result, null, 2)}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-700">
                      <Bot className="w-16 h-16 mb-4 opacity-20" />
                      <p className="text-[10px] font-bold tracking-[0.3em] uppercase">Standby_Mode</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Interaction States */}
            <div className="h-28 grid grid-cols-3 gap-4">
              <div className="border border-slate-800 rounded bg-slate-900 flex flex-col items-center justify-center group overflow-hidden relative">
                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-[10px] text-slate-500 uppercase font-black mb-1">State_01</div>
                <div className="text-cyan-400 font-bold tracking-widest">THINK</div>
              </div>
              <div className="border border-cyan-800/50 rounded bg-cyan-950/20 flex flex-col items-center justify-center shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] relative">
                 <div className="absolute top-0 right-0 w-1 h-1 bg-cyan-500 m-1"></div>
                 <div className="text-[10px] text-cyan-500 uppercase font-black mb-1">State_02</div>
                <div className="text-white font-black tracking-[0.2em]">ACT</div>
              </div>
              <div className="border border-slate-800 rounded bg-slate-900 flex flex-col items-center justify-center opacity-40">
                <div className="text-[10px] text-slate-500 uppercase font-black mb-1">State_03</div>
                <div className="text-slate-600 font-bold tracking-widest">FINISH</div>
              </div>
            </div>
          </main>

          {/* Right Sidebar: Context & Security */}
          <aside className="col-span-12 lg:col-span-3 space-y-6">
            <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-lg p-5 flex flex-col h-full">
              <h2 className="text-[10px] font-black text-slate-500 uppercase mb-6 tracking-[0.2em] border-b border-slate-800 pb-2">Interface_Proxy</h2>
              
              <div className="space-y-6 flex-1">
                <section>
                  <div className="flex items-center gap-2 mb-3 text-green-500">
                    <Shield className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Auth_Shield</span>
                  </div>
                  <div className="p-3 bg-black/50 border border-slate-800 rounded text-[11px] space-y-2">
                    <div className="flex justify-between text-slate-500">
                      <span>USER_ID</span>
                      <span className="text-slate-300">SECURE_ACTIVE</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-full shadow-[0_0_8px_rgba(34,197,94,0.3)]"></div>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-3 text-slate-400">
                    <Settings className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Node_Instructions</span>
                  </div>
                  <div className="space-y-4">
                    <div className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-px before:bg-slate-700">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase mb-1">Telegram Setup</h4>
                       <p className="text-[10px] text-slate-500 leading-relaxed italic">@BotFather key Required</p>
                    </div>
                    <div className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-px before:bg-slate-700">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase mb-1">Gemini Integration</h4>
                       <p className="text-[10px] text-slate-500 leading-relaxed italic">NEXT_PUBLIC_GEMINI_API_KEY</p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Console Output (Mocking system log) */}
              <div className="mt-8 bg-black rounded p-3 border border-slate-800 font-mono text-[10px] h-32 overflow-hidden">
                <div className="text-green-700 font-bold mb-1 tracking-widest">[CONSOLE_LOGS]</div>
                <div className="space-y-1 text-slate-500">
                  <div className="flex gap-2">
                    <span className="text-cyan-800">13:14:17</span>
                    <span>AGENT_INIT_SUCCESS</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-cyan-800">13:14:18</span>
                    <span>TELEGRAM_POLLING_STARTED</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-cyan-800">13:14:19</span>
                    <span>MEMORY_JSON_SYNC... [OK]</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    <span className="text-white">$</span>
                    <span className="w-1.5 h-3 bg-cyan-500 animate-pulse"></span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Global Footer Status Bar */}
        <footer className="mt-8 h-10 border border-slate-800 bg-slate-900/20 rounded flex items-center px-4 justify-between text-[10px] text-slate-500 uppercase font-black tracking-widest">
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]"></span> AGENT_ID: 4192-MNC</span>
            <span className="hidden md:inline">LOC: /termux/home/mini-claw</span>
          </div>
          <div className="flex gap-6 items-center">
            <span className="text-slate-400">MEM: 42MB</span>
            <span className="text-slate-400">UPTIME: 00:14:52</span>
            <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">UTF-8</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
