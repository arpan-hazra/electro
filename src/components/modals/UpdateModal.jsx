// src/components/modals/UpdateModal.jsx
import React from 'react';
import { useUpdate } from '../../context/UpdateContext';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles, Download, CheckCircle2, ShieldCheck, ArrowRight, X } from 'lucide-react';

export default function UpdateModal() {
  const {
    showUpdateModal,
    serverVersionConfig,
    installedVersion,
    isUpdating,
    updateProgress,
    currentUpdateType,
    applyUpdate,
    dismissUpdate
  } = useUpdate();
  const { currentAccent } = useTheme();

  if (!showUpdateModal) return null;

  const targetVersion = serverVersionConfig?.serverAvailableVersion?.version || "0.2";
  const isMandatory = serverVersionConfig?.serverAvailableVersion?.isMandatory;
  const whatsNew = serverVersionConfig?.serverAvailableVersion?.whatsNew || [
    "Improved chat interface",
    "New image gallery",
    "Better performance",
    "Safety improvements"
  ];
  const updateTitle = serverVersionConfig?.serverAvailableVersion?.title || `Vibely ${targetVersion} is available`;

  // Badge configuration based on update level
  const typeBadgeMap = {
    minor: { label: 'Minor Update', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
    feature: { label: 'Feature Release', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' },
    major: { label: 'Major Release', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300' }
  };
  const badgeInfo = typeBadgeMap[currentUpdateType] || typeBadgeMap.minor;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all animate-slide-up">
        {/* Header Banner */}
        <div className={`p-6 text-white bg-gradient-to-r ${currentAccent.gradient} relative`}>
          {!isMandatory && !isUpdating && (
            <button
              onClick={dismissUpdate}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              title="Close for now"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full bg-white/20 backdrop-blur-sm">
              New update available!
            </span>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-white/20 backdrop-blur-sm">
              {badgeInfo.label}
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">{updateTitle}</h2>
          <p className="text-white/80 text-sm mt-1 flex items-center gap-1.5">
            <span>Version {installedVersion}</span>
            <ArrowRight className="w-4 h-4 opacity-75" />
            <span className="font-semibold text-white">Version {targetVersion}</span>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* What's New Section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-vibely-purple" />
              What's New:
            </h4>
            <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              {whatsNew.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Verification Guarantee */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 px-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Cryptographically signed & verified build from official repository.</span>
          </div>

          {/* Update Progress Indicator */}
          {isUpdating && (
            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Installing Vibely {targetVersion}...</span>
                <span>{updateProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${currentAccent.gradient} transition-all duration-300 ease-out`}
                  style={{ width: `${updateProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {!isUpdating && !isMandatory && (
              <button
                type="button"
                onClick={dismissUpdate}
                className="flex-1 py-3 px-4 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                Later
              </button>
            )}

            <button
              type="button"
              disabled={isUpdating}
              onClick={applyUpdate}
              className={`flex-1 py-3 px-5 rounded-2xl text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                isUpdating
                  ? 'bg-slate-400 cursor-not-allowed'
                  : `bg-gradient-to-r ${currentAccent.gradient} hover:opacity-95 hover:shadow-xl active:scale-[0.98]`
              }`}
            >
              <Download className="w-4 h-4" />
              {isUpdating ? 'Updating...' : 'Update Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
