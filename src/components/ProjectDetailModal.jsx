// src/components/ProjectDetailModal.jsx
import React, { useState } from 'react';
import ThreeModelViewer from './ThreeModelViewer';
import { useAuth } from '../context/AuthContext';
import { X, Bookmark, Code, Copy, Check, Cpu, Zap, Layers, Sparkles, ChevronRight, Activity } from 'lucide-react';

export default function ProjectDetailModal({ project, onClose, onSelectComponent }) {
  const { user, toggleSaveProject } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'wiring' | 'code'
  const [copiedCode, setCopiedCode] = useState(false);

  if (!project) return null;

  const isSaved = user?.savedProjects?.includes(project.id);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(project.arduinoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto bg-slate-900 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                  {project.series}
                </span>
                <span className="text-xs text-slate-400">Created by {project.author}</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">{project.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveProject(project.id)}
              className={`p-2.5 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
              }`}
              title={isSaved ? 'Remove Bookmark' : 'Save Project'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 px-6 py-2.5 bg-slate-950/60 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3D Preview & Overview
          </button>
          <button
            onClick={() => setActiveTab('wiring')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'wiring'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bill of Materials & Wiring
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Arduino C++ Code
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 3D Model Preview */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                  <ThreeModelViewer
                    modelType={project.model3dType}
                    title={project.title}
                    height="380px"
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                  <span>Difficulty: {project.difficulty}</span>
                  <span>Est. Assembly: {project.buildTime}</span>
                </div>
              </div>

              {/* Project Specs & Narrative */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                    Project Summary
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{project.summary}</p>
                </div>

                {/* Key Features */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Key Architectural Features
                  </h4>
                  <div className="space-y-2">
                    {project.keyFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Creator Stamp */}
                <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/20 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono">
                    QA
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Quartz Arpan Verified Project</h5>
                    <p className="text-[11px] text-slate-400">Tested and validated in Arpan's electronics lab.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wiring' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Components List */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  Bill of Materials (BOM)
                </h4>
                <div className="space-y-2">
                  {project.componentsUsed.map((c, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-white block">{c.name}</span>
                        <span className="text-[11px] font-mono text-cyan-400">Qty: {c.qty} unit</span>
                      </div>
                      {onSelectComponent && (
                        <button
                          onClick={() => onSelectComponent(c.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1"
                        >
                          3D Model <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pin Connections Table */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Point-to-Point Wiring Schedule
                </h4>
                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Component Terminal</th>
                        <th className="py-2.5 px-3">Connects To (Destination)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {project.wiringTable.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/40">
                          <td className="py-2.5 px-3 font-semibold text-cyan-300">{row.component}</td>
                          <td className="py-2.5 px-3 text-slate-300">{row.connectTo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Firmware Source:</span>
                  <span className="text-xs font-mono font-bold text-cyan-400">Arduino C++ (.ino)</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Arduino Code
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 overflow-x-auto max-h-[500px]">
                <pre className="text-xs font-mono text-slate-300 leading-relaxed">{project.arduinoCode}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
