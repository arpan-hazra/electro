// src/components/Sidebar.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useUpdate } from '../context/UpdateContext';
import {
  MessageSquare,
  Users,
  Image as ImageIcon,
  Bell,
  Shield,
  Settings,
  Info,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, unreadMessagesTotal = 2, unreadNotificationsCount = 2 }) {
  const { currentAccent } = useTheme();
  const { installedVersion, isUpdateAvailable } = useUpdate();

  const navItems = [
    { id: 'chats', label: 'Chats', icon: MessageSquare, badge: unreadMessagesTotal },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'gallery', label: 'Media Gallery', icon: ImageIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount },
    { id: 'safety', label: 'Privacy & Safety', icon: Shield, highlight: true },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'about', label: 'About Vibely', icon: Info, subtext: `v${installedVersion}` }
  ];

  return (
    <>
      {/* Desktop Sidebar (Left column) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-4 justify-between transition-colors shrink-0">
        <div className="space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all group ${
                  isActive
                    ? `bg-gradient-to-r ${currentAccent.gradient} text-white shadow-md shadow-purple-500/20`
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : item.highlight ? 'text-purple-500 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400'
                  }`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.subtext && !isActive && (
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      {item.subtext}
                    </span>
                  )}
                  {item.badge > 0 && (
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      isActive
                        ? 'bg-white text-purple-600'
                        : 'bg-rose-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Safety & Version Footprint */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {isUpdateAvailable && (
            <div
              onClick={() => setActiveTab('about')}
              className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Update Available</span>
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">
                Check What's New in About
              </p>
            </div>
          )}

          <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">Vibely</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Version {installedVersion}</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 flex items-center justify-around py-2 px-1">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl relative transition-all ${
                isActive ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label.split(' ')[0]}</span>
              {item.badge > 0 && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
