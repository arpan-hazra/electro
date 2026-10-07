// src/components/ProjectsSection.jsx
import React from 'react';
import { QUARTZ_ARPAN_PROJECTS } from '../data/projectsData';
import { useAuth } from '../context/AuthContext';
import { Zap, Cpu, Bookmark, Sparkles, Clock, Activity, Code, ChevronRight, Box } from 'lucide-react';

export default function ProjectsSection({ onSelectProject, onSelectComponent }) {
  const { user, toggleSaveProject } = useAuth();

  return (
    <section id="projects-section" className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Engineered by Arpan
            </span>
            <span className="text-xs text-slate-400">Quartz Arpan Project Series</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Quartz Arpan Electronics & Robotics Projects
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Real projects built with components from our 3D library. Each project includes complete wiring diagrams, tested Arduino C++ code, and 3D previews.
          </p>
        </div>

        <div className="text-xs font-mono text-cyan-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl self-start md:self-auto">
          {QUARTZ_ARPAN_PROJECTS.length} Comprehensive Project Builds
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {QUARTZ_ARPAN_PROJECTS.map((proj) => {
          const isSaved = user?.savedProjects?.includes(proj.id);

          return (
            <div
              key={proj.id}
              className="group bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-3xl overflow-hidden shadow-2xl hover:shadow-cyan-500/10 transition-all flex flex-col justify-between"
            >
              {/* Image banner */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-950">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-slate-950/85 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                    {proj.series}
                  </span>
                  <button
                    onClick={() => toggleSaveProject(proj.id)}
                    className={`p-2 rounded-xl backdrop-blur-md transition-all ${
                      isSaved
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-950/70 text-slate-400 hover:text-white'
                    }`}
                    title={isSaved ? 'Saved in Profile' : 'Save Project'}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Bottom Meta */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-300">
                  <span className="bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {proj.buildTime}
                  </span>
                  <span className="bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 text-cyan-300 font-bold">
                    Diff: {proj.difficulty}
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-400">
                    <span>{proj.category}</span>
                    <span>•</span>
                    <span className="text-cyan-400 font-semibold font-mono">By Arpan</span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {proj.summary}
                  </p>
                </div>

                {/* Components Used Snippet */}
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-xs font-mono text-slate-400 block mb-2">BOM Highlights:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.componentsUsed.slice(0, 4).map((c, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        {c.name.split(' ')[0]} {c.name.split(' ')[1]}
                      </span>
                    ))}
                    {proj.componentsUsed.length > 4 && (
                      <span className="px-2 py-1 rounded-lg text-xs font-mono text-slate-500">
                        +{proj.componentsUsed.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Launch Button */}
                <button
                  onClick={() => onSelectProject(proj)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <Box className="w-4 h-4" />
                  <span>Inspect 3D Project & Arduino Firmware</span>
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
