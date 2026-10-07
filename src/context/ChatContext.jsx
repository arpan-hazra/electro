// src/context/ChatContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

const API_BASE = '/api';

export function ChatProvider({ children }) {
  const { token, user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0);
  const [chatError, setChatError] = useState(null);

  // Countdown timer for rate limiting
  useEffect(() => {
    if (rateLimitCountdown <= 0) return;
    const timer = setInterval(() => {
      setRateLimitCountdown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [rateLimitCountdown]);

  // Load conversations and contacts
  const fetchConversations = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  }, [token]);

  const fetchContacts = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setContacts(data.users.filter(u => u.id !== user?.id) || []);
      }
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    }
  }, [token, user]);

  useEffect(() => {
    if (token && user) {
      fetchConversations();
      fetchContacts();
    } else {
      setConversations([]);
      setActiveConversation(null);
      setMessages([]);
      setContacts([]);
    }
  }, [token, user, fetchConversations, fetchContacts]);

  // Load messages when activeConversation changes
  const fetchMessages = useCallback(async (convoId) => {
    if (!token || !convoId) return;
    try {
      const res = await fetch(`${API_BASE}/messages/${convoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  }, [token]);

  const selectConversation = (convo) => {
    setActiveConversation(convo);
    setChatError(null);
    if (convo) {
      fetchMessages(convo.id);
      // Mark as read in local conversation list
      setConversations(prev =>
        prev.map(c => c.id === convo.id ? { ...c, unreadCount: 0 } : c)
      );
    } else {
      setMessages([]);
    }
  };

  const startConversationWithUser = async (targetUserId) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/conversations/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ targetUserId })
      });
      if (res.ok) {
        const data = await res.json();
        await fetchConversations();
        selectConversation(data.conversation);
        return { success: true, conversation: data.conversation };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const sendMessage = async (text, media = null) => {
    if (!activeConversation || !token) return;
    setChatError(null);

    if (rateLimitCountdown > 0) {
      setChatError(`Rate limit active. Please wait ${rateLimitCountdown}s before sending again.`);
      return { success: false };
    }

    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          text,
          media
        })
      });

      const data = await res.json();

      if (res.status === 429) {
        setRateLimitCountdown(5);
        setChatError(data.error || 'Rate limit reached! Sending slowed down to protect from spam.');
        return { success: false, error: data.error };
      }

      if (!res.ok) {
        setChatError(data.error || 'Failed to send message');
        return { success: false, error: data.error };
      }

      setMessages(prev => [...prev, data.message]);
      await fetchConversations();

      // Simulate contact reply for demo friendliness if chatting with Maya or Jordan
      const otherUser = activeConversation.otherUser;
      if (otherUser && (otherUser.id === 'u_maya' || otherUser.id === 'u_jordan')) {
        simulateReply(activeConversation.id, otherUser);
      }

      return { success: true };
    } catch (err) {
      setChatError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Simulated auto-reply helper for realistic pair testing
  const simulateReply = (convoId, otherUser) => {
    setTimeout(() => {
      setIsTyping(true);
    }, 1200);

    setTimeout(async () => {
      setIsTyping(false);
      const sampleReplies = [
        "That sounds wonderful! Loving this Vibely update. ✨",
        "The safety settings give so much peace of mind.",
        "Got it! Let me check the media gallery.",
        "Smooth animations and clean interface!",
        "Thanks for sharing, looks great on dark mode too! 💜"
      ];
      const randomReply = sampleReplies[Math.floor(Math.random() * sampleReplies.length)];

      const replyMsg = {
        id: `m_${Date.now()}`,
        conversationId: convoId,
        senderId: otherUser.id,
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0],
        reactions: {},
        isDeleted: false
      };

      if (activeConversation?.id === convoId) {
        setMessages(prev => [...prev, replyMsg]);
      }
      fetchConversations();
    }, 3200);
  };

  const deleteMessage = async (messageId) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/messages/${messageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMessages(prev =>
          prev.map(m => m.id === messageId ? { ...m, isDeleted: true, text: 'This message was deleted', media: null } : m)
        );
        fetchConversations();
        return { success: true };
      }
      const data = await res.json();
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const reactToMessage = async (messageId, emoji) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/messages/${messageId}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ emoji })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev =>
          prev.map(m => m.id === messageId ? { ...m, reactions: data.reactions } : m)
        );
      }
    } catch (err) {
      console.error('Failed to react:', err);
    }
  };

  const muteConversation = async (convoId) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/conversations/${convoId}/mute`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(prev =>
          prev.map(c => c.id === convoId ? { ...c, muted: data.muted } : c)
        );
        if (activeConversation?.id === convoId) {
          setActiveConversation(prev => ({ ...prev, muted: data.muted }));
        }
      }
    } catch (err) {
      console.error('Failed to mute conversation:', err);
    }
  };

  const deleteConversation = async (convoId) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/conversations/${convoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setConversations(prev => prev.filter(c => c.id !== convoId));
        if (activeConversation?.id === convoId) {
          setActiveConversation(null);
          setMessages([]);
        }
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Safe client-side file validation & upload
  const uploadMedia = async (file, caption = '') => {
    if (!file || !token) return { success: false, error: 'No file provided' };

    // File validation: safe formats only
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `Unsupported file type "${file.name}". For safety reasons, only image files (JPG, PNG, WEBP, GIF) are allowed.`
      };
    }

    // Dangerous extension check
    const dangerousRegex = /\.(exe|bat|cmd|sh|vbs|js|scr|jar|msi)$/i;
    if (dangerousRegex.test(file.name)) {
      return {
        success: false,
        error: `Security Alert: "${file.name}" has an executable extension and was blocked.`
      };
    }

    // File size check: 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return {
        success: false,
        error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 5MB.`
      };
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch(`${API_BASE}/media/upload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              base64Data: reader.result,
              fileName: file.name,
              mimeType: file.type,
              fileSize: file.size,
              caption
            })
          });
          const data = await res.json();
          if (!res.ok) {
            resolve({ success: false, error: data.error });
          } else {
            resolve({ success: true, media: data.media });
          }
        } catch (err) {
          resolve({ success: false, error: err.message });
        }
      };
      reader.onerror = () => resolve({ success: false, error: 'Failed to read file' });
      reader.readAsDataURL(file);
    });
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConversation,
      messages,
      contacts,
      loading,
      isTyping,
      rateLimitCountdown,
      chatError,
      selectConversation,
      startConversationWithUser,
      sendMessage,
      deleteMessage,
      reactToMessage,
      muteConversation,
      deleteConversation,
      uploadMedia,
      clearChatError: () => setChatError(null),
      refreshConversations: fetchConversations,
      refreshContacts: fetchContacts
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
}
