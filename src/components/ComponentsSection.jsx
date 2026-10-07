// src/components/ComponentsSection.jsx
import React, { useState } from 'react';
import { COMPONENT_CATEGORIES, ELECTRONIC_COMPONENTS } from '../data/componentsData';
import { useAuth } from '../context/AuthContext';
import { Cpu, Box, Bookmark, Eye, Zap, Layers, Sparkles, Filter, ChevronRight } from 'lucide-react';

export default function ComponentsSection({ searchQuery, onSelectComponent }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user, toggleBookmark } = useAuth();

  // Filter components by category and search query
  const filteredComponents = ELECTRONIC_COMPONENTS.filter((comp) => {
    const matchCat = selectedCategory === 'all' || comp.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <section id="components-section" className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              Complete Hardware Catalog
            </span>
            <span className="text-xs text-slate-400">All Electronic Items with 3D Models</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Electronic Components & 3D Models
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Inspect microcontrollers, sensors, actuators, and passive components in real-time 3D. Every item is verified for Quartz Arpan robotics builds.
          </p>
        </div>

        <div className="text-xs font-mono text-cyan-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl self-start md:self-auto">
          Showing {filteredComponents.length} of {ELECTRONIC_COMPONENTS.length} items
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {COMPONENT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Components */}
      {filteredComponents.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
          <Cpu className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No components found</h3>
          <p className="text-xs text-slate-400 mt-1">Try modifying your search or choosing another category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredComponents.map((item) => {
            const isBookmarked = user?.bookmarks?.includes(item.id);

            return (
              <div
                key={item.id}
                className="group relative bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-cyan-500/10 transition-all flex flex-col justify-between"
              >
                {/* Image Container with Badges */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 shadow-md">
                      {item.badge}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(item.id);
                      }}
                      className={`p-1.5 rounded-lg backdrop-blur-md transition-all ${
                        isBookmarked
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-950/70 text-slate-400 hover:text-white'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Save Bookmark'}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  {/* Bottom Voltage Spec */}
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300">
                    <span className="bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                      {item.voltage}
                    </span>
                    <span className="text-cyan-400 font-bold flex items-center gap-1">
                      <Box className="w-3 h-3" />
                      3D Model Ready
                    </span>
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags?.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-950 text-slate-400 border border-slate-850"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <button
                    onClick={() => onSelectComponent(item)}
                    className="w-full mt-2 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 hover:border-cyan-500 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm group/btn"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>Inspect in 3D & Pinout</span>
                    <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
