// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Cpu, Search, Sparkles, User, LogIn, LogOut, Menu, X, Box, Layers, Zap, Radio, Wrench } from 'lucide-react';
import { YoutubeIcon } from './Icons';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  activeSection,
  setActiveSection,
  searchQuery,
  setSearchQuery,
  onOpenCreator,
  onOpenProfile,
}) {
  const { user, isAuthenticated, openAuth, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'components', label: '3D Components', icon: Cpu },
    { id: 'learning', label: 'Video Hub', icon: YoutubeIcon },
    { id: 'workbench', label: '3D Workbench', icon: Box },
    { id: 'projects', label: 'Quartz Arpan Projects', icon: Zap },
    { id: 'robots', label: 'Robot Gallery', icon: Radio },
  ];

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-cyan-500/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Creator Tagline */}
        <div
          onClick={() => handleNavClick('components')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                QuartzLab <span className="text-cyan-400">3D</span>
              </span>
              <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
                PRO
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <span>Electronics & Robotics</span>
              <span className="text-cyan-400 font-semibold">• Made by Arpan</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 3D components, Quartz Arpan..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-500 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right User Actions (Sign Up / Sign In / Sign Out / Profile / Creator) */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={onOpenCreator}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-medium flex items-center gap-2 transition-all shadow-sm hover:border-cyan-400"
          >
            <div className="w-6 h-6 rounded-lg overflow-hidden border border-cyan-400 shadow-sm shrink-0">
              <img src="/arpan.png" alt="Mr. Arpan" className="w-full h-full object-cover object-top" />
            </div>
            <span>Meet Arpan</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all"
              >
                <div className="w-8 h-8 rounded-xl overflow-hidden bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center shrink-0 shadow-md">
                  <img
                    src={user.avatar || '/arpan.png'}
                    alt={user.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="text-left hidden xl:block">
                  <span className="text-xs font-bold text-white block leading-none">{user.name}</span>
                  <span className="text-[10px] text-cyan-400 font-mono leading-none">Profile</span>
                </div>
              </button>

              <button
                onClick={logout}
                title="Sign Out"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 text-slate-400 border border-slate-800 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openAuth('login')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuth('signup')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/25 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          {isAuthenticated && (
            <button
              onClick={onOpenProfile}
              className="w-9 h-9 rounded-xl overflow-hidden bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center shadow-md shrink-0"
            >
              <img
                src={user.avatar || '/arpan.png'}
                alt={user.name}
                className="w-full h-full object-cover object-top"
              />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 bg-slate-950 border-b border-cyan-500/20 flex flex-col gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search components & projects..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    activeSection === link.id
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenCreator();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-cyan-300 border border-cyan-500/20 text-xs font-mono font-semibold flex items-center justify-center gap-2"
            >
              <div className="w-6 h-6 rounded-lg overflow-hidden border border-cyan-400 shrink-0">
                <img src="/arpan.png" alt="Mr. Arpan" className="w-full h-full object-cover object-top" />
              </div>
              About Creator Mr. Arpan
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out ({user.name})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    openAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    openAuth('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
