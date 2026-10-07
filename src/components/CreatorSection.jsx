// src/components/CreatorSection.jsx
import React from 'react';
import { Sparkles, Terminal, Cpu, Award, Zap, Send, ShieldCheck, Heart } from 'lucide-react';

export default function CreatorSection({ onOpenCreatorModal }) {
  return (
    <section id="creator-section" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-cyan-500/20">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/30 p-8 lg:p-12 shadow-2xl shadow-cyan-500/10">
        {/* Neon Glow Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Mr. Arpan's Official Developer Portrait (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-sm w-full">
              {/* Outer Neon Halo */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-500" />

              {/* Image Container */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-cyan-400/80 bg-slate-950 shadow-2xl">
                <img
                  src="/arpan.png"
                  alt="Mr. Arpan — Creator & Electronics Architect"
                  className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
                />

                {/* Cyber HUD Overlay Badges */}
                <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 px-3 py-1 rounded-full text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Lead Architect</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-md border border-slate-800 p-3 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold text-sm tracking-tight">Mr. Arpan</h4>
                    <p className="text-[11px] font-mono text-cyan-400">Quartz Arpan Studio</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                    VERIFIED CREATOR
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Engineering Story, Vision & Achievements (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Developer & Electronics Designer Spotlight</span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Designed, Built & Engineered by <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Arpan</span>
              </h2>
              <p className="text-sm font-mono text-cyan-400/90 mt-1">
                "Code • Build • Improve • Better Than Yesterday"
              </p>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Hi, I'm <strong className="text-white">Arpan</strong>. I built <strong className="text-cyan-300">QuartzLab 3D</strong> to bridge the gap between abstract electronic circuitry, modern WebGL 3D visualization, and practical robotics engineering.
            </p>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Every component model in this lab—from the resonant <span className="text-cyan-300 font-mono">16.000 MHz quartz crystal oscillator</span> to autonomous ultrasonic obstacle-avoiding rovers and articulated robotic arms—has been programmed and tested so you can inspect pinouts, simulate circuits, and build your own hardware projects with confidence.
            </p>

            {/* Skill Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] font-mono text-cyan-400 block mb-0.5">Specialization</span>
                <span className="text-xs font-bold text-white">Robotics & MCU Firmware</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] font-mono text-purple-400 block mb-0.5">3D Web Graphics</span>
                <span className="text-xs font-bold text-white">Three.js Procedural CAD</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] font-mono text-emerald-400 block mb-0.5">Hardware Lab</span>
                <span className="text-xs font-bold text-white">Quartz Arpan Projects</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onOpenCreatorModal}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
              >
                <Terminal className="w-4 h-4" />
                <span>Open Arpan's Profile & Send Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
