// src/screens/ChatScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSafety } from '../context/SafetyContext';
import {
  Search,
  Plus,
  Send,
  Image as ImageIcon,
  Smile,
  MoreVertical,
  Check,
  CheckCheck,
  Phone,
  Video,
  Info,
  Trash2,
  VolumeX,
  Volume2,
  Shield,
  ShieldAlert,
  X,
  ChevronLeft,
  Sparkles,
  AlertTriangle,
  Download,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import MediaLightbox from '../components/modals/MediaLightbox';
import ReportModal from '../components/modals/ReportModal';
import ConfirmModal from '../components/modals/ConfirmModal';

const QUICK_EMOJIS = ['❤️', '🔥', '👍', '😂', '😮', '🎉', '✨', '👏'];

export default function ChatScreen({ onOpenNewChat }) {
  const {
    conversations,
    activeConversation,
    selectConversation,
    messages,
    sendMessage,
    deleteMessage,
    reactToMessage,
    muteConversation,
    deleteConversation,
    uploadMedia,
    isTyping,
    rateLimitCountdown,
    chatError,
    clearChatError
  } = useChat();

  const { user } = useAuth();
  const { currentAccent } = useTheme();
  const { blockUser } = useSafety();

  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [activeMenuMessageId, setActiveMenuMessageId] = useState(null);
  const [lightboxItem, setLightboxItem] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);
  const [confirmDeleteConvo, setConfirmDeleteConvo] = useState(false);
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [callNotice, setCallNotice] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Dismiss error after 4 seconds
  useEffect(() => {
    if (chatError) {
      const t = setTimeout(() => clearChatError(), 4000);
      return () => clearTimeout(t);
    }
  }, [chatError, clearChatError]);

  // Handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Selected image exceeds the 5MB limit. Please choose a smaller image.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setFilePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Send message handler
  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if ((!messageText.trim() && !selectedFile) || !activeConversation) return;

    let mediaPayload = null;

    if (selectedFile) {
      setIsUploading(true);
      const res = await uploadMedia(selectedFile, messageText.trim());
      setIsUploading(false);
      if (!res.success) {
        alert(res.error || 'Failed to upload image');
        return;
      }
      mediaPayload = res.media;
    }

    const textToSend = messageText.trim();
    setMessageText('');
    removeSelectedFile();
    setShowEmojiPicker(false);

    await sendMessage(textToSend, mediaPayload);
  };

  // Filter conversations
  const filteredConversations = conversations.filter(c => {
    const nameMatch = c.otherUser?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      c.otherUser?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterUnreadOnly) {
      return nameMatch && c.unreadCount > 0;
    }
    return nameMatch;
  });

  // Extract shared media for active conversation
  const sharedMediaInChat = messages.filter(m => m.media && !m.isDeleted);

  const simulateCall = (type) => {
    setCallNotice(`${type === 'video' ? '📹 Video Call' : '📞 Voice Call'} requested with ${activeConversation?.otherUser?.displayName || 'Friend'}. Connecting over Wi-Fi...`);
    setTimeout(() => setCallNotice(null), 4500);
  };

  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950">
      {/* ------------------------------------------------------------- */}
      {/* LEFT PANE: CONVERSATION LIST */}
      {/* ------------------------------------------------------------- */}
      <div className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 transition-all ${
        activeConversation ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Top Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Chats
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {conversations.length} active {conversations.length === 1 ? 'conversation' : 'conversations'}
            </p>
          </div>

          <button
            onClick={onOpenNewChat}
            className={`p-2.5 rounded-2xl bg-gradient-to-r ${currentAccent.gradient} text-white shadow-md hover:opacity-95 active:scale-95 transition-all`}
            title="Start new conversation"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search chats by name or @username..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Quick filter tabs */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              onClick={() => setFilterUnreadOnly(false)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                !filterUnreadOnly
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              All Chats
            </button>
            <button
              onClick={() => setFilterUnreadOnly(true)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${
                filterUnreadOnly
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <span>Unread</span>
              {conversations.filter(c => c.unreadCount > 0).length > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {conversations.filter(c => c.unreadCount > 0).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Conversation Items List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center text-slate-400">
              <MessageSquare className="w-12 h-12 stroke-[1.5] mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold">No chats found</p>
              <p className="text-xs text-slate-400 mt-1">
                {searchTerm ? 'Try a different search keyword' : 'Start a new conversation with friends!'}
              </p>
              <button
                onClick={onOpenNewChat}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
              >
                + New Chat
              </button>
            </div>
          ) : (
            filteredConversations.map((convo) => {
              const other = convo.otherUser;
              const isSelected = activeConversation?.id === convo.id;

              return (
                <div
                  key={convo.id}
                  onClick={() => selectConversation(convo)}
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 shadow-sm'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  {/* Avatar with live status ring */}
                  <div className="relative shrink-0">
                    <img
                      src={other?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={other?.displayName || 'User'}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                    {other?.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                    )}
                  </div>

                  {/* Info preview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-bold truncate ${
                        isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-slate-900 dark:text-white'
                      }`}>
                        {other?.displayName || 'Unknown User'}
                      </h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                        {convo.lastMessage?.timestamp || ''}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-xs truncate ${
                        convo.unreadCount > 0 ? 'font-bold text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {convo.lastMessage?.text || 'No messages yet'}
                      </p>

                      <div className="flex items-center gap-1.5 ml-2">
                        {convo.muted && (
                          <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        {convo.unreadCount > 0 && (
                          <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-500 text-white shadow-sm">
                            {convo.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* RIGHT PANE: ACTIVE CHAT CONVERSATION */}
      {/* ------------------------------------------------------------- */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 overflow-hidden relative ${
        !activeConversation ? 'hidden md:flex items-center justify-center' : 'flex'
      }`}>
        {!activeConversation ? (
          /* Empty state on desktop when no conversation selected */
          <div className="text-center p-8 max-w-sm flex flex-col items-center">
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${currentAccent.gradient} flex items-center justify-center text-white shadow-xl shadow-purple-500/20 mb-4 animate-bounce`} style={{ animationDuration: '3s' }}>
              <MessageSquare className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Your Vibely Chats
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Select a conversation from the sidebar or start a new chat with friends to begin sharing messages, photos, and reactions.
            </p>
            <button
              onClick={onOpenNewChat}
              className={`mt-6 px-6 py-2.5 rounded-2xl text-xs font-bold text-white shadow-md bg-gradient-to-r ${currentAccent.gradient} hover:opacity-95 transition-all`}
            >
              Start New Chat
            </button>
          </div>
        ) : (
          <>
            {/* Top Chat Header */}
            <div className="h-16 px-4 md:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between shrink-0 z-10">
              <div className="flex items-center gap-3">
                {/* Mobile Back Button */}
                <button
                  onClick={() => selectConversation(null)}
                  className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Back to chats"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Partner Avatar with Online Ring */}
                <div className="relative cursor-pointer" onClick={() => setShowDetailsDrawer(prev => !prev)}>
                  <img
                    src={activeConversation.otherUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={activeConversation.otherUser?.displayName}
                    className="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                  {activeConversation.otherUser?.isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                    {activeConversation.otherUser?.displayName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {activeConversation.otherUser?.isOnline ? (
                      <span className="text-emerald-500 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                      </span>
                    ) : (
                      <span>Last seen {activeConversation.otherUser?.lastSeen || 'recently'}</span>
                    )}
                    <span>• @{activeConversation.otherUser?.username}</span>
                  </div>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => simulateCall('voice')}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Voice Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => simulateCall('video')}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDetailsDrawer(prev => !prev)}
                  className={`p-2 rounded-xl transition-colors ${
                    showDetailsDrawer
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Conversation Media & Info"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification Banner for Simulated Calls */}
            {callNotice && (
              <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold flex items-center justify-between animate-fade-in shadow-md">
                <span>{callNotice}</span>
                <button onClick={() => setCallNotice(null)} className="p-1 hover:opacity-80">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Error or Rate Limit Banner */}
            {chatError && (
              <div className="px-4 py-2 bg-rose-500 text-white text-xs font-semibold flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{chatError}</span>
                </div>
                <button onClick={clearChatError} className="p-1 hover:opacity-80">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Rate limit live countdown indicator */}
            {rateLimitCountdown > 0 && (
              <div className="px-4 py-1.5 bg-amber-500/90 text-white text-xs font-bold text-center">
                Rate limiting active. Unlocking in {rateLimitCountdown}s...
              </div>
            )}

            {/* Main Chat Body: Messages & Details Drawer Container */}
            <div className="flex-1 flex overflow-hidden relative">
              {/* Messages Stream */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Date separator */}
                <div className="flex items-center justify-center my-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400">
                    Today
                  </span>
                </div>

                {/* Messages mapping */}
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No messages yet. Say hello and break the ice! 👋
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isOwn = msg.senderId === user?.id;
                    const isDeleted = msg.isDeleted;
                    const reactionsObj = msg.reactions || {};
                    const totalReactions = Object.entries(reactionsObj);

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col group ${isOwn ? 'items-end' : 'items-start'} transition-all`}
                      >
                        {/* Bubble Container */}
                        <div className={`relative max-w-[85%] sm:max-w-[70%] rounded-3xl p-3.5 shadow-sm transition-all ${
                          isOwn
                            ? `bg-gradient-to-r ${currentAccent.gradient} text-white rounded-br-md`
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-md border border-slate-200/60 dark:border-slate-700/60'
                        } ${isDeleted ? 'opacity-60 italic' : ''}`}>
                          
                          {/* Image Attachment inside Bubble */}
                          {msg.media && (
                            <div className="mb-2 rounded-2xl overflow-hidden cursor-pointer relative group/img" onClick={() => setLightboxItem(msg.media)}>
                              <img
                                src={msg.media.url || msg.media.mediaUrl}
                                alt={msg.media.name || 'Shared Image'}
                                className="w-full max-h-72 object-cover rounded-2xl transition-transform duration-300 group-hover/img:scale-[1.02]"
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 flex items-center justify-center gap-2 transition-opacity rounded-2xl">
                                <span className="px-3 py-1 rounded-xl bg-black/60 text-white text-xs font-bold backdrop-blur-sm flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                                  <span>View Photo</span>
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Message Text */}
                          <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap break-words">
                            {msg.text}
                          </p>

                          {/* Timestamp & Status ticks */}
                          <div className={`flex items-center gap-1.5 mt-1 text-[10px] ${
                            isOwn ? 'justify-end text-purple-200' : 'justify-end text-slate-400'
                          }`}>
                            <span>{msg.timestamp}</span>
                            {isOwn && !isDeleted && (
                              <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />
                            )}
                          </div>

                          {/* Floating Quick Reaction Trigger Button on Hover */}
                          {!isDeleted && (
                            <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ${
                              isOwn ? '-left-20' : '-right-20'
                            }`}>
                              <button
                                onClick={() => setActiveMenuMessageId(activeMenuMessageId === msg.id ? null : msg.id)}
                                className="p-1.5 rounded-full bg-white dark:bg-slate-800 shadow-md text-slate-500 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                                title="Add Reaction"
                              >
                                <Smile className="w-3.5 h-3.5" />
                              </button>

                              {isOwn && (
                                <button
                                  onClick={() => deleteMessage(msg.id)}
                                  className="p-1.5 rounded-full bg-white dark:bg-slate-800 shadow-md text-rose-500 hover:text-rose-700 border border-slate-200 dark:border-slate-700"
                                  title="Delete message"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          )}

                          {/* Quick Emoji Menu Popover */}
                          {activeMenuMessageId === msg.id && (
                            <div className="absolute -top-10 left-0 z-30 p-1.5 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 animate-slide-up">
                              {QUICK_EMOJIS.slice(0, 5).map(emoji => (
                                <button
                                  key={emoji}
                                  onClick={() => {
                                    reactToMessage(msg.id, emoji);
                                    setActiveMenuMessageId(null);
                                  }}
                                  className="w-7 h-7 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-sm transition-transform hover:scale-125"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Reaction Badges Row */}
                        {totalReactions.length > 0 && !isDeleted && (
                          <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            {totalReactions.map(([emoji, userIds]) => {
                              const hasReacted = userIds.includes(user?.id);
                              return (
                                <button
                                  key={emoji}
                                  onClick={() => reactToMessage(msg.id, emoji)}
                                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 border transition-all ${
                                    hasReacted
                                      ? 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800'
                                      : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                  }`}
                                >
                                  <span>{emoji}</span>
                                  <span>{userIds.length}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Live Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 self-start animate-fade-in">
                    <img
                      src={activeConversation.otherUser?.avatar}
                      alt={activeConversation.otherUser?.displayName}
                      className="w-7 h-7 rounded-xl object-cover"
                    />
                    <div className="px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-[11px] font-medium ml-1">typing a vibe...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* --------------------------------------------------------- */}
              {/* DETAILS / SHARED MEDIA DRAWER (Right sliding side panel) */}
              {/* --------------------------------------------------------- */}
              {showDetailsDrawer && (
                <div className="w-80 border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 backdrop-blur-md p-4 overflow-y-auto flex flex-col justify-between shrink-0 animate-fade-in z-20">
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Conversation Info</h4>
                      <button
                        onClick={() => setShowDetailsDrawer(false)}
                        className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Profile Snapshot */}
                    <div className="text-center">
                      <img
                        src={activeConversation.otherUser?.avatar}
                        alt={activeConversation.otherUser?.displayName}
                        className="w-20 h-20 rounded-3xl object-cover mx-auto shadow-md border-2 border-purple-500/40 mb-2"
                      />
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">
                        {activeConversation.otherUser?.displayName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        @{activeConversation.otherUser?.username}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 italic px-2">
                        "{activeConversation.otherUser?.bio || 'Hey there! I am using Vibely ✨'}"
                      </p>
                    </div>

                    {/* Shared Media Section */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Shared Media ({sharedMediaInChat.length})
                        </span>
                      </div>

                      {sharedMediaInChat.length === 0 ? (
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400">
                          No photos shared in this chat yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto p-1 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                          {sharedMediaInChat.map((m) => (
                            <img
                              key={m.id}
                              src={m.media?.url || m.media?.mediaUrl}
                              alt="Shared media"
                              onClick={() => setLightboxItem(m.media)}
                              className="w-full h-16 object-cover rounded-xl cursor-pointer hover:opacity-90 hover:scale-105 transition-all"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Chat Actions */}
                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => muteConversation(activeConversation.id)}
                        className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between transition-colors border border-slate-200 dark:border-slate-700"
                      >
                        <span className="flex items-center gap-2">
                          {activeConversation.muted ? <Volume2 className="w-4 h-4 text-purple-500" /> : <VolumeX className="w-4 h-4" />}
                          <span>{activeConversation.muted ? 'Unmute Notifications' : 'Mute Notifications'}</span>
                        </span>
                        <span className="text-[10px] text-slate-400">{activeConversation.muted ? 'Muted' : 'Sound On'}</span>
                      </button>

                      <button
                        onClick={() => setReportTarget({
                          type: 'user',
                          id: activeConversation.otherUser?.id,
                          name: activeConversation.otherUser?.displayName
                        })}
                        className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>Report Conversation</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to block ${activeConversation.otherUser?.displayName}?`)) {
                            blockUser(activeConversation.otherUser?.id);
                          }
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2 transition-colors border border-rose-200 dark:border-rose-900/50"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Block User</span>
                      </button>

                      <button
                        onClick={() => setConfirmDeleteConvo(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2 transition-colors border border-rose-200 dark:border-rose-900/50"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Conversation</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Image Upload Preview Bar */}
            {filePreview && (
              <div className="p-3 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between animate-slide-up">
                <div className="flex items-center gap-3">
                  <img
                    src={filePreview}
                    alt="Upload preview"
                    className="w-12 h-12 rounded-xl object-cover border border-purple-500 shadow-sm"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-xs">
                      {selectedFile?.name}
                    </h5>
                    <p className="text-[10px] text-slate-500">
                      {(selectedFile?.size / 1024).toFixed(0)} KB • Ready to send
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeSelectedFile}
                  className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quick Emojis Shelf Bar */}
            {showEmojiPicker && (
              <div className="p-2 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 overflow-x-auto animate-slide-up">
                {QUICK_EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setMessageText(prev => prev + emoji)}
                    className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-lg transition-transform hover:scale-125 shrink-0"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Input Bar */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
              {/* Media File Attachment Button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                title="Attach photo/image"
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              {/* Emoji Picker Toggle Button */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(prev => !prev)}
                className={`p-2.5 rounded-2xl transition-colors ${
                  showEmojiPicker
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
                title="Emoji"
              >
                <Smile className="w-5 h-5" />
              </button>

              {/* Text Input Field */}
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your vibe... (Enter to send)"
                className="flex-1 py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={(!messageText.trim() && !selectedFile) || isUploading}
                className={`p-2.5 sm:px-4 sm:py-2.5 rounded-2xl text-white font-bold shadow-md flex items-center justify-center gap-1.5 transition-all bg-gradient-to-r ${currentAccent.gradient} ${
                  (!messageText.trim() && !selectedFile) || isUploading
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:opacity-95 active:scale-95'
                }`}
              >
                <span className="hidden sm:inline text-xs">Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>

      {/* Global Modals for Chat */}
      {lightboxItem && (
        <MediaLightbox
          isOpen={Boolean(lightboxItem)}
          onClose={() => setLightboxItem(null)}
          mediaItem={lightboxItem}
        />
      )}

      {reportTarget && (
        <ReportModal
          isOpen={Boolean(reportTarget)}
          onClose={() => setReportTarget(null)}
          targetType={reportTarget.type}
          targetId={reportTarget.id}
          targetName={reportTarget.name}
        />
      )}

      {confirmDeleteConvo && (
        <ConfirmModal
          isOpen={confirmDeleteConvo}
          onClose={() => setConfirmDeleteConvo(false)}
          onConfirm={async () => {
            await deleteConversation(activeConversation.id);
            setConfirmDeleteConvo(false);
          }}
          title="Delete Conversation?"
          message={`Are you sure you want to permanently delete this chat with ${activeConversation?.otherUser?.displayName}? All message history in this chat will be removed.`}
          confirmText="Delete Chat"
          danger={true}
        />
      )}
    </div>
  );
}
