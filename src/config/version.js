// src/config/version.js - Centralized Version & Update Configuration
import versionConfig from '../../versionConfig.json';

// Local storage key for persisting user's installed version during updates
const INSTALLED_VERSION_KEY = 'vibely_installed_version';
const UPDATE_LATER_TIMESTAMP_KEY = 'vibely_update_later_ts';

export const INITIAL_APP_VERSION = versionConfig.appVersion; // "0.1"

/**
 * Returns current installed version from storage or default
 */
export function getInstalledVersion() {
  return localStorage.getItem(INSTALLED_VERSION_KEY) || INITIAL_APP_VERSION;
}

/**
 * Saves upgraded version to localStorage
 */
export function setInstalledVersion(ver) {
  localStorage.setItem(INSTALLED_VERSION_KEY, ver);
}

/**
 * Reset installed version back to default
 */
export function resetInstalledVersion() {
  localStorage.removeItem(INSTALLED_VERSION_KEY);
}

/**
 * Helper to compare semantic versions (e.g., "0.1" < "0.2")
 * Returns:
 *   -1 if v1 < v2 (update available)
 *    0 if v1 === v2
 *    1 if v1 > v2
 */
export function compareVersions(v1, v2) {
  const parts1 = String(v1).split('.').map(n => parseInt(n, 10) || 0);
  const parts2 = String(v2).split('.').map(n => parseInt(n, 10) || 0);
  const maxLen = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < maxLen; i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    if (num1 < num2) return -1;
    if (num1 > num2) return 1;
  }
  return 0;
}

/**
 * Determine update level from old version to new version
 * 0.1 -> 0.2: Minor update
 * 0.2 -> 0.5: Larger feature update
 * 0.x -> 1.0: Major release
 */
export function getUpdateType(oldVer, newVer) {
  const p1 = String(oldVer).split('.').map(Number);
  const p2 = String(newVer).split('.').map(Number);

  if (p2[0] > p1[0]) {
    return 'major';
  }
  const diff = (p2[1] || 0) - (p1[1] || 0);
  if (diff >= 3) {
    return 'feature';
  }
  return 'minor';
}

export const staticVersionInfo = versionConfig;
