// src/components/ComponentDetailModal.jsx
import React, { useState } from 'react';
import ThreeModelViewer from './ThreeModelViewer';
import { useAuth } from '../context/AuthContext';
import { X, Bookmark, Zap, Cpu, Check, Layers, ExternalLink, Activity, Info, Tag } from 'lucide-react';

export default function ComponentDetailModal({ component, onClose, onSelectProject }) {
  const { user, toggleBookmark } = useAuth();
  const [copiedPin, setCopiedPin] = useState(null);

  if (!component) return null;

  const isBookmarked = user?.bookmarks?.includes(component.id);

  const handleCopyPin = (pinStr) => {
    navigator.clipboard?.writeText(pinStr);
    setCopiedPin(pinStr);
    setTimeout(() => setCopiedPin(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto bg-slate-900 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/10 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {component.badge || 'Electronic Item'}
                </span>
                <span className="text-xs text-slate-400 capitalize">• {component.category}</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">{component.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(component.id)}
              className={`p-2.5 rounded-xl border transition-all ${
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Component'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 3D Model Explorer (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <ThreeModelViewer
                modelType={component.model3dType}
                title={component.name}
                height="380px"
              />
            </div>

            {/* Engineering & CAD Operation Guide */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  How This Component Works (Physics & Silicon)
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {component.howItWorks || component.description}
              </p>

              {/* Where and Which Projects Used */}
              <div className="bg-slate-900/80 border border-slate-850 rounded-xl p-3 mt-1">
                <span className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider block mb-1">
                  Which Systems & Circuits Use This:
                </span>
                <p className="text-xs text-slate-400">
                  {component.whereUsed || 'Essential building block for power regulation, embedded signaling, and robotic actuation.'}
                </p>
              </div>

              {/* How To Make / Index Construction */}
              <div className="bg-slate-900/80 border border-slate-850 rounded-xl p-3">
                <span className="text-[11px] font-mono font-bold text-emerald-300 uppercase tracking-wider block mb-1">
                  Manufacturing & Index Construction:
                </span>
                <p className="text-xs text-slate-400">
                  {component.makeGuide || 'Fabricated in semiconductor foundries and passive fabrication facilities with standard EIA terminal pitch.'}
                </p>
              </div>
            </div>

            {/* Used in Quartz Arpan Projects */}
            {component.usedInProjects && component.usedInProjects.length > 0 && (
              <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/20 rounded-2xl p-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Used in Quartz Arpan Project Builds:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {component.usedInProjects.map((pTitle, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm"
                    >
                      <Zap className="w-3 h-3 text-cyan-400" />
                      {pTitle}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>


          {/* Right Column: Electrical Specs & Pinout (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">Operating Voltage</span>
                <span className="text-sm font-bold text-white font-mono">{component.voltage}</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">Interface Type</span>
                <span className="text-xs font-bold text-cyan-400 font-mono truncate block" title={component.interface}>
                  {component.interface.split(',')[0]}
                </span>
              </div>
            </div>

            {/* Pinout Table */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-bold">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Terminal & Pinout Map
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Click to copy pin</span>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {component.pins && component.pins.length > 0 ? (
                  component.pins.map((pin, i) => (
                    <div
                      key={i}
                      onClick={() => handleCopyPin(pin.pin)}
                      className="group cursor-pointer p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-start justify-between gap-2"
                    >
                      <div>
                        <span className="font-mono text-xs font-bold text-cyan-300 block">{pin.pin}</span>
                        <span className="text-[11px] text-slate-400 leading-tight block">{pin.desc}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 group-hover:text-cyan-400 shrink-0">
                        {copiedPin === pin.pin ? 'Copied!' : 'Copy'}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">No external pins required.</span>
                )}
              </div>
            </div>

            {/* Detailed Hardware Specs */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-3 font-bold">
                Technical Specifications
              </h4>
              <div className="space-y-2 text-xs font-mono">
                {component.specs &&
                  Object.entries(component.specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-slate-850 pb-1.5">
                      <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-slate-200 font-semibold text-right">{v}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
