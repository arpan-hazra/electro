// src/context/UpdateContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getInstalledVersion,
  setInstalledVersion as saveInstalledVersion,
  resetInstalledVersion,
  compareVersions,
  getUpdateType,
  staticVersionInfo
} from '../config/version';

const UpdateContext = createContext();

const API_BASE = '/api';

export function UpdateProvider({ children }) {
  const [installedVersion, setInstalledVersionState] = useState(() => getInstalledVersion());
  const [serverVersionConfig, setServerVersionConfig] = useState(staticVersionInfo);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [lastChecked, setLastChecked] = useState(null);

  // Check version against server
  const checkVersion = useCallback(async (manual = false) => {
    setIsCheckingUpdate(true);
    try {
      const res = await fetch(`${API_BASE}/version`);
      let config = staticVersionInfo;
      if (res.ok) {
        const data = await res.json();
        config = data.config;
        setServerVersionConfig(config);
      }

      const curInstalled = getInstalledVersion();
      const remoteVer = config.serverAvailableVersion?.version || config.appVersion;
      const hasNewer = compareVersions(curInstalled, remoteVer) < 0;

      setIsUpdateAvailable(hasNewer);
      setLastChecked(new Date());

      // If newer and this is either on app start or manual check:
      if (hasNewer) {
        // Check if user dismissed 'later' recently or if it's mandatory
        const isMandatory = config.serverAvailableVersion?.isMandatory;
        const dismissedKey = `vibely_dismissed_${remoteVer}`;
        const wasDismissed = sessionStorage.getItem(dismissedKey);

        if (!wasDismissed || isMandatory || manual) {
          setShowUpdateModal(true);
        }
      } else if (manual) {
        // Already on latest
        setShowUpdateModal(false);
      }
    } catch (err) {
      console.warn('Update check fallback to local config:', err);
    } finally {
      setIsCheckingUpdate(false);
    }
  }, []);

  // Check update automatically when app starts
  useEffect(() => {
    checkVersion(false);
  }, [checkVersion]);

  // Apply update simulation
  const applyUpdate = async () => {
    const targetVersion = serverVersionConfig.serverAvailableVersion?.version || "0.2";
    setIsUpdating(true);
    setUpdateProgress(10);

    // Simulate downloading & verifying package
    const interval = setInterval(() => {
      setUpdateProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 100;
        }
        return prev + 15;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      saveInstalledVersion(targetVersion);
      setInstalledVersionState(targetVersion);
      setIsUpdating(false);
      setUpdateProgress(100);
      setShowUpdateModal(false);
      setIsUpdateAvailable(false);
    }, 1800);
  };

  const dismissUpdate = () => {
    const remoteVer = serverVersionConfig.serverAvailableVersion?.version;
    if (remoteVer) {
      sessionStorage.setItem(`vibely_dismissed_${remoteVer}`, 'true');
    }
    setShowUpdateModal(false);
  };

  // Developer simulator helper
  const simulateServerVersion = async ({ version, updateType, isMandatory, whatsNew, title }) => {
    try {
      const res = await fetch(`${API_BASE}/version/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newVersion: version,
          updateType,
          isMandatory,
          whatsNew,
          title
        })
      });
      if (res.ok) {
        const data = await res.json();
        setServerVersionConfig(data.config);
        const curInstalled = getInstalledVersion();
        const hasNewer = compareVersions(curInstalled, version) < 0;
        setIsUpdateAvailable(hasNewer);
        if (hasNewer) {
          setShowUpdateModal(true);
        }
        return { success: true };
      }
    } catch (err) {
      console.error('Simulator error:', err);
    }
    return { success: false };
  };

  const resetToV01 = () => {
    resetInstalledVersion();
    setInstalledVersionState("0.1");
    checkVersion(true);
  };

  const currentUpdateType = getUpdateType(
    installedVersion,
    serverVersionConfig.serverAvailableVersion?.version || "0.2"
  );

  return (
    <UpdateContext.Provider value={{
      installedVersion,
      serverVersionConfig,
      isUpdateAvailable,
      isCheckingUpdate,
      showUpdateModal,
      isUpdating,
      updateProgress,
      lastChecked,
      currentUpdateType,
      checkForUpdates: () => checkVersion(true),
      applyUpdate,
      dismissUpdate,
      setShowUpdateModal,
      simulateServerVersion,
      resetToV01
    }}>
      {children}
    </UpdateContext.Provider>
  );
}

export function useUpdate() {
  const context = useContext(UpdateContext);
  if (!context) throw new Error('useUpdate must be used within UpdateProvider');
  return context;
}
