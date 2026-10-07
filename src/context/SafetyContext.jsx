// src/context/SafetyContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SafetyContext = createContext();

const API_BASE = '/api';

export function SafetyProvider({ children }) {
  const { token, user } = useAuth();
  const [privacySettings, setPrivacySettings] = useState({
    whoCanContact: 'everyone',
    profileVisibility: 'everyone',
    onlineStatusVisibility: 'everyone',
    safeMediaFilter: true
  });
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load safety settings & blocked users when user logs in
  useEffect(() => {
    if (!token || !user) {
      setBlockedUsers([]);
      setMyReports([]);
      setAuditLogs([]);
      return;
    }

    fetchSafetyData();
  }, [token, user]);

  const fetchSafetyData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [settingsRes, blockedRes, reportsRes, logsRes] = await Promise.all([
        fetch(`${API_BASE}/safety/settings`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/safety/blocked`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/safety/reports`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/safety/audit-logs`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setPrivacySettings(data.privacy);
      }
      if (blockedRes.ok) {
        const data = await blockedRes.json();
        setBlockedUsers(data.blockedUsers);
      }
      if (reportsRes.ok) {
        const data = await reportsRes.json();
        setMyReports(data.reports);
      }
      if (logsRes.ok) {
        const data = await logsRes.json();
        setAuditLogs(data.logs);
      }
    } catch (err) {
      console.error('Error fetching safety data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updatePrivacySettings = async (newSettings) => {
    try {
      const res = await fetch(`${API_BASE}/safety/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newSettings)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPrivacySettings(data.privacy);
      await fetchSafetyData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const blockUser = async (targetUserId) => {
    try {
      const res = await fetch(`${API_BASE}/safety/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ targetUserId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await fetchSafetyData();
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const unblockUser = async (targetUserId) => {
    try {
      const res = await fetch(`${API_BASE}/safety/unblock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ targetUserId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await fetchSafetyData();
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const submitReport = async ({ targetType, targetId, category, reason, details }) => {
    try {
      const res = await fetch(`${API_BASE}/safety/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ targetType, targetId, category, reason, details })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMyReports(prev => [data.report, ...prev]);
      await fetchSafetyData();
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const isUserBlocked = (userId) => {
    return blockedUsers.some(u => u.id === userId);
  };

  return (
    <SafetyContext.Provider value={{
      privacySettings,
      blockedUsers,
      myReports,
      auditLogs,
      loading,
      updatePrivacySettings,
      blockUser,
      unblockUser,
      submitReport,
      isUserBlocked,
      refreshSafety: fetchSafetyData
    }}>
      {children}
    </SafetyContext.Provider>
  );
}

export function useSafety() {
  const context = useContext(SafetyContext);
  if (!context) throw new Error('useSafety must be used within SafetyProvider');
  return context;
}
