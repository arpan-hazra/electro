import React from 'react';
import { Cpu, Heart, Sparkles, Zap, Radio, Box, ArrowUp } from 'lucide-react';
import { YoutubeIcon } from './Icons';

export default function Footer({ onOpenCreator, onSelectSection }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-cyan-500/20 text-slate-400 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                QuartzLab <span className="text-cyan-400">3D</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The premier interactive 3D electronics simulation and robotics studio. Engineered to turn ideas into tangible smart hardware.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Made with pride by Arpan
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-4">
              Platform Features
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onSelectSection('components')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  3D Component Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('learning')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <YoutubeIcon className="w-3.5 h-3.5 text-rose-400" />
                  YouTube Video Hub & Theory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('workbench')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <Box className="w-3.5 h-3.5 text-cyan-400" />
                  Virtual Circuit Workbench
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('projects')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Quartz Arpan Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('robots')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <Radio className="w-3.5 h-3.5 text-purple-400" />
                  Autonomous Robot Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Quartz Arpan Project Suite */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-4">
              Featured Builds
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-300">Quartz Arpan 4WD Obstacle Rover</li>
              <li className="text-slate-300">4-DOF Bionic Articulated Arm</li>
              <li className="text-slate-300">16MHz Quartz Master Oscillator</li>
              <li className="text-slate-300">Smart IoT Environmental Station</li>
              <li className="text-slate-300">HexaViper Biomimetic Spider Bot</li>
            </ul>
          </div>

          {/* Creator Profile Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Lead Architect</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-cyan-400 shrink-0 shadow-md">
                  <img src="/arpan.png" alt="Mr. Arpan" className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">Mr. Arpan</h5>
                  <span className="text-[11px] font-mono text-cyan-400">Quartz Arpan</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Electronics hardware designer, robotics programmer, and architect of QuartzLab 3D.
              </p>
            </div>

            <button
              onClick={onOpenCreator}
              className="mt-4 w-full py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 text-xs font-mono font-bold transition-all"
            >
              Contact Arpan / Bio
            </button>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1 text-slate-400">
            <span>© {new Date().getFullYear()} QuartzLab 3D. Created and Engineered by</span>
            <span className="text-white font-bold">Arpan</span>
            <span>(Quartz Arpan Innovations).</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
