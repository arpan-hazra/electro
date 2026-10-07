import React, { useState } from 'react';
import ThreeModelViewer from './ThreeModelViewer';
import { Cpu, Zap, Box, Radio, Sparkles, ChevronRight, Play, ShieldCheck, Activity } from 'lucide-react';
import { YoutubeIcon } from './Icons';

export default function HeroSection({
  onExploreComponents,
  onLaunchWorkbench,
  onExploreProjects,
  onExploreRobots,
  onExploreVideos,
}) {
  const [heroModel, setHeroModel] = useState('robot_rover'); // 'robot_rover' | 'arduino' | 'ultrasonic' | 'quartz' | 'robot_arm'

  const heroModelsList = [
    { id: 'robot_rover', label: 'Quartz Arpan 4WD Rover' },
    { id: 'robot_arm', label: 'Bionic Robotic Arm' },
    { id: 'arduino', label: 'Arduino Uno R3' },
    { id: 'ultrasonic', label: 'HC-SR04 Sonar' },
    { id: 'quartz', label: '16MHz Quartz Resonator' },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-cyan-500/15 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
      {/* Background Neon Grid Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950/0 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Mission, Title, Taglines & CTAs (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono shadow-lg shadow-cyan-500/5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Created & Engineered by Arpan • Quartz Arpan Labs</span>
            </div>

            {/* Main Title */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Interactive <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">3D Electronics</span> & Robotics Studio
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
                Explore every electronic component in interactive 3D with 360° rotation, examine exact pinouts, simulate circuits on virtual breadboards, and build real-world autonomous robots engineered by <strong className="text-cyan-300">Arpan</strong>.
              </p>
            </div>

            {/* Fast Stats Row */}
            <div className="grid grid-cols-3 gap-3 py-2 max-w-lg">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">100%</span>
                <span className="text-[11px] text-slate-400 block font-medium">Interactive 3D WebGL</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xl sm:text-2xl font-black text-white font-mono">14+</span>
                <span className="text-[11px] text-slate-400 block font-medium">3D Hardware Items</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xl sm:text-2xl font-black text-purple-400 font-mono">16 MHz</span>
                <span className="text-[11px] text-slate-400 block font-medium">Quartz Clock Timing</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onLaunchWorkbench}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <Box className="w-4 h-4 fill-current" />
                Launch 3D Workbench
              </button>

              <button
                onClick={onExploreProjects}
                className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 text-white border border-slate-700/80 hover:border-cyan-500/40 text-sm font-bold transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                Quartz Arpan Projects
              </button>

              <button
                onClick={onExploreRobots}
                className="px-5 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-sm font-medium transition-all flex items-center gap-2"
              >
                <Radio className="w-4 h-4 text-purple-400" />
                Robot Gallery
              </button>

              <button
                onClick={onExploreVideos}
                className="px-5 py-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 text-sm font-bold transition-all flex items-center gap-2"
              >
                <YoutubeIcon className="w-4 h-4 text-rose-400" />
                YouTube Video Hub
              </button>
            </div>

            {/* Creator Badge with Arpan's Image */}
            <div className="flex items-center gap-3 pt-2">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-cyan-400 shadow-lg shadow-cyan-500/25 shrink-0 bg-slate-900">
                  <img src="/arpan.png" alt="Mr. Arpan" className="w-full h-full object-cover object-top" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Engineered by Mr. Arpan</span>
                <span className="text-[11px] text-cyan-400 font-mono">Quartz Arpan Electronics & Robotics Studio</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Live 3D Model Viewport (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {/* Model Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 self-center lg:self-start">
              {heroModelsList.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setHeroModel(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                    heroModel === m.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* 3D Model Display Card */}
            <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-slate-950 shadow-2xl shadow-cyan-500/10">
              <ThreeModelViewer
                modelType={heroModel}
                title={heroModelsList.find((m) => m.id === heroModel)?.label}
                height="420px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
