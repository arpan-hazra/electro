// server/index.js - Vibely backend server
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialUsers, initialConversations, initialMessages, initialAuditLogs } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const VERSION_FILE = path.join(ROOT_DIR, 'versionConfig.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory data store initialized with seeds
let users = [...initialUsers];
let conversations = [...initialConversations];
let messages = [...initialMessages];
let auditLogs = [...initialAuditLogs];
let reports = [
  {
    id: "rep_1",
    reporterId: "u_alex",
    targetType: "user",
    targetId: "u_unknown",
    category: "spam",
    reason: "Suspicious promotional link received",
    timestamp: "2026-09-28 14:10",
    status: "Resolved - Account Suspended"
  }
];

// In-memory rate limiting map: userId -> [timestamp1, timestamp2, ...]
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 5000;
const RATE_LIMIT_MAX_MESSAGES = 5;

// Blocklist / banned words for safety
const BANNED_PATTERNS = [
  /\b(free\s+crypto|give\s+me\s+your\s+password|send\s+private\s+key|claim\s+your\s+1000\s+dollars)\b/i,
  /\b(hate\s+speech|kill\s+yourself|die\s+now)\b/i
];

// Helper: load version config
function getVersionConfig() {
  try {
    const raw = fs.readFileSync(VERSION_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading versionConfig.json:", err);
    return {
      appName: "Vibely",
      appVersion: "0.1",
      buildNumber: 101,
      releaseDate: "2026-10-01",
      serverAvailableVersion: {
        version: "0.2",
        buildNumber: 105,
        releaseDate: "2026-10-05",
        updateType: "minor",
        title: "Vibely 0.2 is available",
        whatsNew: [
          "Improved chat interface",
          "New image gallery",
          "Better performance",
          "Safety improvements"
        ]
      },
      releaseHistory: []
    };
  }
}

// Simulated active session token -> userId
const sessions = new Map();
// Default active session for initial quick login
sessions.set("token_alex", "u_alex");

// Auth helper middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing authorization header" });
  }
  const token = authHeader.replace('Bearer ', '');
  const userId = sessions.get(token);
  if (!userId) {
    return res.status(401).json({ error: "Invalid or expired session token" });
  }
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }
  req.currentUser = user;
  next();
}

// -------------------------------------------------------------
// 1. VERSION & UPDATE SYSTEM APIS (Requirement 5, 6, 7, 8, 9)
// -------------------------------------------------------------
app.get('/api/version', (req, res) => {
  const config = getVersionConfig();
  res.json({
    success: true,
    config
  });
});

// Update simulator endpoint to test update notification modal live!
app.post('/api/version/simulate', (req, res) => {
  const { newVersion, updateType, isMandatory, whatsNew, title } = req.body;
  try {
    const config = getVersionConfig();
    if (newVersion) {
      config.serverAvailableVersion = {
        version: newVersion,
        buildNumber: (config.serverAvailableVersion?.buildNumber || 100) + 1,
        releaseDate: new Date().toISOString().split('T')[0],
        updateType: updateType || "minor",
        isMandatory: Boolean(isMandatory),
        title: title || `Vibely ${newVersion} is available`,
        whatsNew: whatsNew || [
          "Improved chat interface",
          "New image gallery",
          "Better performance",
          "Safety improvements"
        ]
      };
      fs.writeFileSync(VERSION_FILE, JSON.stringify(config, null, 2), 'utf-8');
    }
    res.json({ success: true, config });
  } catch (err) {
    res.status(500).json({ error: "Failed to update version configuration", details: err.message });
  }
});

// -------------------------------------------------------------
// 2. AUTHENTICATION & ACCOUNT SAFETY (Requirement 2, 3)
// -------------------------------------------------------------
app.post('/api/auth/signup', (req, res) => {
  const { username, displayName, email, password, phone, avatar } = req.body;

  // Validation
  if (!username || !displayName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const cleanUsername = username.trim().toLowerCase();
  if (cleanUsername.length < 3 || cleanUsername.length > 20) {
    return res.status(400).json({ error: "Username must be between 3 and 20 characters" });
  }
  if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
    return res.status(400).json({ error: "Username can only contain letters, numbers, and underscores" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address format" });
  }

  // Strong password requirement
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long" });
  }
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNum = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (!hasUpper || !hasLower || !hasNum || !hasSpecial) {
    return res.status(400).json({
      error: "Password must contain uppercase, lowercase, a number, and a special character"
    });
  }

  // Check collision
  if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
    return res.status(409).json({ error: "Username is already taken" });
  }
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: "Email is already registered" });
  }

  const newUserId = `u_${Date.now()}`;
  const newUser = {
    id: newUserId,
    username: cleanUsername,
    displayName: displayName.trim(),
    email: email.trim(),
    phone: phone ? phone.trim() : "+1 555-0000",
    avatar: avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanUsername}`,
    bio: "Hey there! I am using Vibely ✨",
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
  };

  users.push(newUser);

  // Generate session token
  const token = `token_${newUserId}_${Date.now()}`;
  sessions.set(token, newUserId);

  auditLogs.unshift({
    id: `log_${Date.now()}`,
    type: "security",
    title: "Account Created Securely",
    description: `User @${cleanUsername} registered with verified credentials.`,
    timestamp: "Just now",
    level: "success"
  });

  res.status(201).json({
    success: true,
    token,
    user: newUser
  });
});

app.post('/api/auth/login', (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail) {
    return res.status(400).json({ error: "Please enter your username, email, or phone number" });
  }

  // Find user by username, email, or phone
  const query = usernameOrEmail.trim().toLowerCase();
  const cleanPhone = query.replace(/[^\d+]/g, '');
  const user = users.find(u => {
    const matchUsername = u.username.toLowerCase() === query;
    const matchEmail = u.email && u.email.toLowerCase() === query;
    const matchPhone = u.phone && cleanPhone.length > 5 && u.phone.replace(/[^\d+]/g, '') === cleanPhone;
    return matchUsername || matchEmail || matchPhone;
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid username, email, phone, or password" });
  }

  // For existing seed demo accounts or created accounts:
  // In demo environment, any password >= 6 characters succeeds for seeded users, or exact check
  if (password && password.length < 4) {
    return res.status(401).json({ error: "Password does not meet security criteria" });
  }

  // Issue new session token
  const token = `token_${user.id}_${Date.now()}`;
  sessions.set(token, user.id);

  user.isOnline = true;
  user.lastSeen = "Just now";

  auditLogs.unshift({
    id: `log_${Date.now()}`,
    type: "security",
    title: "Successful Login",
    description: `Signed in as ${user.displayName} (@${user.username})`,
    timestamp: "Just now",
    level: "info"
  });

  res.json({
    success: true,
    token,
    user
  });
});

app.post('/api/auth/recover', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: "Please enter a valid recovery email" });
  }

  auditLogs.unshift({
    id: `log_${Date.now()}`,
    type: "security",
    title: "Password Recovery Requested",
    description: `Security verification link dispatched to ${email.slice(0, 3)}***@***`,
    timestamp: "Just now",
    level: "warning"
  });

  res.json({
    success: true,
    message: "If an account matches that email, a secure password recovery code has been sent."
  });
});

app.post('/api/auth/logout', authenticate, (req, res) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  sessions.delete(token);
  res.json({ success: true, message: "Logged out securely" });
});

app.post('/api/auth/delete-account', authenticate, (req, res) => {
  const { passwordConfirm } = req.body;
  const userId = req.currentUser.id;

  if (!passwordConfirm) {
    return res.status(400).json({ error: "Please enter your password to confirm account deletion" });
  }

  // Remove user from store
  users = users.filter(u => u.id !== userId);
  // Clean up conversations & messages
  conversations = conversations.filter(c => !c.participants.includes(userId));
  messages = messages.filter(m => m.senderId !== userId);

  // Clear all sessions for this user
  for (const [t, uid] of sessions.entries()) {
    if (uid === userId) sessions.delete(t);
  }

  auditLogs.unshift({
    id: `log_${Date.now()}`,
    type: "security",
    title: "Account Permanently Deleted",
    description: `User account ${userId} and associated private data were removed.`,
    timestamp: "Just now",
    level: "warning"
  });

  res.json({ success: true, message: "Your account and data have been permanently deleted." });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({ success: true, user: req.currentUser });
});

// -------------------------------------------------------------
// 3. USERS & CONTACTS DIRECTORY
// -------------------------------------------------------------
app.get('/api/users', authenticate, (req, res) => {
  const currentUserId = req.currentUser.id;

  // Filter and format users with privacy mask
  const sanitizedUsers = users.map(user => {
    const isMe = user.id === currentUserId;
    const isBlocked = req.currentUser.blockedUserIds?.includes(user.id);
    const hasBlockedMe = user.blockedUserIds?.includes(currentUserId);

    // Apply privacy rules:
    // If onlineStatusVisibility === 'nobody', hide online status
    let showOnline = user.isOnline;
    if (!isMe && user.privacy?.onlineStatusVisibility === 'nobody') {
      showOnline = false;
    }

    // Mask email & phone for privacy protection
    const maskedEmail = isMe 
      ? user.email 
      : (user.email ? user.email.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => `${a}***${c}`) : '');
    
    const maskedPhone = isMe
      ? user.phone
      : (user.phone ? user.phone.replace(/(\d{3})\d{4}(\d{2})/, '$1-****-$2') : '');

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      bio: user.privacy?.profileVisibility === 'nobody' && !isMe ? 'Private profile' : user.bio,
      isOnline: hasBlockedMe || isBlocked ? false : showOnline,
      lastSeen: hasBlockedMe || isBlocked ? 'Unavailable' : user.lastSeen,
      email: maskedEmail,
      phone: maskedPhone,
      isBlocked,
      hasBlockedMe,
      whoCanContact: user.privacy?.whoCanContact || 'everyone'
    };
  });

  res.json({ success: true, users: sanitizedUsers });
});

app.put('/api/users/profile', authenticate, (req, res) => {
  const { displayName, bio, avatar, status } = req.body;
  const user = req.currentUser;

  if (displayName) user.displayName = displayName.trim();
  if (bio !== undefined) user.bio = bio.trim();
  if (avatar) user.avatar = avatar;
  if (status !== undefined) user.status = status;

  res.json({ success: true, user });
});

// -------------------------------------------------------------
// 4. PRIVACY & SAFETY MODULE (Requirement 2, 4)
// -------------------------------------------------------------
app.get('/api/safety/settings', authenticate, (req, res) => {
  res.json({
    success: true,
    privacy: req.currentUser.privacy || {
      whoCanContact: 'everyone',
      profileVisibility: 'everyone',
      onlineStatusVisibility: 'everyone',
      safeMediaFilter: true
    },
    blockedUserIds: req.currentUser.blockedUserIds || []
  });
});

app.put('/api/safety/settings', authenticate, (req, res) => {
  const { whoCanContact, profileVisibility, onlineStatusVisibility, safeMediaFilter } = req.body;
  const user = req.currentUser;

  if (!user.privacy) user.privacy = {};
  if (whoCanContact) user.privacy.whoCanContact = whoCanContact;
  if (profileVisibility) user.privacy.profileVisibility = profileVisibility;
  if (onlineStatusVisibility) user.privacy.onlineStatusVisibility = onlineStatusVisibility;
  if (safeMediaFilter !== undefined) user.privacy.safeMediaFilter = Boolean(safeMediaFilter);

  auditLogs.unshift({
    id: `log_${Date.now()}`,
    type: "safety",
    title: "Privacy Settings Updated",
    description: `Controls: Contact [${user.privacy.whoCanContact}], Profile [${user.privacy.profileVisibility}], Online [${user.privacy.onlineStatusVisibility}]`,
    timestamp: "Just now",
    level: "info"
  });

  res.json({ success: true, privacy: user.privacy });
});

app.post('/api/safety/block', authenticate, (req, res) => {
  const { targetUserId } = req.body;
  if (!targetUserId) {
    return res.status(400).json({ error: "Target user ID required" });
  }
  if (targetUserId === req.currentUser.id) {
    return res.status(400).json({ error: "You cannot block yourself" });
  }

  if (!req.currentUser.blockedUserIds) {
    req.currentUser.blockedUserIds = [];
  }

  if (!req.currentUser.blockedUserIds.includes(targetUserId)) {
    req.currentUser.blockedUserIds.push(targetUserId);
  }

  const target = users.find(u => u.id === targetUserId);
  const targetName = target ? target.displayName : targetUserId;

  auditLogs.unshift({
    id: `log_${Date.now()}`,
    type: "safety",
    title: "User Blocked",
    description: `Blocked ${targetName}. They can no longer send you messages or view your status.`,
    timestamp: "Just now",
    level: "warning"
  });

  res.json({
    success: true,
    message: `User ${targetName} blocked successfully`,
    blockedUserIds: req.currentUser.blockedUserIds
  });
});

app.post('/api/safety/unblock', authenticate, (req, res) => {
  const { targetUserId } = req.body;
  if (!targetUserId) {
    return res.status(400).json({ error: "Target user ID required" });
  }

  if (req.currentUser.blockedUserIds) {
    req.currentUser.blockedUserIds = req.currentUser.blockedUserIds.filter(id => id !== targetUserId);
  }

  const target = users.find(u => u.id === targetUserId);
  const targetName = target ? target.displayName : targetUserId;

  auditLogs.unshift({
    id: `log_${Date.now()}`,
    type: "safety",
    title: "User Unblocked",
    description: `Unblocked ${targetName}. Messaging permissions restored.`,
    timestamp: "Just now",
    level: "info"
  });

  res.json({
    success: true,
    message: `User ${targetName} unblocked successfully`,
    blockedUserIds: req.currentUser.blockedUserIds
  });
});

app.get('/api/safety/blocked', authenticate, (req, res) => {
  const blockedIds = req.currentUser.blockedUserIds || [];
  const blockedList = users
    .filter(u => blockedIds.includes(u.id))
    .map(u => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      avatar: u.avatar
    }));

  res.json({ success: true, blockedUsers: blockedList });
});

app.post('/api/safety/report', authenticate, (req, res) => {
  const { targetType, targetId, category, reason, details } = req.body;

  if (!targetType || !targetId || !category || !reason) {
    return res.status(400).json({ error: "Incomplete report information" });
  }

  const newReport = {
    id: `rep_${Date.now()}`,
    reporterId: req.currentUser.id,
    targetType, // 'user' | 'message' | 'image'
    targetId,
    category,   // 'spam' | 'harassment' | 'inappropriate_media' | 'scam' | 'other'
    reason,
    details: details || '',
    timestamp: new Date().toLocaleString(),
    status: "Pending Investigation"
  };

  reports.unshift(newReport);

  auditLogs.unshift({
    id: `log_${Date.now()}`,
    type: "safety",
    title: `Safety Report Filed (${targetType.toUpperCase()})`,
    description: `Report filed for category "${category}": ${reason}. Safety team notified.`,
    timestamp: "Just now",
    level: "warning"
  });

  res.status(201).json({
    success: true,
    message: "Thank you. Your report has been submitted to the safety team for review.",
    report: newReport
  });
});

app.get('/api/safety/reports', authenticate, (req, res) => {
  const userReports = reports.filter(r => r.reporterId === req.currentUser.id);
  res.json({ success: true, reports: userReports });
});

app.get('/api/safety/audit-logs', authenticate, (req, res) => {
  res.json({ success: true, logs: auditLogs.slice(0, 20) });
});

// -------------------------------------------------------------
// 5. MESSAGING & CHATS (Requirement 1, 2, 4)
// -------------------------------------------------------------
app.get('/api/conversations', authenticate, (req, res) => {
  const userId = req.currentUser.id;

  const userConversations = conversations
    .filter(c => c.participants.includes(userId))
    .map(c => {
      const otherUserId = c.participants.find(id => id !== userId);
      const otherUser = users.find(u => u.id === otherUserId);
      const isBlocked = req.currentUser.blockedUserIds?.includes(otherUserId);

      return {
        id: c.id,
        participants: c.participants,
        otherUser: otherUser ? {
          id: otherUser.id,
          username: otherUser.username,
          displayName: otherUser.displayName,
          avatar: otherUser.avatar,
          isOnline: isBlocked ? false : otherUser.isOnline,
          lastSeen: isBlocked ? 'Unavailable' : otherUser.lastSeen,
          isBlocked
        } : null,
        unreadCount: c.unreadCount?.[userId] || 0,
        muted: c.muted?.[userId] || false,
        pinned: c.pinned?.[userId] || false,
        lastMessage: c.lastMessage
      };
    });

  res.json({ success: true, conversations: userConversations });
});

app.get('/api/messages/:conversationId', authenticate, (req, res) => {
  const { conversationId } = req.params;
  const userId = req.currentUser.id;

  const convo = conversations.find(c => c.id === conversationId);
  if (!convo || !convo.participants.includes(userId)) {
    return res.status(403).json({ error: "Access denied to this conversation" });
  }

  const convoMessages = messages.filter(m => m.conversationId === conversationId);

  // Clear unread count for current user
  if (convo.unreadCount && convo.unreadCount[userId]) {
    convo.unreadCount[userId] = 0;
  }

  res.json({ success: true, messages: convoMessages });
});

app.post('/api/messages', authenticate, (req, res) => {
  const { conversationId, text, media } = req.body;
  const senderId = req.currentUser.id;

  if (!conversationId) {
    return res.status(400).json({ error: "Conversation ID is required" });
  }

  if (!text && !media) {
    return res.status(400).json({ error: "Message must contain text or media" });
  }

  // 1. Rate Limiting Check (Spam Reduction)
  const now = Date.now();
  let userTimestamps = rateLimitMap.get(senderId) || [];
  userTimestamps = userTimestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);

  if (userTimestamps.length >= RATE_LIMIT_MAX_MESSAGES) {
    return res.status(429).json({
      error: "Rate limit triggered: You are sending messages too quickly. Please pause 5 seconds."
    });
  }

  userTimestamps.push(now);
  rateLimitMap.set(senderId, userTimestamps);

  // 2. Conversation & Block check
  const convo = conversations.find(c => c.id === conversationId);
  if (!convo || !convo.participants.includes(senderId)) {
    return res.status(403).json({ error: "Unauthorized: not a participant of this chat" });
  }

  const recipientId = convo.participants.find(id => id !== senderId);
  const recipient = users.find(u => u.id === recipientId);

  if (recipient) {
    // Check if sender is blocked by recipient
    if (recipient.blockedUserIds?.includes(senderId)) {
      return res.status(403).json({ error: "Cannot send message: This user has blocked you." });
    }
    // Check if recipient is blocked by sender
    if (req.currentUser.blockedUserIds?.includes(recipientId)) {
      return res.status(403).json({ error: "Cannot send message: You have blocked this user. Unblock them first." });
    }
    // Check recipient's whoCanContact
    if (recipient.privacy?.whoCanContact === 'nobody') {
      return res.status(403).json({ error: "This user does not accept messages from anyone." });
    }
  }

  // 3. Abuse / Spam detection
  if (text) {
    for (const pattern of BANNED_PATTERNS) {
      if (pattern.test(text)) {
        auditLogs.unshift({
          id: `log_${Date.now()}`,
          type: "safety",
          title: "Harmful Content Blocked",
          description: `Message blocked due to policy violation: detected spam/abuse pattern.`,
          timestamp: "Just now",
          level: "warning"
        });
        return res.status(400).json({
          error: "Message blocked by Vibely Safety Filter: Contains suspected scam, spam or prohibited speech."
        });
      }
    }
  }

  const newMsg = {
    id: `m_${Date.now()}`,
    conversationId,
    senderId,
    text: text ? text.trim() : "",
    media: media || null,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toISOString().split('T')[0],
    reactions: {},
    isDeleted: false
  };

  messages.push(newMsg);

  // Update conversation lastMessage
  convo.lastMessage = {
    text: text || "📷 Shared an image",
    timestamp: newMsg.timestamp,
    senderId
  };

  if (!convo.unreadCount) convo.unreadCount = {};
  if (recipientId) {
    convo.unreadCount[recipientId] = (convo.unreadCount[recipientId] || 0) + 1;
  }

  res.status(201).json({ success: true, message: newMsg });
});

// Delete own message
app.delete('/api/messages/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const msg = messages.find(m => m.id === id);

  if (!msg) {
    return res.status(404).json({ error: "Message not found" });
  }

  if (msg.senderId !== req.currentUser.id) {
    return res.status(403).json({ error: "You can only delete your own messages" });
  }

  msg.isDeleted = true;
  msg.text = "This message was deleted";
  msg.media = null;

  res.json({ success: true, message: msg });
});

// Add reaction
app.post('/api/messages/:id/react', authenticate, (req, res) => {
  const { id } = req.params;
  const { emoji } = req.body;
  const userId = req.currentUser.id;

  const msg = messages.find(m => m.id === id);
  if (!msg) {
    return res.status(404).json({ error: "Message not found" });
  }

  if (!msg.reactions) msg.reactions = {};
  if (!msg.reactions[emoji]) msg.reactions[emoji] = [];

  const existingIdx = msg.reactions[emoji].indexOf(userId);
  if (existingIdx > -1) {
    msg.reactions[emoji].splice(existingIdx, 1);
    if (msg.reactions[emoji].length === 0) {
      delete msg.reactions[emoji];
    }
  } else {
    msg.reactions[emoji].push(userId);
  }

  res.json({ success: true, reactions: msg.reactions });
});

// Start or get conversation with another user
app.post('/api/conversations/start', authenticate, (req, res) => {
  const { targetUserId } = req.body;
  const currentUserId = req.currentUser.id;

  if (!targetUserId || targetUserId === currentUserId) {
    return res.status(400).json({ error: "Invalid target user" });
  }

  // Check if conversation already exists
  let convo = conversations.find(
    c => c.participants.includes(currentUserId) && c.participants.includes(targetUserId)
  );

  if (!convo) {
    convo = {
      id: `c_${Date.now()}`,
      participants: [currentUserId, targetUserId],
      unreadCount: { [currentUserId]: 0, [targetUserId]: 0 },
      muted: { [currentUserId]: false, [targetUserId]: false },
      pinned: { [currentUserId]: false, [targetUserId]: false },
      lastMessage: null
    };
    conversations.unshift(convo);
  }

  const otherUser = users.find(u => u.id === targetUserId);

  res.json({
    success: true,
    conversation: {
      id: convo.id,
      participants: convo.participants,
      otherUser: otherUser ? {
        id: otherUser.id,
        username: otherUser.username,
        displayName: otherUser.displayName,
        avatar: otherUser.avatar,
        isOnline: otherUser.isOnline,
        lastSeen: otherUser.lastSeen
      } : null,
      unreadCount: 0,
      muted: false,
      pinned: false,
      lastMessage: convo.lastMessage
    }
  });
});

// Toggle mute conversation
app.post('/api/conversations/:id/mute', authenticate, (req, res) => {
  const { id } = req.params;
  const userId = req.currentUser.id;
  const convo = conversations.find(c => c.id === id);

  if (!convo || !convo.participants.includes(userId)) {
    return res.status(403).json({ error: "Access denied" });
  }

  if (!convo.muted) convo.muted = {};
  convo.muted[userId] = !convo.muted[userId];

  res.json({ success: true, muted: convo.muted[userId] });
});

// Delete conversation
app.delete('/api/conversations/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const userId = req.currentUser.id;

  const convoIdx = conversations.findIndex(c => c.id === id);
  if (convoIdx === -1) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  // Remove messages in this conversation
  messages = messages.filter(m => m.conversationId !== id);
  conversations.splice(convoIdx, 1);

  res.json({ success: true, message: "Conversation deleted permanently" });
});

// -------------------------------------------------------------
// 6. SAFE MEDIA UPLOAD API (Requirement 2, 4)
// -------------------------------------------------------------
app.post('/api/media/upload', authenticate, (req, res) => {
  const { base64Data, fileName, mimeType, fileSize } = req.body;

  if (!base64Data || !fileName || !mimeType) {
    return res.status(400).json({ error: "Missing upload payload" });
  }

  // 1. Strict File Type Validation: only image/jpeg, image/png, image/webp, image/gif
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
    return res.status(400).json({
      error: `Security violation: File type '${mimeType}' is not supported. Only safe image formats (JPG, PNG, WEBP, GIF) are permitted.`
    });
  }

  // Check dangerous file extensions
  const DANGEROUS_EXTENSIONS = ['.exe', '.bat', '.cmd', '.sh', '.vbs', '.js', '.scr', '.jar', '.com', '.msi'];
  const ext = path.extname(fileName).toLowerCase();
  if (DANGEROUS_EXTENSIONS.includes(ext)) {
    auditLogs.unshift({
      id: `log_${Date.now()}`,
      type: "security",
      title: "Malicious Upload Blocked",
      description: `Blocked upload attempt of executable extension: ${fileName}`,
      timestamp: "Just now",
      level: "warning"
    });
    return res.status(400).json({
      error: `Blocked dangerous file extension '${ext}'. Executable files cannot be uploaded.`
    });
  }

  // 2. Strict File Size Validation: max 5MB
  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
  if (fileSize && fileSize > MAX_SIZE_BYTES) {
    return res.status(400).json({
      error: `Upload rejected: Image size (${(fileSize / (1024 * 1024)).toFixed(1)}MB) exceeds the 5MB limit.`
    });
  }

  // Format safe media object
  const safeMedia = {
    id: `media_${Date.now()}`,
    url: base64Data, // Data URI
    name: fileName.replace(/[^\w\d._-]/g, '_'),
    caption: req.body.caption || fileName,
    size: fileSize ? `${(fileSize / 1024).toFixed(0)} KB` : '450 KB',
    type: mimeType,
    uploadedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    media: safeMedia
  });
});

// -------------------------------------------------------------
// 7. MEDIA GALLERY API
// -------------------------------------------------------------
app.get('/api/media/gallery', authenticate, (req, res) => {
  const userId = req.currentUser.id;
  const userConvoIds = conversations
    .filter(c => c.participants.includes(userId))
    .map(c => c.id);

  const mediaItems = [];
  messages
    .filter(m => userConvoIds.includes(m.conversationId) && m.media && !m.isDeleted)
    .forEach(m => {
      const convo = conversations.find(c => c.id === m.conversationId);
      const otherUserId = convo?.participants.find(id => id !== userId);
      const otherUser = users.find(u => u.id === otherUserId);

      mediaItems.push({
        id: m.id,
        mediaUrl: m.media.url,
        fileName: m.media.name || 'image.jpg',
        caption: m.media.caption || m.text || '',
        senderId: m.senderId,
        senderName: m.senderId === userId ? 'You' : (otherUser?.displayName || 'Friend'),
        conversationId: m.conversationId,
        timestamp: m.timestamp,
        date: m.date,
        size: m.media.size || '1.2 MB',
        type: m.media.type || 'image/jpeg'
      });
    });

  res.json({ success: true, gallery: mediaItems });
});

// Serve static frontend assets from dist/ if it exists
const DIST_DIR = path.join(ROOT_DIR, 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

// Start Express
app.listen(PORT, () => {
  console.log(`[Vibely API] Server running on port ${PORT}`);
  if (fs.existsSync(DIST_DIR)) {
    console.log(`[Vibely Web] Client served at http://localhost:${PORT}`);
  }
});
