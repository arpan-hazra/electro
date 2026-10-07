// src/components/MobileBottomNav.jsx
import React from 'react';
import { Cpu, Box, Zap, User } from 'lucide-react';
import { YoutubeIcon } from './Icons';
import { useAuth } from '../context/AuthContext';

export default function MobileBottomNav({ activeSection, onSelectSection, onOpenProfile }) {
  const { user } = useAuth();

  const navItems = [
    { id: 'components', label: '3D Catalog', icon: Cpu },
    { id: 'workbench', label: '3D Workbench', icon: Box },
    { id: 'learning', label: 'Video Hub', icon: YoutubeIcon },
    { id: 'projects', label: 'Projects', icon: Zap },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-cyan-500/20 px-3 py-2 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectSection(item.id)}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400 scale-110' : 'text-slate-400'}`} />
            <span className="text-[10px] mt-1 font-mono">{item.label}</span>
          </button>
        );
      })}

      {/* User / Creator Profile Touch Target */}
      <button
        onClick={onOpenProfile}
        className="flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-400 hover:text-white transition-all"
      >
        <div className="w-5 h-5 rounded-full overflow-hidden border border-cyan-400 bg-slate-900">
          <img src="/arpan.png" alt="Profile" className="w-full h-full object-cover object-top" />
        </div>
        <span className="text-[10px] mt-1 font-mono">Profile</span>
      </button>
    </div>
  );
}
