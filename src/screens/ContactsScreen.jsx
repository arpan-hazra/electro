// src/screens/ContactsScreen.jsx
import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSafety } from '../context/SafetyContext';
import {
  Users,
  Search,
  UserPlus,
  MessageSquare,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Phone,
  Mail,
  Check,
  X
} from 'lucide-react';
import ReportModal from '../components/modals/ReportModal';

export default function ContactsScreen({ onNavigateToChat }) {
  const { contacts, startConversationWithUser, refreshContacts } = useChat();
  const { user } = useAuth();
  const { currentAccent } = useTheme();
  const { blockUser, unblockUser, blockedUsers } = useSafety();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'online' | 'blocked'
  const [showAddModal, setShowAddModal] = useState(false);
  const [addIdentifier, setAddIdentifier] = useState('');
  const [addNotice, setAddNotice] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);

  const blockedIds = blockedUsers.map(b => b.id);

  // Filter contacts list
  const filteredContacts = contacts.filter(contact => {
    const isBlocked = blockedIds.includes(contact.id);
    const matchesSearch =
      contact.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterTab === 'online') {
      return matchesSearch && contact.isOnline && !isBlocked;
    }
    if (filterTab === 'blocked') {
      return matchesSearch && isBlocked;
    }
    return matchesSearch && !isBlocked;
  });

  const onlineCount = contacts.filter(c => c.isOnline && !blockedIds.includes(c.id)).length;

  const handleStartChat = async (contactId) => {
    const res = await startConversationWithUser(contactId);
    if (res?.success) {
      onNavigateToChat(res.conversation);
    }
  };

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (!addIdentifier.trim()) return;

    // Simulate friend invite / addition
    setAddNotice(`Invite & connection request sent to ${addIdentifier.trim()}! ✨`);
    setAddIdentifier('');
    setTimeout(() => {
      setAddNotice(null);
      setShowAddModal(false);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 md:p-8">
      {/* Top Banner & Header */}
      <div className="max-w-5xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Contacts & Friends
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                {contacts.length}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Connect instantly with colleagues, friends, and verified contacts.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r ${currentAccent.gradient} hover:opacity-95 active:scale-95 transition-all`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Friend</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Total Network</span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {contacts.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Online Now</span>
              <h3 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {onlineCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Blocked List</span>
              <h3 className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">
                {blockedUsers.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Shield className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 w-full sm:w-auto">
            <button
              onClick={() => setFilterTab('all')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Contacts ({contacts.length - blockedUsers.length})
            </button>
            <button
              onClick={() => setFilterTab('online')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === 'online'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Online ({onlineCount})
            </button>
            <button
              onClick={() => setFilterTab('blocked')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === 'blocked'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Blocked ({blockedUsers.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, @username, email..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Contacts Grid */}
        {filteredContacts.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
            <Users className="w-12 h-12 text-slate-400 stroke-[1.5] mb-2" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {filterTab === 'blocked' ? 'No blocked contacts' : 'No contacts found'}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {searchTerm ? `No results for "${searchTerm}"` : 'Your contact list is clean.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => {
              const isBlocked = blockedIds.includes(contact.id);

              return (
                <div
                  key={contact.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* User Avatar & Status Header */}
                    <div className="flex items-start justify-between">
                      <div className="relative">
                        <img
                          src={contact.avatar}
                          alt={contact.displayName}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                        {contact.isOnline && !isBlocked && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                        )}
                      </div>

                      {/* Status pill */}
                      {isBlocked ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                          Blocked
                        </span>
                      ) : contact.isOnline ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Online
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          {contact.lastSeen}
                        </span>
                      )}
                    </div>

                    {/* Name & Tag */}
                    <div className="mt-3">
                      <h4 className="font-bold text-base text-slate-900 dark:text-white truncate">
                        {contact.displayName}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium">
                        @{contact.username}
                      </p>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {contact.bio || 'Vibing on Vibely ✨'}
                    </p>

                    {/* Masked Contact Info */}
                    <div className="mt-3 space-y-1 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2">
                      {contact.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{contact.email}</span>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    {!isBlocked ? (
                      <>
                        <button
                          onClick={() => handleStartChat(contact.id)}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white shadow-sm flex items-center justify-center gap-1.5 bg-gradient-to-r ${currentAccent.gradient} hover:opacity-95 active:scale-95 transition-all`}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Message</span>
                        </button>

                        <button
                          onClick={() => blockUser(contact.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                          title="Block User"
                        >
                          <Shield className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setReportTarget({
                            type: 'user',
                            id: contact.id,
                            name: contact.displayName
                          })}
                          className="p-2 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/60 transition-colors"
                          title="Report User"
                        >
                          <ShieldAlert className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => unblockUser(contact.id)}
                        className="w-full py-2 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        Unblock Contact
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Friend Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${currentAccent.gradient} flex items-center justify-center text-white`}>
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">Add New Friend</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {addNotice && (
              <div className="my-3 p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-2xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>{addNotice}</span>
              </div>
            )}

            <form onSubmit={handleAddFriend} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Username, Phone, or Email
                </label>
                <input
                  type="text"
                  required
                  value={addIdentifier}
                  onChange={(e) => setAddIdentifier(e.target.value)}
                  placeholder="e.g. @sarah_v or sarah@vibely.app"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 text-xs text-purple-700 dark:text-purple-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-purple-500" />
                <span>An instant connection request will be sent to the contact.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`py-2.5 px-5 rounded-xl text-xs font-bold text-white shadow-md bg-gradient-to-r ${currentAccent.gradient} hover:opacity-95`}
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportTarget && (
        <ReportModal
          isOpen={Boolean(reportTarget)}
          onClose={() => setReportTarget(null)}
          targetType={reportTarget.type}
          targetId={reportTarget.id}
          targetName={reportTarget.name}
        />
      )}
    </div>
  );
}
