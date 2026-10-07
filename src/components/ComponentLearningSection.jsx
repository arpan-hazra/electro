// src/components/ComponentLearningSection.jsx
import React, { useState, useEffect } from 'react';
import {
  COMPONENT_THEORY_CATEGORIES,
  COMPONENT_LEARNING_MODULES,
} from '../data/componentLearningData';
import {
  Play,
  BookOpen,
  Save,
  Trash2,
  Bookmark,
  CheckCircle2,
  Sparkles,
  Zap,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Smartphone,
  HardDrive,
} from 'lucide-react';
import { YoutubeIcon } from './Icons';

const STORAGE_NOTES_KEY = 'quartzlab_saved_component_notes';

export default function ComponentLearningSection({ onSelect3DModel }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModule, setActiveModule] = useState(COMPONENT_LEARNING_MODULES[0]);
  const [activeVideoPlayer, setActiveVideoPlayer] = useState(true);

  // Persistent Saved Memory / Lab Notes
  const [userNotes, setUserNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NOTES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [currentNoteText, setCurrentNoteText] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  // Sync current note text when active module changes
  useEffect(() => {
    setCurrentNoteText(userNotes[activeModule.id] || '');
    setSaveStatus('');
  }, [activeModule, userNotes]);

  // Save note to browser memory
  const handleSaveNote = () => {
    const updated = {
      ...userNotes,
      [activeModule.id]: currentNoteText,
    };
    setUserNotes(updated);
    try {
      localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(updated));
      setSaveStatus('Saved in Browser Memory!');
      setTimeout(() => setSaveStatus(''), 2500);
    } catch (e) {
      setSaveStatus('Storage Error');
    }
  };

  // Delete note
  const handleDeleteNote = () => {
    const updated = { ...userNotes };
    delete updated[activeModule.id];
    setUserNotes(updated);
    setCurrentNoteText('');
    localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(updated));
    setSaveStatus('Note Cleared');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const filteredModules = COMPONENT_LEARNING_MODULES.filter(
    (m) => selectedCategory === 'all' || m.category === selectedCategory
  );

  return (
    <section
      id="learning-section"
      className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 flex items-center gap-1.5">
              <YoutubeIcon className="w-3.5 h-3.5 text-rose-400" />
              Video Masterclass & Component Theory
            </span>
            <span className="text-xs text-slate-400">Resistors • Diodes • Inductors • Physics</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Electronic Components Video Knowledge & Theory Hub
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            In-depth engineering tutorials, YouTube video breakdowns, mathematical equations, and persistent memory storage for your lab notes.
          </p>
        </div>

        {/* Saved Memory Indicator Badge */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-2xl text-xs font-mono text-cyan-300 self-start md:self-auto">
          <HardDrive className="w-4 h-4 text-cyan-400" />
          <span>Local Memory: {Object.keys(userNotes).length} Notes Saved</span>
        </div>
      </div>

      {/* Category Navigation Pills (Touch / Mobile Friendly) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {COMPONENT_THEORY_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/20'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Active Module Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {filteredModules.map((mod) => (
          <button
            key={mod.id}
            onClick={() => setActiveModule(mod)}
            className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between gap-2 ${
              activeModule.id === mod.id
                ? 'bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border-rose-500/50 shadow-xl shadow-rose-500/10'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                {mod.category}
              </span>
              <span className="text-[11px] font-mono text-slate-500">{mod.duration}</span>
            </div>
            <h4
              className={`text-xs font-bold line-clamp-2 ${
                activeModule.id === mod.id ? 'text-white' : 'text-slate-300'
              }`}
            >
              {mod.title}
            </h4>
          </button>
        ))}
      </div>

      {/* Main Learning Hub Layout: Video Player + Interactive Theory + Persistent Memory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Responsive Video Player + Type Variations (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* YouTube Embedded Video Player Card */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
            {/* 16:9 Aspect Ratio Responsive Container */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${activeModule.youtubeVideoId}?rel=0&modestbranding=1`}
                title={activeModule.youtubeTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Details Bar */}
            <div className="p-4 sm:p-5 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-850">
              <div>
                <span className="text-[11px] font-mono text-rose-400 font-semibold flex items-center gap-1.5">
                  <YoutubeIcon className="w-3.5 h-3.5" />
                  {activeModule.channel} • {activeModule.duration}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {activeModule.youtubeTitle}
                </h3>
              </div>

              <a
                href={`https://www.youtube.com/watch?v=${activeModule.youtubeVideoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-mono font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0"
              >
                <span>Open on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Deep-Dive Varieties & Types (Resistors, Diodes, Inductors) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Comprehensive Types & Working Variations ({activeModule.typesDetailed.length})
              </h3>
              <span className="text-[11px] font-mono text-slate-400">QuartzLab Syllabus</span>
            </div>

            <div className="space-y-3">
              {activeModule.typesDetailed.map((t, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 hover:border-cyan-500/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-cyan-300 font-mono">
                      #{idx + 1}. {t.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-2">{t.desc}</p>
                  <div className="flex items-start gap-1.5 text-[11px] font-mono text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                    <span className="text-amber-400 font-bold shrink-0">Applications:</span>
                    <span>{t.applications}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resistor Color Code Guide if Resistor module */}
          {activeModule.colorCodeGuide && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Resistor Color Band Reference Matrix (4-Band & 5-Band)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                {activeModule.colorCodeGuide.map((col, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 flex flex-col justify-between"
                  >
                    <span className="text-white font-bold">{col.color}</span>
                    <span className="text-slate-400 text-[10px]">Digit: {col.digit}</span>
                    <span className="text-cyan-400 text-[10px]">{col.multiplier}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Physics Equations & Persistent Browser Memory Notebook (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Theoretical Physics & Formulas Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-4 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Fundamental Formulas & Circuit Physics
            </h4>

            <div className="space-y-2.5">
              {activeModule.theoryFormulas.map((f, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{f.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300">
                      Standard
                    </span>
                  </div>
                  <div className="text-sm font-mono font-bold text-cyan-400 my-0.5">{f.formula}</div>
                  <span className="text-[11px] text-slate-400 leading-tight">{f.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Persistent Browser Memory Notebook ("This information was saved memory") */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                    Lab Memory Notebook
                  </h4>
                  <p className="text-[10px] text-slate-400">Saved to Local Browser Memory</p>
                </div>
              </div>

              {saveStatus && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1 animate-pulse">
                  <CheckCircle2 className="w-3 h-3" />
                  {saveStatus}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Record your test observations, color codes, or diode notes for{' '}
              <strong className="text-cyan-300">{activeModule.title.split(':')[0]}</strong>. All notes persist in your browser memory even if you reload or leave!
            </p>

            {/* Note Editor Area */}
            <div className="relative mb-3">
              <textarea
                rows={5}
                value={currentNoteText}
                onChange={(e) => setCurrentNoteText(e.target.value)}
                placeholder={`Write personal lab notes for ${activeModule.title.split(':')[0]} here... (e.g., tested 1N4007 with 12V 2A motor, Vf measured at 0.72V)`}
                className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700/80 text-white text-xs font-mono focus:outline-none focus:border-cyan-400 leading-relaxed transition-colors resize-none placeholder-slate-600"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handleDeleteNote}
                disabled={!currentNoteText && !userNotes[activeModule.id]}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-500 hover:text-rose-300 border border-slate-800 text-xs font-mono font-semibold transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>

              <button
                onClick={handleSaveNote}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Save to Memory
              </button>
            </div>
          </div>

          {/* Mobile Access & Responsive Controls Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white">Full Mobile Access Optimized</h5>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                Smooth 3D orbit gestures, pinch-zoom, and responsive video playback tailored for smartphones and tablets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
