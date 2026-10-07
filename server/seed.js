// server/seed.js - Realistic seed data for Vibely
export const initialUsers = [
  {
    id: "u_alex",
    username: "alex_r",
    displayName: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "+1 555-0192",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Product designer & sound enthusiast 🎧 Vibing through life.",
    isOnline: true,
    lastSeen: "Just now",
    role: "user",
    privacy: {
      whoCanContact: "everyone", // 'everyone' | 'contacts' | 'nobody'
      profileVisibility: "everyone",
      onlineStatusVisibility: "everyone",
      safeMediaFilter: true
    },
    blockedUserIds: []
  },
  {
    id: "u_maya",
    username: "maya_lin",
    displayName: "Maya Lin",
    email: "maya.lin@example.com",
    phone: "+1 555-0143",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    bio: "Frontend artist & coffee seeker ☕ Let's make cool things!",
    isOnline: true,
    lastSeen: "Just now",
    role: "user",
    privacy: {
      whoCanContact: "everyone",
      profileVisibility: "everyone",
      onlineStatusVisibility: "everyone",
      safeMediaFilter: true
    },
    blockedUserIds: []
  },
  {
    id: "u_jordan",
    username: "jordan_h",
    displayName: "Jordan Hayes",
    email: "jordan.h@example.com",
    phone: "+1 555-0188",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "Building distributed systems 💻 Always up for tech chats.",
    isOnline: false,
    lastSeen: "25m ago",
    role: "user",
    privacy: {
      whoCanContact: "everyone",
      profileVisibility: "contacts",
      onlineStatusVisibility: "contacts",
      safeMediaFilter: false
    },
    blockedUserIds: []
  },
  {
    id: "u_elena",
    username: "elena_v",
    displayName: "Elena Vance",
    email: "elena.vance@example.com",
    phone: "+1 555-0167",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    bio: "Motion designer & photographer 📸 Capturing candid moments.",
    isOnline: true,
    lastSeen: "Just now",
    role: "user",
    privacy: {
      whoCanContact: "everyone",
      profileVisibility: "everyone",
      onlineStatusVisibility: "everyone",
      safeMediaFilter: true
    },
    blockedUserIds: []
  },
  {
    id: "u_marcus",
    username: "marcus_c",
    displayName: "Marcus Cole",
    email: "marcus.c@example.com",
    phone: "+1 555-0112",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bio: "Cybersecurity researcher 🛡️ Keeping our conversations private.",
    isOnline: false,
    lastSeen: "2h ago",
    role: "user",
    privacy: {
      whoCanContact: "contacts",
      profileVisibility: "everyone",
      onlineStatusVisibility: "everyone",
      safeMediaFilter: true
    },
    blockedUserIds: []
  }
];

export const initialConversations = [
  {
    id: "c_alex_maya",
    participants: ["u_alex", "u_maya"],
    unreadCount: { u_alex: 0, u_maya: 1 },
    muted: { u_alex: false, u_maya: false },
    pinned: { u_alex: true, u_maya: false },
    lastMessage: {
      text: "The new Vibely color palette looks phenomenal! Check this gradient mockup.",
      timestamp: "11:22 AM",
      senderId: "u_maya"
    }
  },
  {
    id: "c_alex_jordan",
    participants: ["u_alex", "u_jordan"],
    unreadCount: { u_alex: 2, u_jordan: 0 },
    muted: { u_alex: false, u_jordan: false },
    pinned: { u_alex: false, u_jordan: false },
    lastMessage: {
      text: "Did you review the rate limiting logic for preventing message floods?",
      timestamp: "10:45 AM",
      senderId: "u_jordan"
    }
  },
  {
    id: "c_alex_elena",
    participants: ["u_alex", "u_elena"],
    unreadCount: { u_alex: 0, u_elena: 0 },
    muted: { u_alex: false, u_elena: false },
    pinned: { u_alex: false, u_elena: false },
    lastMessage: {
      text: "Here are the photos from yesterday's studio session! 📷",
      timestamp: "Yesterday",
      senderId: "u_elena"
    }
  },
  {
    id: "c_alex_marcus",
    participants: ["u_alex", "u_marcus"],
    unreadCount: { u_alex: 0, u_marcus: 0 },
    muted: { u_alex: false, u_marcus: false },
    pinned: { u_alex: false, u_marcus: false },
    lastMessage: {
      text: "All security checks passed. The report and block actions are solid.",
      timestamp: "Oct 1",
      senderId: "u_marcus"
    }
  }
];

export const initialMessages = [
  // Conversation with Maya
  {
    id: "m_1",
    conversationId: "c_alex_maya",
    senderId: "u_maya",
    text: "Hey Alex! Have you tested the new version 0.1 release yet? 🚀",
    timestamp: "11:15 AM",
    date: "2026-10-01",
    reactions: { "❤️": ["u_alex"] },
    isDeleted: false
  },
  {
    id: "m_2",
    conversationId: "c_alex_maya",
    senderId: "u_alex",
    text: "Yes! The design feels distinct and modern. Love the soft gradients and dark mode support.",
    timestamp: "11:18 AM",
    date: "2026-10-01",
    reactions: { "🔥": ["u_maya"] },
    isDeleted: false
  },
  {
    id: "m_3",
    conversationId: "c_alex_maya",
    senderId: "u_maya",
    text: "The new Vibely color palette looks phenomenal! Check this gradient mockup.",
    timestamp: "11:22 AM",
    date: "2026-10-01",
    media: {
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      caption: "Vibely Brand Spectrum Concept",
      name: "vibely_gradient_concept.jpg",
      size: "1.4 MB",
      type: "image/jpeg"
    },
    reactions: { "👏": ["u_alex"] },
    isDeleted: false
  },

  // Conversation with Jordan
  {
    id: "m_4",
    conversationId: "c_alex_jordan",
    senderId: "u_jordan",
    text: "Hey Alex, working on the Privacy & Safety module today.",
    timestamp: "10:30 AM",
    date: "2026-10-01",
    reactions: {},
    isDeleted: false
  },
  {
    id: "m_5",
    conversationId: "c_alex_jordan",
    senderId: "u_jordan",
    text: "Did you review the rate limiting logic for preventing message floods?",
    timestamp: "10:45 AM",
    date: "2026-10-01",
    reactions: { "🛡️": ["u_alex"] },
    isDeleted: false
  },

  // Conversation with Elena
  {
    id: "m_6",
    conversationId: "c_alex_elena",
    senderId: "u_elena",
    text: "Here are the photos from yesterday's studio session! 📷",
    timestamp: "Yesterday",
    date: "2026-09-30",
    media: {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
      caption: "Misty landscape at sunrise",
      name: "sunrise_mist.jpg",
      size: "2.1 MB",
      type: "image/jpeg"
    },
    reactions: { "❤️": ["u_alex"] },
    isDeleted: false
  },

  // Conversation with Marcus
  {
    id: "m_7",
    conversationId: "c_alex_marcus",
    senderId: "u_marcus",
    text: "All security checks passed. The report and block actions are solid.",
    timestamp: "Oct 1",
    date: "2026-10-01",
    reactions: {},
    isDeleted: false
  }
];

export const initialAuditLogs = [
  {
    id: "log_1",
    type: "security",
    title: "Secure Session Started",
    description: "Logged in securely from Chrome on Windows. Two-factor token verified.",
    timestamp: "Today at 09:15 AM",
    level: "info"
  },
  {
    id: "log_2",
    type: "safety",
    title: "Privacy Controls Active",
    description: "Profile visibility set to Everyone. Online status enabled.",
    timestamp: "Today at 09:16 AM",
    level: "info"
  },
  {
    id: "log_3",
    type: "system",
    title: "Vibely Version 0.1 Running",
    description: "App verified with backend build #101. No security vulnerabilities detected.",
    timestamp: "Today at 09:17 AM",
    level: "success"
  }
];
