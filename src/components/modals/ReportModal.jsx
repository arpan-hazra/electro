// src/components/modals/ReportModal.jsx
import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { useTheme } from '../../context/ThemeContext';
import { AlertTriangle, ShieldAlert, CheckCircle, X } from 'lucide-react';

export default function ReportModal({ isOpen, onClose, targetType, targetId, targetName, defaultCategory = 'spam' }) {
  const { submitReport } = useSafety();
  const { currentAccent } = useTheme();

  const [category, setCategory] = useState(defaultCategory);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'spam', label: 'Spam & Suspicious Activity', hint: 'Repetitive messages, unwanted ads, phishing' },
    { id: 'harassment', label: 'Harassment or Bullying', hint: 'Threats, abusive language, intimidation' },
    { id: 'inappropriate_media', label: 'Inappropriate or Explicit Media', hint: 'Unsolicited images, NSFW, violence' },
    { id: 'scam', label: 'Scam or Financial Fraud', hint: 'Asking for money, impersonation, credential theft' },
    { id: 'other', label: 'Other Safety Concern', hint: 'Any other violation of community standards' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a brief reason for the report');
      return;
    }
    setSubmitting(true);
    setError(null);

    const res = await submitReport({
      targetType: targetType || 'user',
      targetId: targetId || 'unknown',
      category,
      reason: reason.trim(),
      details: details.trim()
    });

    setSubmitting(false);
    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setReason('');
        setDetails('');
        onClose();
      }, 1600);
    } else {
      setError(res.error || 'Failed to submit report');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Report {targetType === 'image' ? 'Inappropriate Image' : targetType === 'message' ? 'Message' : 'User'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reporting {targetName ? `"${targetName}"` : 'content'} for safety review
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto" />
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Report Submitted</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Our safety review team will investigate this immediately. Thank you for helping keep Vibely safe!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Select Concern Category
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                      category === cat.id
                        ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={category === cat.id}
                      onChange={() => setCategory(cat.id)}
                      className="mt-1 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{cat.label}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{cat.hint}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Summary of Issue *
              </label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Unsolicited offensive picture received"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Additional Details (Optional)
              </label>
              <textarea
                rows="2"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide any context that will help us investigate quickly..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl text-xs text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
              🔒 <strong>Confidentiality Guarantee:</strong> The reported user will not see your identity. Reports are reviewed by human moderators within 24 hours.
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all ${
                  submitting
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-rose-600 hover:bg-rose-700 active:scale-[0.98]'
                }`}
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
