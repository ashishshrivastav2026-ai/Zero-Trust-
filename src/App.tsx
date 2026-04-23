/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  Search, 
  History, 
  Settings, 
  ChevronUp, 
  FileWarning, 
  ExternalLink,
  Trash2,
  Lock,
  Loader2,
  AlertTriangle,
  Fingerprint
} from 'lucide-react';
import { analyzeThreat, checkEmailBreach, SecurityThreat, SecurityAnalysis, OSINTReport } from './services/securityService';
import { MOCK_THREATS, STATUS_COLORS } from './constants';

type HubStatus = 'Safe' | 'Scanning' | 'Warning' | 'Locked';

export default function App() {
  const [status, setStatus] = useState<HubStatus>('Safe');
  const [interceptedEvents, setInterceptedEvents] = useState<SecurityThreat[]>(MOCK_THREATS);
  const [activeAnalysis, setActiveAnalysis] = useState<{threat: SecurityThreat, analysis: SecurityAnalysis} | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // OSINT State
  const [osintReport, setOsintReport] = useState<OSINTReport | null>(null);
  const [isOsintLoading, setIsOsintLoading] = useState(false);
  const userEmail = "ashish.shrivastav2026@gmail.com";

  // Simulate incoming events
  useEffect(() => {
    const timer = setInterval(() => {
      // Small chance to simulate an "intercepted" event in the console
      if (Math.random() < 0.1) {
        // Just adding a log to signify the background service is running
        console.log("[BackgroundService] Monitoring FileSystem & Accessibility...");
      }
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time automated interceptions
  useEffect(() => {
    const simulationTimer = setTimeout(() => {
      // Simulate an automated URL interception after 10 seconds
      const automatedThreat: SecurityThreat = {
        id: 'auto-intercept-1',
        type: 'url',
        source: 'http://secure-update-patch.xyz/verify',
        timestamp: Date.now(),
        rawMetadata: {
          automated: true,
          reputation: 'Malicious',
          domainAge: '2 days'
        }
      };
      handleIntercept(automatedThreat);
    }, 10000);
    
    return () => clearTimeout(simulationTimer);
  }, []);

  const handleIntercept = async (threat: SecurityThreat) => {
    setIsAnalyzing(true);
    setStatus('Scanning');
    
    // Simulate Shadow Sandbox hashing/checking
    await new Promise(r => setTimeout(r, 2000));
    
    const analysis = await analyzeThreat(threat);
    setActiveAnalysis({ threat, analysis });
    setIsAnalyzing(false);
    
    if (analysis.riskLevel === 'Critical' || analysis.riskLevel === 'High') {
      setStatus('Warning');
    } else {
      setStatus('Safe');
    }
  };

  const runOsintScan = async () => {
    setIsOsintLoading(true);
    const report = await checkEmailBreach(userEmail);
    setOsintReport(report);
    setIsOsintLoading(false);
  };

  const resolveThreat = (resolved: boolean) => {
    if (activeAnalysis) {
      if (resolved) {
        setInterceptedEvents(prev => prev.filter(t => t.id !== activeAnalysis.threat.id));
      }
      setActiveAnalysis(null);
      setStatus('Safe');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Header */}
      <header className="max-w-7xl mx-auto p-8 flex justify-between items-center relative z-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">GUARDIAN<span className="text-blue-500">HUB</span></h1>
          <p className="text-slate-400 font-medium uppercase tracking-widest text-[10px] mt-1">Zero-Trust Automated Protection</p>
        </div>
        <div className="hidden sm:flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-full px-5 py-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          <span className="text-sm font-bold opacity-80">Gemini Nano Active</span>
        </div>
      </header>

      {/* Main Bento Grid */}
      <main className="max-w-7xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[120px] md:auto-rows-auto">
          
          {/* Central Shield - Large Feature Card */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className={`col-span-1 md:col-span-2 md:row-span-4 bg-slate-900 border-2 rounded-[32px] p-10 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-700 ${
              status === 'Safe' ? 'border-emerald-500/40' : 
              status === 'Scanning' ? 'border-blue-500' : 
              status === 'Warning' ? 'border-rose-500' : 'border-amber-500'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-b opacity-10 pointer-events-none transition-colors duration-700 ${
              status === 'Safe' ? 'from-emerald-500' : 
              status === 'Scanning' ? 'from-blue-500' : 
              status === 'Warning' ? 'from-rose-500' : 'from-amber-500'
            }`} />
            
            <div 
              onClick={() => setStatus(status === 'Safe' ? 'Scanning' : 'Safe')}
              className={`relative cursor-pointer w-48 h-48 rounded-full border-4 flex items-center justify-center mb-8 bg-slate-950 transition-all duration-700 ${
                status === 'Safe' ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)]' : 
                status === 'Scanning' ? 'border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.3)]' : 
                status === 'Warning' ? 'border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.3)]' : 
                'border-amber-500 shadow-[0_0_50_rgba(245,158,11,0.2)]'
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={status}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  {status === 'Safe' && <ShieldCheck className="w-24 h-24 text-emerald-500" />}
                  {status === 'Scanning' && <Loader2 className="w-24 h-24 text-blue-500 animate-spin" />}
                  {status === 'Warning' && <ShieldAlert className="w-24 h-24 text-rose-500" />}
                  {status === 'Locked' && <Lock className="w-24 h-24 text-amber-400" />}
                </motion.div>
              </AnimatePresence>
            </div>

            <h2 className="text-4xl font-black mb-2 tracking-tight">
              {status === 'Safe' ? 'SYSTEM SECURE' : 
               status === 'Scanning' ? 'ACTIVE SCAN' : 
               status === 'Warning' ? 'THREAT FOUND' : 'SHIELD LOCKED'}
            </h2>
            <p className="text-slate-400 text-lg font-medium">
              {status === 'Safe' ? 'Monitoring 14 active processes' : 
               status === 'Scanning' ? 'Analyzing local threat database' : 
               status === 'Warning' ? 'Isolation protocol initiated' : 'Manual verification required'}
            </p>
          </motion.div>

          {/* AI Analysis Quote Card */}
          <div className="col-span-1 md:col-span-2 bg-slate-900 border border-slate-800 rounded-[32px] p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">AI Insights (Gemini Nano)</h3>
            </div>
            <p className="text-slate-300 italic text-xl leading-relaxed font-medium">
              "{status === 'Safe' ? 'The environment is stable. Accessibility services are monitoring for cross-app injection patterns.' : 
               status === 'Scanning' ? 'Interpreting raw metadata from the last background download...' : 
               'Critical mismatch detected in file signature. Moving process to Shadow Sandbox for isolated execution.'}"
            </p>
          </div>

          {/* OSINT / Identity Protection Card */}
          <div className="col-span-1 md:col-span-2 bg-slate-900 border border-slate-800 rounded-[32px] p-8 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Identity Protection</h3>
                {osintReport?.status === 'Breached' && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="bg-rose-500 rounded-full p-1 shadow-[0_0_10px_rgba(244,63,94,0.5)] animate-pulse"
                  >
                    <ShieldAlert className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </div>
              <button 
                onClick={runOsintScan}
                disabled={isOsintLoading}
                className="text-[10px] font-black bg-purple-500/10 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full uppercase tracking-widest hover:bg-purple-500/20 transition-all disabled:opacity-50"
              >
                {isOsintLoading ? 'Scanning...' : 'Run OSINT Scan'}
              </button>
            </div>

            <div className="flex-1 space-y-4">
              {osintReport ? (
                <>
                  <div className={`p-4 rounded-2xl border ${osintReport.status === 'Breached' ? 'border-rose-500/30 bg-rose-500/5' : 'border-emerald-500/30 bg-emerald-500/5'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-2 h-2 rounded-full ${osintReport.status === 'Breached' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                      <span className="text-sm font-bold uppercase tracking-tight">
                        Identity {osintReport.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">{osintReport.summary}</p>
                  </div>
                  
                  {osintReport.breaches.length > 0 && (
                    <div className="space-y-2">
                       <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Compromised Sources</p>
                       <div className="grid grid-cols-1 gap-2">
                         {osintReport.breaches.map((b, i) => (
                           <div key={i} className="flex items-start justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                             <div className="flex flex-col gap-1">
                               <span className="text-xs font-bold text-slate-200">{b.source}</span>
                               <span className="text-[9px] text-slate-500 uppercase font-mono tracking-tight">{b.date} • {b.dataTypes.join(', ')}</span>
                               <span className="text-[10px] text-blue-400/80 italic leading-tight mt-0.5">Used as: {b.usageContext}</span>
                             </div>
                             <AlertTriangle className="w-3 h-3 text-rose-500/50 mt-1" />
                           </div>
                         ))}
                       </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-4 border-2 border-dashed border-slate-800 rounded-3xl opacity-40">
                   <p className="text-xs font-medium text-slate-500">No active scan report for<br/>{userEmail}</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 flex flex-col justify-between h-[180px] md:h-auto">
            <h4 className="text-slate-500 font-bold text-xs uppercase tracking-widest">Quarantined</h4>
            <div className="text-5xl font-black text-rose-500">03</div>
            <p className="text-xs text-slate-400 font-medium">Threats isolated today</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 flex flex-col justify-between h-[180px] md:h-auto">
            <h4 className="text-slate-500 font-bold text-xs uppercase tracking-widest">Web Links</h4>
            <div className="text-5xl font-black text-emerald-500">142</div>
            <p className="text-xs text-slate-400 font-medium">URLs scanned & cleared</p>
          </div>

          {/* Recent Interceptions List */}
          <div className="col-span-1 md:col-span-2 bg-slate-900 border border-slate-800 rounded-[32px] p-8">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-3 uppercase tracking-wider text-slate-300">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
              Recent Interceptions
            </h3>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
              {interceptedEvents.map((t) => (
                <motion.div 
                  key={t.id}
                  whileHover={{ x: 4, backgroundColor: 'rgba(15, 23, 42, 1)' }}
                  onClick={() => handleIntercept(t)}
                  className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-800 rounded-lg group-hover:text-blue-400 transition-colors">
                      {t.type === 'url' ? <ExternalLink className="w-4 h-4" /> : <FileWarning className="w-4 h-4" />}
                    </div>
                    <span className="text-sm font-semibold tracking-tight">{t.source}</span>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                    t.id === 'th-4' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {t.id === 'th-4' ? 'CLEARED' : 'SANDBOXED'}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* System Info / Permissions */}
          <div className="col-span-1 md:col-span-2 bg-slate-900 border border-slate-800 rounded-[32px] p-8 flex items-center justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold tracking-tight">Permission Status</h3>
              <div className="space-y-2">
                <div className="text-sm text-slate-400 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  Manage External Storage: <span className="text-emerald-400 font-bold ml-auto">GRANTED</span>
                </div>
                <div className="text-sm text-slate-400 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  Accessibility Service: <span className="text-emerald-400 font-bold ml-auto">ACTIVE</span>
                </div>
              </div>
            </div>
            <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all shadow-xl active:scale-95">
              Settings
            </button>
          </div>

        </div>
      </main>

      {/* Decision Bottom Sheet - Refined Bento Style */}
      <AnimatePresence>
        {(isAnalyzing || activeAnalysis) && (
          <motion.div 
            id="guardian-decision-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-slate-900 border-x-4 border-t-4 border-rose-500 rounded-t-[48px] shadow-[0_-20px_60px_rgba(244,63,94,0.35)] overflow-hidden"
          >
            <div className="max-w-5xl mx-auto p-10 flex flex-col md:flex-row items-center gap-8">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-12 gap-6 w-full">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-rose-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight">AI ANALYSIS IN PROGRESS</h3>
                    <p className="text-slate-400 font-medium mt-2 flex items-center justify-center gap-2">
                       <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                       Scanning URL: <span className="text-rose-200/60 break-all max-w-[200px] inline-block font-mono text-xs">...</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-4 uppercase tracking-[0.3em]">Interpreting Heuristics</p>
                  </div>
                </div>
              ) : (
                activeAnalysis && (
                  <>
                    <div className="bg-rose-500/20 p-6 rounded-3xl shrink-0">
                      <AlertTriangle className="w-16 h-16 text-rose-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-black bg-rose-500 text-white px-3 py-1 rounded-full uppercase tracking-widest">THREAT DETECTED</span>
                        <span className="text-xs opacity-40 font-mono">HASH: {activeAnalysis.threat.id.toUpperCase()}</span>
                      </div>
                      <h2 className="text-3xl font-black text-white mb-2 leading-tight uppercase tracking-tight">
                        {activeAnalysis.analysis.summary}
                      </h2>
                      <p className="text-rose-100 text-lg opacity-80 leading-relaxed font-medium">
                        {activeAnalysis.analysis.technicalDetails}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                      <button 
                        onClick={() => resolveThreat(false)}
                        className="px-10 py-5 bg-slate-100 text-slate-950 font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-white active:scale-95 transition-all"
                      >
                        Risk Visit
                      </button>
                      <button 
                        onClick={() => resolveThreat(true)}
                        className="px-10 py-5 bg-rose-600 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-rose-500 shadow-xl shadow-rose-900/40 active:scale-95 transition-all"
                      >
                        Deep Clean
                      </button>
                    </div>
                  </>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {(isAnalyzing || activeAnalysis) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
