// src/components/RobotGallery.jsx
import React from 'react';
import { ROBOT_GALLERY } from '../data/robotGalleryData';
import { Radio, Box, Sparkles, ChevronRight, Cpu, Eye, ShieldCheck } from 'lucide-react';

export default function RobotGallery({ onSelectRobot }) {
  return (
    <section id="robots-section" className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              Robotics Laboratory
            </span>
            <span className="text-xs text-slate-400">Engineered by Arpan</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Quartz Arpan Robotics Showcase
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Autonomous planetary rovers, high-torque kinematic robotic arms, bio-inspired hexapods, and combat bots designed and field-tested by Arpan.
          </p>
        </div>

        <div className="text-xs font-mono text-purple-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl self-start md:self-auto">
          {ROBOT_GALLERY.length} Autonomous Systems Active
        </div>
      </div>

      {/* Grid of Robots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ROBOT_GALLERY.map((robot) => (
          <div
            key={robot.id}
            onClick={() => onSelectRobot(robot)}
            className="group cursor-pointer bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-purple-500/10 transition-all flex flex-col justify-between"
          >
            {/* Robot Image Container */}
            <div className="relative h-56 w-full overflow-hidden bg-slate-950">
              <img
                src={robot.image}
                alt={robot.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

              {/* Codename Badge */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-slate-950/85 backdrop-blur-md text-purple-300 border border-purple-500/30">
                  {robot.codename}
                </span>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-950/80 text-cyan-300 border border-cyan-500/30">
                  {robot.badge}
                </span>
              </div>

              {/* Status */}
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span className="bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                  {robot.category}
                </span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {robot.status.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  {robot.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {robot.description}
                </p>
              </div>

              {/* Quick Specs Highlight */}
              <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-2.5 text-[11px] font-mono text-slate-300 flex items-center justify-between">
                <span className="text-slate-500">Designer:</span>
                <span className="text-cyan-300 font-bold">{robot.designedBy}</span>
              </div>

              {/* Button */}
              <button className="w-full py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500 text-purple-300 hover:text-slate-950 border border-purple-500/30 hover:border-purple-500 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 group/btn">
                <Box className="w-3.5 h-3.5" />
                <span>Inspect 3D Robot & Telemetry</span>
                <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
