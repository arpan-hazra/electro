// src/screens/SplashScreen.jsx
import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useUpdate } from '../context/UpdateContext';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const { currentAccent } = useTheme();
  const { installedVersion } = useUpdate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 250);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-slate-900 text-white select-none overflow-hidden">
      {/* Background ambient glowing spheres */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl animate-pulse" />

      {/* Top placeholder */}
      <div className="h-10" />

      {/* Center Brand Identity */}
      <div className="flex flex-col items-center text-center relative z-10 animate-fade-in">
        {/* Animated Brand Emblem */}
        <div className="relative mb-6">
          <div className={`w-24 h-24 rounded-3xl bg-gradient-to-tr ${currentAccent.gradient} flex items-center justify-center shadow-2xl shadow-purple-500/40 animate-pulse-subtle`}>
            <svg
              className="w-12 h-12 text-white"
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
          <div className="absolute -inset-1 rounded-3xl bg-white/20 blur-sm -z-10" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          Vibely
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-xs font-medium">
          Original, vibrant & privacy-first messaging.
        </p>

        {/* Progress bar */}
        <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-8 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${currentAccent.gradient} transition-all duration-300 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom Version & Safety Seal */}
      <div className="flex flex-col items-center gap-1.5 text-xs text-slate-400 relative z-10">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Vibely Version {installedVersion}</span>
        </div>
        <p className="text-[11px] text-slate-400">End-to-End Secure • Anti-Spam Protected</p>
      </div>
    </div>
  );
}
