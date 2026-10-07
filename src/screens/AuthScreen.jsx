// src/screens/AuthScreen.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Camera,
  Check,
  Smartphone
} from 'lucide-react';

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
];

export default function AuthScreen() {
  const { login, signup, recoverPassword, error, clearError, quickSwitchUser } = useAuth();
  const { currentAccent } = useTheme();

  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'recover'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  // Form states
  const [loginIdentifier, setLoginIdentifier] = useState('alex_r');
  const [loginPassword, setLoginPassword] = useState('DemoPass123!');

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+1 555-0199');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [recoveryEmail, setRecoveryEmail] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    let score = 0;
    const checks = {
      length: pwd.length >= 8,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd)
    };
    if (checks.length) score += 1;
    if (checks.upper && checks.lower) score += 1;
    if (checks.number) score += 1;
    if (checks.special) score += 1;

    let label = 'Very Weak';
    let color = 'bg-rose-500';
    if (score === 2) { label = 'Fair'; color = 'bg-amber-500'; }
    else if (score === 3) { label = 'Good'; color = 'bg-blue-500'; }
    else if (score === 4) { label = 'Strong & Secure'; color = 'bg-emerald-500'; }

    return { score, label, color, checks };
  };

  const strength = getPasswordStrength(password);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearError();
    await login(loginIdentifier, loginPassword);
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('Please accept the Vibely Safety & Privacy Guidelines to proceed.');
      return;
    }
    setLoading(true);
    clearError();
    const res = await signup({
      username,
      displayName,
      email,
      phone,
      avatar: selectedAvatar,
      password
    });
    setLoading(false);
    if (!res.success) {
      // Error handled by AuthContext
    }
  };

  const handleRecover = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearError();
    const res = await recoverPassword(recoveryEmail);
    setLoading(false);
    if (res.success) {
      setSuccessNotice(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100 relative overflow-hidden select-none">
      {/* Radiant ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-slide-up my-6">
        {/* Logo and Header */}
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${currentAccent.gradient} mx-auto flex items-center justify-center shadow-lg shadow-purple-500/30 mb-3`}>
            <svg
              className="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12h2l3-6 4 12 3-8 2 4 2-2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {mode === 'login' && 'Sign in to Vibely'}
            {mode === 'signup' && 'Create your Vibely Account'}
            {mode === 'recover' && 'Recover Account Password'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' && 'Connect with friends in a secure, vibrant space'}
            {mode === 'signup' && 'Safe cloud messaging, end-to-end user controls'}
            {mode === 'recover' && 'Enter your email to receive a secure recovery instruction'}
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800/80 rounded-2xl text-xs text-rose-300 flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Notice Banner */}
        {successNotice && (
          <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* 1. LOGIN MODE */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Username, Email, or Phone
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. alex_r, alex@example.com, or +1 555-0192"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { clearError(); setMode('recover'); }}
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl text-sm font-bold text-white shadow-lg bg-gradient-to-r ${currentAccent.gradient} hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2`}
            >
              <span>{loading ? 'Verifying Credentials...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Fill Buttons */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2 text-center">
                Or quick test with demo profiles:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => quickSwitchUser('alex_r')}
                  className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors text-center truncate"
                >
                  Alex (Designer)
                </button>
                <button
                  type="button"
                  onClick={() => quickSwitchUser('maya_lin')}
                  className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors text-center truncate"
                >
                  Maya (Artist)
                </button>
                <button
                  type="button"
                  onClick={() => quickSwitchUser('jordan_h')}
                  className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors text-center truncate"
                >
                  Jordan (Systems)
                </button>
                <button
                  type="button"
                  onClick={() => quickSwitchUser('marcus_c')}
                  className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors text-center truncate"
                >
                  Marcus (Security)
                </button>
              </div>
            </div>

            <div className="text-center pt-2 text-xs text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { clearError(); setMode('signup'); }}
                className="font-bold text-purple-400 hover:text-purple-300"
              >
                Create Account
              </button>
            </div>
          </form>
        )}

        {/* 2. SIGN UP MODE (with Avatar picker, Phone, and Password Strength) */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-3.5">
            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Select Profile Avatar
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={selectedAvatar}
                  alt="Selected avatar"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500 shadow-md shrink-0"
                />
                <div className="flex-1 overflow-x-auto py-1">
                  <div className="flex items-center gap-2">
                    {PRESET_AVATARS.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedAvatar(av)}
                        className={`relative rounded-xl overflow-hidden shrink-0 border-2 transition-transform ${
                          selectedAvatar === av
                            ? 'border-purple-400 scale-105'
                            : 'border-slate-700 hover:border-slate-500 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={av} alt="Preset avatar" className="w-9 h-9 object-cover" />
                        {selectedAvatar === av && (
                          <div className="absolute inset-0 bg-purple-600/40 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Display Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Robin Banks"
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Username *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2 text-sm text-slate-400 font-bold">@</span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="robin_b"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="robin@vibely.app"
                    className="w-full pl-9 pr-2.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-0199"
                    className="w-full pl-9 pr-2.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>
            </div>

            {/* Secure Password input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Password *
                </label>
                {password && (
                  <span className="text-[11px] font-semibold text-slate-300">
                    Strength: <span className="font-bold">{strength.label}</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 chars, mixed case, numbers & symbols"
                  className="w-full px-3.5 pr-10 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Meter Bar */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${(strength.score / 4) * 100}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 pt-1">
                    <span className={strength.checks.length ? 'text-emerald-400' : ''}>
                      • 8+ characters
                    </span>
                    <span className={strength.checks.upper && strength.checks.lower ? 'text-emerald-400' : ''}>
                      • Upper & lowercase
                    </span>
                    <span className={strength.checks.number ? 'text-emerald-400' : ''}>
                      • At least 1 number
                    </span>
                    <span className={strength.checks.special ? 'text-emerald-400' : ''}>
                      • Special character (@#$)
                    </span>
                  </div>
                </div>
              )}
            </div>

            <label className="flex items-start gap-2 text-xs text-slate-300 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-400"
              />
              <span>
                I agree to the <span className="text-purple-400 font-semibold">Privacy Policy</span> and community rules.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl text-sm font-bold text-white shadow-lg bg-gradient-to-r ${currentAccent.gradient} hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2`}
            >
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2 text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { clearError(); setMode('login'); }}
                className="font-bold text-purple-400 hover:text-purple-300"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* 3. RECOVER PASSWORD MODE */}
        {mode === 'recover' && (
          <form onSubmit={handleRecover} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="Enter your account email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl text-sm font-bold text-white shadow-lg bg-gradient-to-r ${currentAccent.gradient} hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2`}
            >
              <span>{loading ? 'Sending Recovery Link...' : 'Send Recovery Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2 text-xs text-slate-400">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => { clearError(); setMode('login'); }}
                className="font-bold text-purple-400 hover:text-purple-300"
              >
                Return to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
