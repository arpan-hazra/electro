// src/screens/SettingsScreen.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSafety } from '../context/SafetyContext';
import { useUpdate } from '../context/UpdateContext';
import {
  User,
  Palette,
  Shield,
  Lock,
  LogOut,
  Trash2,
  Check,
  Moon,
  Sun,
  Camera,
  Sparkles,
  Wifi,
  Eye,
  EyeOff,
  AlertTriangle,
  HardDrive,
  Activity,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import ConfirmModal from '../components/modals/ConfirmModal';

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
];

export default function SettingsScreen({ onReplayOnboarding }) {
  const { user, logout, updateProfile, deleteAccount } = useAuth();
  const { isDarkMode, toggleTheme, currentAccent, accentKey, changeAccent, ACCENT_COLORS } = useTheme();
  const { privacySettings, updatePrivacySettings, blockedUsers, unblockUser, auditLogs } = useSafety();
  const { installedVersion } = useUpdate();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'appearance' | 'privacy' | 'security' | 'account'

  // Profile edit state
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || PRESET_AVATARS[0]);
  const [profileSavedNotice, setProfileSavedNotice] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Modals state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const res = await updateProfile({
      displayName,
      bio,
      avatar: selectedAvatar
    });
    setIsSavingProfile(false);
    if (res?.success) {
      setProfileSavedNotice(true);
      setTimeout(() => setProfileSavedNotice(false), 3000);
    }
  };

  const handlePrivacyChange = async (key, value) => {
    await updatePrivacySettings({
      ...privacySettings,
      [key]: value
    });
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
  };

  const handleDeleteAccount = async (pwd) => {
    const res = await deleteAccount(pwd);
    if (res?.success) {
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Profile & Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your personal identity, theme preferences, privacy, and account security.
            </p>
          </div>

          {/* Secure Logout Top Action Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Secure Log Out</span>
          </button>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 overflow-x-auto">
          {[
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'appearance', label: 'Theme & Design', icon: Palette },
            { id: 'privacy', label: 'Privacy & Safety', icon: Shield },
            { id: 'security', label: 'Security Audits', icon: ShieldCheck },
            { id: 'account', label: 'Account & Sessions', icon: Lock }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: PROFILE MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'profile' && (
          <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Information</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Update how other users see you across Vibely</p>
              </div>

              {profileSavedNotice && (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-fade-in">
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved to Cloud!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Profile Avatar
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={selectedAvatar}
                    alt="Current avatar"
                    className="w-20 h-20 rounded-3xl object-cover border-4 border-purple-500 shadow-lg shrink-0"
                  />
                  <div className="flex-1 w-full">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Choose an avatar preset or provide a custom image URL:
                    </p>
                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      {PRESET_AVATARS.map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedAvatar(av)}
                          className={`relative rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                            selectedAvatar === av
                              ? 'border-purple-500 scale-105 shadow-md'
                              : 'border-slate-300 dark:border-slate-700 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={av} alt="Avatar option" className="w-10 h-10 object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`@${user?.username || ''}`}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  About / Bio
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short vibe about yourself..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Email Address (Registered)
                  </label>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Phone Number
                  </label>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {user?.phone || '+1 555-0192'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className={`px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-md bg-gradient-to-r ${currentAccent.gradient} hover:opacity-95 active:scale-95 transition-all`}
                >
                  {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: APPEARANCE & THEME DESIGN */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'appearance' && (
          <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-slide-up">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Theme & Visual Identity</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Personalize your color palette, dark mode, and interface tones</p>
            </div>

            {/* Dark Mode Switcher */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Seamless Android-first contrast tailored for day or night.
                  </p>
                </div>
              </div>

              <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm hover:opacity-90 transition-all"
              >
                Switch to {isDarkMode ? 'Light' : 'Dark'}
              </button>
            </div>

            {/* Accent Colors Palette */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Select Accent Palette
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.values(ACCENT_COLORS).map((color) => {
                  const isSelected = accentKey === color.id;
                  return (
                    <button
                      key={color.id}
                      onClick={() => changeAccent(color.id)}
                      className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/40 shadow-md ring-2 ring-purple-400/40'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-r ${color.gradient} shadow-sm`} />
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {color.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Replay Onboarding */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Revisit Onboarding</h4>
                <p className="text-[11px] text-slate-500">Walk through the 6 introduction screens again</p>
              </div>
              <button
                onClick={onReplayOnboarding}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100"
              >
                Replay Slides
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: PRIVACY & SAFETY */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'privacy' && (
          <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-slide-up">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Privacy Controls</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Set permissions for who can reach you and what is publicly visible</p>
            </div>

            {/* Who can contact me */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Who Can Send You Messages
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { value: 'everyone', label: 'Everyone', desc: 'Any user on Vibely' },
                  { value: 'contacts', label: 'Contacts Only', desc: 'Only approved friends' },
                  { value: 'nobody', label: 'Nobody', desc: 'Pause all direct chats' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handlePrivacyChange('whoCanContact', opt.value)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      privacySettings.whoCanContact === opt.value
                        ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/40 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{opt.label}</span>
                      {privacySettings.whoCanContact === opt.value && <Check className="w-3.5 h-3.5 text-purple-600" />}
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Online Status Visibility */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Online Presence Visibility
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { value: 'everyone', label: 'Visible to All', desc: 'Green pulse active' },
                  { value: 'contacts', label: 'Contacts Only', desc: 'Friends can see status' },
                  { value: 'nobody', label: 'Hidden (Ghost)', desc: 'Always shows offline' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handlePrivacyChange('onlineStatusVisibility', opt.value)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      privacySettings.onlineStatusVisibility === opt.value
                        ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/40 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{opt.label}</span>
                      {privacySettings.onlineStatusVisibility === opt.value && <Check className="w-3.5 h-3.5 text-purple-600" />}
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Blocked Users Section */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Blocked Users ({blockedUsers.length})
              </label>
              {blockedUsers.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No users currently blocked.</p>
              ) : (
                <div className="space-y-2">
                  {blockedUsers.map(b => (
                    <div key={b.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2.5">
                        <img src={b.avatar} alt={b.displayName} className="w-8 h-8 rounded-xl object-cover" />
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">{b.displayName}</h5>
                          <span className="text-[10px] text-slate-400">@{b.username}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => unblockUser(b.id)}
                        className="px-3 py-1 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100"
                      >
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: SECURITY AUDITS & DATA */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'security' && (
          <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-slide-up">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Security & Cloud Audits</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real-time inspection of active sessions, authentication events, and safety logs</p>
            </div>

            {/* Cloud Sync Status Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-200 dark:border-purple-800/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Cloud Database Sync Active</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Connected via Wi-Fi / Internet • Real-time persistence enabled</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Synchronized
              </span>
            </div>

            {/* Audit Logs Stream */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Recent Security Logs
              </label>
              {auditLogs.length === 0 ? (
                <p className="text-xs text-slate-400">No security events logged.</p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{log.title}</span>
                          <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{log.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: ACCOUNT & SESSIONS (LOGOUT & DANGER ZONE) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'account' && (
          <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-slide-up">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Account & Session Management</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Control active login tokens and account termination</p>
            </div>

            {/* Secure Logout Card */}
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Secure Log Out</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md leading-relaxed">
                  Ends your current authenticated session token and safely returns you to the login screen. Your cloud account, contacts, and message history remain securely preserved in the database.
                </p>
              </div>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white shadow-md bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all whitespace-nowrap self-start sm:self-auto"
              >
                Log Out of Vibely
              </button>
            </div>

            {/* Danger Zone: Delete Account */}
            <div className="p-5 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Irreversible Danger Zone</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Permanently purge your Vibely account, contacts, messages, and uploaded media from the cloud database. This action cannot be reversed.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-300 dark:border-rose-800 transition-colors"
              >
                Delete Account Permanently
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <ConfirmModal
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogout}
          title="Sign Out of Vibely?"
          message="Your session will be closed safely. All your cloud messages and data remain completely intact for your next login."
          confirmText="Yes, Log Out"
          danger={false}
        />
      )}

      {/* Delete Account Modal */}
      {showDeleteConfirm && (
        <ConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteAccount}
          title="Permanently Delete Account?"
          message="This will immediately and permanently erase your account credentials, messages, and profile from the database."
          confirmText="Delete Everything"
          danger={true}
          requirePassword={true}
        />
      )}
    </div>
  );
}
