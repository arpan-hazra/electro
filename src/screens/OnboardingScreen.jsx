// src/screens/OnboardingScreen.jsx
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useUpdate } from '../context/UpdateContext';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Sparkles,
  MessageSquare,
  Image as ImageIcon,
  Wifi,
  ShieldCheck,
  Rocket,
  Heart,
  Flame,
  CheckCheck,
  Lock,
  Globe
} from 'lucide-react';

export default function OnboardingScreen({ onComplete }) {
  const { currentAccent } = useTheme();
  const { installedVersion } = useUpdate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: "A Fresh New Vibe",
      title: "Welcome to Vibely",
      description: "Step into an original, colorful messaging space crafted for pure social expression, effortless conversations, and total privacy.",
      renderIllustration: () => (
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          {/* Animated pulsing background circles */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-2xl animate-pulse" />
          <div className="absolute w-48 h-48 rounded-full border border-purple-500/30 animate-spin" style={{ animationDuration: '18s' }} />
          <div className="absolute w-56 h-56 rounded-full border border-dashed border-pink-500/20 animate-spin" style={{ animationDuration: '28s', animationDirection: 'reverse' }} />
          
          {/* Floating badge pills */}
          <div className="absolute top-2 left-2 px-3 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-[11px] font-bold text-pink-300 flex items-center gap-1.5 animate-bounce" style={{ animationDuration: '3s' }}>
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Vibely v{installedVersion}</span>
          </div>

          <div className="absolute bottom-4 right-0 px-3 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-[11px] font-bold text-blue-300 flex items-center gap-1.5 animate-bounce" style={{ animationDuration: '4s' }}>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>Pure Connections</span>
          </div>

          {/* Central Vibely Icon Shield */}
          <div className={`relative w-28 h-28 rounded-3xl bg-gradient-to-tr ${currentAccent.gradient} flex items-center justify-center shadow-2xl shadow-purple-500/40 transform hover:scale-105 transition-transform`}>
            <svg
              className="w-14 h-14 text-white drop-shadow-md"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12h2l3-6 4 12 3-8 2 4 2-2" />
            </svg>
            <div className="absolute -inset-1 rounded-3xl bg-white/20 blur-sm -z-10" />
          </div>
        </div>
      )
    },
    {
      id: 2,
      badge: "Real-Time & Expressive",
      title: "Chat with friends and family",
      description: "Chat in real-time with smooth typing indicators, custom double-tick delivery receipts, rich emoji reactions, and instant conversations.",
      renderIllustration: () => (
        <div className="relative w-64 h-64 mx-auto flex flex-col justify-center gap-3">
          {/* Incoming message bubble mockup */}
          <div className="flex items-end gap-2.5 max-w-[85%] self-start transform -rotate-1 hover:rotate-0 transition-transform">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center text-xs font-bold text-white shadow-md shrink-0">
              ML
            </div>
            <div className="p-3.5 rounded-2xl rounded-bl-sm bg-slate-800/90 border border-slate-700/80 shadow-xl backdrop-blur-md">
              <p className="text-xs text-slate-100 font-medium leading-relaxed">
                Hey Alex! Have you tried the new Vibely update yet? 💜
              </p>
              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                <span>10:42 AM</span>
              </div>
            </div>
          </div>

          {/* Outgoing message bubble mockup */}
          <div className="flex items-end gap-2.5 max-w-[85%] self-end transform rotate-1 hover:rotate-0 transition-transform">
            <div className="p-3.5 rounded-2xl rounded-br-sm bg-gradient-to-r from-purple-600 to-pink-500 shadow-xl text-white">
              <p className="text-xs font-medium leading-relaxed">
                Just hopped on! The gradients and fluid vibes are stunning! ✨
              </p>
              <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-purple-200">
                <span>10:43 AM</span>
                <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />
              </div>
            </div>
          </div>

          {/* Floating Emoji Reactions Bar */}
          <div className="self-center px-4 py-1.5 rounded-full bg-slate-800/95 border border-purple-500/40 shadow-xl flex items-center gap-3 text-sm animate-pulse-subtle">
            <span className="hover:scale-125 transition-transform cursor-pointer">❤️ 4</span>
            <span className="hover:scale-125 transition-transform cursor-pointer">🔥 2</span>
            <span className="hover:scale-125 transition-transform cursor-pointer">✨ 5</span>
            <span className="hover:scale-125 transition-transform cursor-pointer">😍</span>
          </div>
        </div>
      )
    },
    {
      id: 3,
      badge: "Visual & Interactive",
      title: "Share photos, images, and messages",
      description: "Send high-resolution photos with captions, inspect them in an interactive lightbox with zoom, and enjoy a dedicated gallery for all your shared memories.",
      renderIllustration: () => (
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          {/* Angled Photo Cards Stack */}
          <div className="absolute w-44 h-36 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-800 p-2 shadow-xl transform -rotate-12 border border-white/20 overflow-hidden">
            <div className="w-full h-full rounded-xl bg-purple-900/60 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-purple-300/60" />
            </div>
          </div>

          <div className="absolute w-44 h-36 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 p-2 shadow-2xl transform rotate-6 border border-white/30 overflow-hidden">
            <div className="w-full h-full rounded-xl bg-rose-900/60 flex flex-col items-center justify-center gap-1">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] font-bold text-white">Sunset_Vibes.webp</span>
            </div>
          </div>

          {/* Foreground preview card with badge */}
          <div className="relative w-48 h-40 rounded-2xl bg-slate-800/95 border border-slate-600/80 shadow-2xl p-2.5 flex flex-col justify-between backdrop-blur-xl">
            <div className="relative flex-1 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-black/20" />
              <div className="text-center relative z-10 text-white">
                <ImageIcon className="w-8 h-8 mx-auto mb-1 text-white" />
                <span className="text-[10px] font-bold tracking-wider uppercase bg-black/40 px-2 py-0.5 rounded-full">HD Gallery</span>
              </div>
            </div>
            <div className="pt-2 px-1 flex items-center justify-between text-[11px] text-slate-300">
              <span className="truncate max-w-[120px] font-semibold">Weekend Adventure</span>
              <span className="text-emerald-400 font-bold text-[10px]">1.8 MB</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      badge: "Always Synchronized",
      title: "Connect using Wi-Fi and the internet",
      description: "Fast, seamless cloud database synchronization keeps your conversations, media, contacts, and presence synced everywhere across any Wi-Fi or cellular network.",
      renderIllustration: () => (
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          {/* Orbiting waves */}
          <div className="absolute w-52 h-52 rounded-full border border-cyan-500/20 animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute w-40 h-40 rounded-full border border-blue-500/30" />
          
          {/* Floating connection badges */}
          <div className="absolute top-4 right-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-600/50 text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Wi-Fi Online</span>
          </div>

          <div className="absolute bottom-6 left-0 px-3 py-1.5 rounded-xl bg-blue-950/80 border border-blue-600/50 text-[11px] font-bold text-blue-300 flex items-center gap-1.5 shadow-lg">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cloud Synced</span>
          </div>

          {/* Central Global Node */}
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-700 flex flex-col items-center justify-center text-white shadow-2xl shadow-cyan-500/30 border-2 border-white/20">
            <Wifi className="w-10 h-10 text-white animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1 text-cyan-200">5G / Wi-Fi</span>
          </div>
        </div>
      )
    },
    {
      id: 5,
      badge: "Zero Compromises",
      title: "Privacy and account information",
      description: "You're in total control of your digital space. Granular who-can-contact rules, instant 1-click user blocking, safe media filters, and transparent security audits.",
      renderIllustration: () => (
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-3xl" />
          
          {/* Shield backdrop */}
          <div className="relative w-36 h-44 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-emerald-500/40 p-4 flex flex-col items-center justify-between shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            
            <div className="w-full space-y-1.5 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-400">
                <Lock className="w-3 h-3" />
                <span>Protected Account</span>
              </div>
              <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-full" />
              </div>
              <span className="text-[9px] text-slate-400">End-to-End Safety Rules</span>
            </div>
          </div>

          {/* Floating policy tags */}
          <div className="absolute top-8 left-2 px-2.5 py-1 rounded-xl bg-slate-800/90 border border-slate-700 text-[10px] font-semibold text-slate-300 shadow-md">
            🛡️ Anti-Spam
          </div>
          <div className="absolute bottom-10 right-2 px-2.5 py-1 rounded-xl bg-slate-800/90 border border-slate-700 text-[10px] font-semibold text-slate-300 shadow-md">
            🚫 1-Click Block
          </div>
        </div>
      )
    },
    {
      id: 6,
      badge: "Your Journey Begins",
      title: "Get Started",
      description: "Everything is set up and configured for your best messaging experience. Join the community, explore channels, and express yourself freely on Vibely.",
      renderIllustration: () => (
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          {/* Cosmic Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 via-pink-500/30 to-amber-500/20 rounded-full blur-3xl animate-pulse" />
          
          <div className="relative flex flex-col items-center text-center">
            {/* Rocket Launch Icon */}
            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-tr ${currentAccent.gradient} flex items-center justify-center shadow-2xl shadow-purple-500/50 mb-3 animate-bounce`} style={{ animationDuration: '2.5s' }}>
              <Rocket className="w-12 h-12 text-white transform -rotate-45" />
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 shadow-md">
                100% Ready
              </span>
            </div>
            
            <p className="text-[11px] text-slate-400 mt-2 font-medium">
              Join thousands vibing right now.
            </p>
          </div>
        </div>
      )
    }
  ];

  const current = slides[currentSlide];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950 text-white select-none overflow-hidden">
      {/* Dynamic ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Onboarding Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 flex flex-col justify-between min-h-[580px] animate-slide-up">
        {/* Top Header: Progress indicators & Skip */}
        <div className="flex items-center justify-between pb-2">
          {/* Progress Indicators (6 dots / bars) */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? `w-7 bg-gradient-to-r ${currentAccent.gradient}`
                    : idx < currentSlide
                    ? 'w-2.5 bg-purple-400/80'
                    : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Skip Button */}
          <button
            onClick={onComplete}
            className="px-3 py-1 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors"
          >
            Skip to App
          </button>
        </div>

        {/* Center Illustration & Content */}
        <div className="my-auto py-4 text-center flex flex-col items-center">
          {/* Dynamic Graphic Illustration */}
          <div className="mb-4">
            {current.renderIllustration()}
          </div>

          {/* Badge */}
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-800/60 mb-2 shadow-sm">
            {current.badge}
          </span>

          {/* Screen Title */}
          <h2 className="text-2xl font-extrabold tracking-tight text-white mb-2 leading-snug">
            {current.title}
          </h2>

          {/* Screen Description */}
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xs font-normal">
            {current.description}
          </p>
        </div>

        {/* Bottom Actions: Back, Step Count & Next/Get Started */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          {currentSlide > 0 ? (
            <button
              onClick={handlePrev}
              className="py-3 px-4 rounded-2xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div className="text-[11px] font-semibold text-slate-400 pl-2">
              Step 1 of 6
            </div>
          )}

          <div className="flex-1 flex justify-end">
            <button
              onClick={handleNext}
              className={`w-full sm:w-auto min-w-[140px] py-3 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-xl flex items-center justify-center gap-2 bg-gradient-to-r ${currentAccent.gradient} hover:opacity-95 active:scale-[0.98] transition-all`}
            >
              <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
              {currentSlide === slides.length - 1 ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <ArrowRight className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
