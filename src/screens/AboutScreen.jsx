// src/screens/AboutScreen.jsx
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useUpdate } from '../context/UpdateContext';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Smartphone,
  Wifi,
  Database,
  Lock,
  Layers,
  Heart
} from 'lucide-react';

export default function AboutScreen() {
  const { currentAccent } = useTheme();
  const {
    installedVersion,
    isUpdateAvailable,
    isCheckingUpdate,
    checkVersion,
    serverVersionConfig,
    simulateNewVersion,
    resetVersionToDefault
  } = useUpdate();

  const [simVersionInput, setSimVersionInput] = useState('0.2');
  const [simNotice, setSimNotice] = useState('');

  const handleSimulate = async (e) => {
    e.preventDefault();
    if (!simVersionInput.trim()) return;
    const res = await simulateNewVersion(simVersionInput.trim(), 'minor', false, [
      'New real-time audio and video status indicators',
      'Enhanced high-resolution media gallery',
      'Refined light/dark mode contrast and animations',
      'Comprehensive safety and blocking controls'
    ]);
    if (res?.success) {
      setSimNotice(`Version ${simVersionInput} simulated on server! Checking for updates...`);
      setTimeout(() => setSimNotice(''), 3000);
      checkVersion(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Brand Banner Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border border-purple-900/40 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            {/* Original Vibely App Icon */}
            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-tr ${currentAccent.gradient} flex items-center justify-center shadow-2xl shadow-purple-500/50 shrink-0`}>
              <svg
                className="w-12 h-12 text-white drop-shadow-md"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12h2l3-6 4 12 3-8 2 4 2-2" />
              </svg>
            </div>

            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight">Vibely</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm border border-white/20">
                  Version {installedVersion}
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 max-w-lg leading-relaxed">
                An original, colorful messaging and social communication application designed with a unique visual identity, responsive ergonomics, and cloud-first synchronization.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Original Branding</h4>
            <p className="text-[11px] text-slate-500 mt-1">Distinctive sound-crest iconography, vibrant gradients, and bespoke theme styling.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-3">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Cloud Backend</h4>
            <p className="text-[11px] text-slate-500 mt-1">Real database persistence for user accounts, chats, media gallery, and safety rules.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Privacy Protected</h4>
            <p className="text-[11px] text-slate-500 mt-1">Granular who-can-contact rules, instant blocking, and anti-spam rate limiting.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-3">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Android Optimized</h4>
            <p className="text-[11px] text-slate-500 mt-1">Responsive mobile-first navigation, fluid gestures, and lightweight animations.</p>
          </div>
        </div>

        {/* Update Checker & Simulator Panel */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Vibely Version & Update System</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Current build: v{installedVersion} (Production Channel)
              </p>
            </div>

            <button
              onClick={() => checkVersion(true)}
              disabled={isCheckingUpdate}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
              <span>{isCheckingUpdate ? 'Checking...' : 'Check for Updates'}</span>
            </button>
          </div>

          {simNotice && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{simNotice}</span>
            </div>
          )}

          {/* Simulator Form to test in-app updates */}
          <form onSubmit={handleSimulate} className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              Test In-App Update:
            </span>
            <input
              type="text"
              value={simVersionInput}
              onChange={(e) => setSimVersionInput(e.target.value)}
              placeholder="e.g. 0.2"
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white w-28 text-center font-bold"
            />
            <button
              type="submit"
              className={`px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm bg-gradient-to-r ${currentAccent.gradient} hover:opacity-95`}
            >
              Simulate Server Release
            </button>
            <button
              type="button"
              onClick={resetVersionToDefault}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 ml-auto"
            >
              Reset to v0.1
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 py-4 flex items-center justify-center gap-1.5">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for a vibrant, original social experience.</span>
        </div>
      </div>
    </div>
  );
}
