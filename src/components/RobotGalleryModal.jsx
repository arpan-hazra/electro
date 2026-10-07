// src/components/RobotGalleryModal.jsx
import React, { useState } from 'react';
import ThreeModelViewer from './ThreeModelViewer';
import { X, Cpu, ShieldCheck, Sparkles, Activity, Layers, ExternalLink, Radio } from 'lucide-react';

export default function RobotGalleryModal({ robot, onClose }) {
  const [viewMode, setViewMode] = useState('3d'); // '3d' | 'photo'

  if (!robot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto bg-slate-900 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                  {robot.codename}
                </span>
                <span className="text-xs text-slate-400">{robot.category}</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">{robot.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-3 px-6 py-2.5 bg-slate-950/60 border-b border-slate-800">
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === '3d'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Interactive 3D Robotics Model
          </button>
          <button
            onClick={() => setViewMode('photo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'photo'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            High-Resolution Photo & Field Telemetry
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Visual Display: 3D or Photo (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {viewMode === '3d' ? (
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                <ThreeModelViewer
                  modelType={robot.model3dType}
                  title={robot.name}
                  height="400px"
                />
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden border border-slate-800 relative h-[400px]">
                <img
                  src={robot.image}
                  alt={robot.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-mono text-cyan-300 bg-slate-950/80 px-3 py-1 rounded-lg border border-cyan-500/30">
                    Field Telemetry Photo • Quartz Arpan Robotics Lab
                  </span>
                </div>
              </div>
            )}

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Robotics Engineering Narrative
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">{robot.description}</p>
            </div>
          </div>

          {/* Technical Specifications (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5 font-bold">
                <Cpu className="w-3.5 h-3.5" />
                Hardware Architecture & Specs
              </h4>
              <div className="space-y-2 text-xs font-mono">
                {robot.specs &&
                  Object.entries(robot.specs).map(([key, val]) => (
                    <div key={key} className="flex flex-col border-b border-slate-850 pb-2">
                      <span className="text-slate-400 uppercase text-[10px] tracking-wider">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="text-white font-semibold mt-0.5">{val}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/20 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-slate-400 block">Lead Robotics Architect</span>
                <span className="text-sm font-bold text-white">Arpan (Quartz Arpan)</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
                {robot.status}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
