// src/components/UserProfileModal.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ELECTRONIC_COMPONENTS } from '../data/componentsData';
import { QUARTZ_ARPAN_PROJECTS } from '../data/projectsData';
import { X, LogOut, Bookmark, Zap, Cpu, User, Shield, ChevronRight } from 'lucide-react';

export default function UserProfileModal({ isOpen, onClose, onSelectComponent, onSelectProject }) {
  const { user, logout } = useAuth();

  if (!isOpen || !user) return null;

  const bookmarkedItems = ELECTRONIC_COMPONENTS.filter((c) => user.bookmarks?.includes(c.id));
  const savedProjects = QUARTZ_ARPAN_PROJECTS.filter((p) => user.savedProjects?.includes(p.id));

  const handleSignOut = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 lg:p-8 shadow-2xl flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-5 pb-6 border-b border-slate-800">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-xl shadow-cyan-500/25 bg-slate-950 flex items-center justify-center">
              <img
                src={user.avatar || '/arpan.png'}
                alt={user.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-slate-950 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">{user.name}</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{user.email}</p>
            <p className="text-xs text-cyan-400 mt-0.5">{user.role}</p>
          </div>
        </div>

        {/* Saved Projects */}
        <div className="py-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Saved Quartz Arpan Projects ({savedProjects.length})
            </h4>
          </div>

          {savedProjects.length === 0 ? (
            <p className="text-xs text-slate-500">No saved projects yet. Click the bookmark icon on any project!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {savedProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onClose();
                    onSelectProject(p);
                  }}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="truncate pr-2">
                    <span className="text-xs font-bold text-white block truncate">{p.title}</span>
                    <span className="text-[10px] text-slate-400">{p.category}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookmarked Components */}
        <div className="py-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Bookmarked 3D Components ({bookmarkedItems.length})
            </h4>
          </div>

          {bookmarkedItems.length === 0 ? (
            <p className="text-xs text-slate-500">No bookmarked components yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {bookmarkedItems.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    onClose();
                    onSelectComponent(c);
                  }}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="truncate pr-2">
                    <span className="text-xs font-bold text-white block truncate">{c.name}</span>
                    <span className="text-[10px] font-mono text-cyan-400">{c.voltage}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions: Sign Out */}
        <div className="pt-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">QuartzLab 3D • Arpan Studio</span>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold flex items-center gap-2 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
