// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEY = 'quartzlab_user';

const DEFAULT_DEMO_USER = {
  id: 'usr_arpan_01',
  name: 'Arpan (Creator)',
  email: 'arpan@quartzlab3d.io',
  role: 'Lead Electronics & Robotics Engineer',
  avatar: '/arpan.png',
  bio: 'Building autonomous rovers, 16MHz quartz oscillators, and interactive 3D electronic models.',
  savedProjects: ['quartz-obstacle-rover', 'quartz-bionic-robotic-arm'],
  bookmarks: ['arduino-uno-r3', 'quartz-crystal-16mhz', 'hc-sr04-ultrasonic'],
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...parsed, avatar: '/arpan.png' };
      }
      return DEFAULT_DEMO_USER;
    } catch (e) {
      return DEFAULT_DEMO_USER;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

  useEffect(() => {
    if (user) {
      const updatedUser = { ...user, avatar: '/arpan.png' };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // Sign up action
  const signup = async ({ name, email, password, role }) => {
    const newUser = {
      id: `usr_${Date.now()}`,
      name: name || 'Mr. Arpan',
      email,
      role: role || 'Lead Electronics Engineer',
      avatar: '/arpan.png',
      bio: 'QuartzLab 3D Maker & Explorer',
      savedProjects: ['quartz-obstacle-rover'],
      bookmarks: ['arduino-uno-r3'],
    };
    setUser(newUser);
    setAuthModalOpen(false);
    return { success: true, user: newUser };
  };

  // Login action
  const login = async (email, password) => {
    const loggedUser = {
      id: `usr_${Date.now()}`,
      name: email.toLowerCase().includes('arpan') ? 'Mr. Arpan' : email.split('@')[0],
      email,
      role: 'Lead Electronics & Robotics Engineer',
      avatar: '/arpan.png',
      bio: 'Enthusiastic robotics maker designing with Quartz Arpan.',
      savedProjects: ['quartz-obstacle-rover', 'quartz-precision-clock'],
      bookmarks: ['arduino-uno-r3', 'hc-sr04-ultrasonic'],
    };
    setUser(loggedUser);
    setAuthModalOpen(false);
    return { success: true, user: loggedUser };
  };

  // Logout action
  const logout = () => {
    setUser(null);
  };

  // Toggle bookmark / saved project
  const toggleSaveProject = (projectId) => {
    if (!user) {
      setAuthModalOpen(true);
      return false;
    }
    const current = user.savedProjects || [];
    const updated = current.includes(projectId)
      ? current.filter((id) => id !== projectId)
      : [...current, projectId];
    setUser({ ...user, savedProjects: updated });
    return true;
  };

  const toggleBookmark = (componentId) => {
    if (!user) {
      setAuthModalOpen(true);
      return false;
    }
    const current = user.bookmarks || [];
    const updated = current.includes(componentId)
      ? current.filter((id) => id !== componentId)
      : [...current, componentId];
    setUser({ ...user, bookmarks: updated });
    return true;
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        signup,
        login,
        logout,
        toggleSaveProject,
        toggleBookmark,
        authModalOpen,
        authMode,
        setAuthMode,
        openAuth,
        closeAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
