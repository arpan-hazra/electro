// src/screens/NotificationsScreen.jsx
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useUpdate } from '../context/UpdateContext';
import {
  Bell,
  MessageSquare,
  UserPlus,
  ShieldCheck,
  Sparkles,
  Check,
  Trash2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n_1',
    type: 'message',
    title: 'New message from Maya Lin',
    description: 'Hey Alex! Have you tried the new Vibely update yet? 💜',
    timestamp: '10:42 AM',
    isRead: false,
    targetTab: 'chats'
  },
  {
    id: 'n_2',
    type: 'security',
    title: 'Security Audit: Login Verified',
    description: 'Successful authenticated session initiated from verified device.',
    timestamp: 'Yesterday',
    isRead: false,
    targetTab: 'settings'
  },
  {
    id: 'n_3',
    type: 'friend',
    title: 'Friend Request Accepted',
    description: 'Jordan Hayes accepted your Vibely connection request.',
    timestamp: '2 days ago',
    isRead: true,
    targetTab: 'contacts'
  },
  {
    id: 'n_4',
    type: 'system',
    title: 'Vibely System Update Ready',
    description: 'Version 0.2 is available with enhanced media gallery and performance optimizations.',
    timestamp: '3 days ago',
    isRead: true,
    targetTab: 'about'
  }
];

export default function NotificationsScreen({ onNavigate }) {
  const { currentAccent } = useTheme();
  const { setShowUpdateModal } = useUpdate();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'security'

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (item) => {
    // Mark clicked as read
    setNotifications(prev =>
      prev.map(n => n.id === item.id ? { ...n, isRead: true } : n)
    );

    if (item.type === 'system') {
      setShowUpdateModal(true);
    } else if (item.targetTab && onNavigate) {
      onNavigate(item.targetTab);
    }
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'security') return n.type === 'security';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-5 h-5 text-purple-500" />;
      case 'security':
        return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case 'friend':
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      case 'system':
      default:
        return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white shadow-sm">
                  {unreadCount} New
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Stay updated on direct messages, friend requests, and account safety.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="p-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Clear all notifications"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            All Activity ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === 'unread'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('security')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === 'security'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Security Only
          </button>
        </div>

        {/* Notification Cards */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
            <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 stroke-[1.5] mb-2" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              All caught up!
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              You have no pending notifications at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  !item.isRead
                    ? 'bg-purple-50/70 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/80 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm shrink-0">
                    {getIcon(item.type)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold ${
                        !item.isRead ? 'text-purple-950 dark:text-purple-200' : 'text-slate-900 dark:text-white'
                      }`}>
                        {item.title}
                      </h4>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1">
                      {item.description}
                    </p>

                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {item.timestamp}
                    </span>
                  </div>
                </div>

                <div className="text-slate-400 group-hover:text-purple-500 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
