import React, { useState, useEffect } from 'react';
import { 
  X, Mail, Lock, User, Phone, ShieldCheck, KeyRound, 
  ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Eye, EyeOff 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    authModalMode, 
    closeAuthModal, 
    login, 
    signup, 
    verifyOtp, 
    resendOtp 
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'otp'>('login');
  const [purpose, setPurpose] = useState<'login' | 'signup'>('login');
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Countdown timer for resend
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode);
      setPurpose(authModalMode);
      setError(null);
      setSuccessMessage(null);
      setOtp('');
      setDevOtp(null);
    }
  }, [isAuthModalOpen, authModalMode]);

  useEffect(() => {
    let timer: any;
    if (mode === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, countdown]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.status === 'otp_required' || res.status === 'otp_sent') {
        setDevOtp(res.dev_otp || null);
        setPurpose('login');
        setMode('otp');
        setCountdown(60);
        setCanResend(false);
        setSuccessMessage(`A 6-digit verification code has been dispatched for ${email}.`);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signup({
        full_name: fullName,
        email,
        password,
        phone: phone || undefined,
      });
      if (res.status === 'otp_sent') {
        setDevOtp(res.dev_otp || null);
        setPurpose('signup');
        setMode('otp');
        setCountdown(60);
        setCanResend(false);
        setSuccessMessage(`A 6-digit verification code has been dispatched for ${email}.`);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await verifyOtp(email, otp.trim(), purpose);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setError(null);
    setLoading(true);
    try {
      const res = await resendOtp(email, purpose);
      setDevOtp(res.dev_otp || null);
      setCountdown(60);
      setCanResend(false);
      setSuccessMessage(`New 6-digit verification code sent to ${email}.`);
    } catch (err: any) {
      setError(err.message || 'Could not resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('shahabdulmazid.ezan@yahoo.com');
    setPassword('Password123!');
  };

  const handleFillNormalDemo = () => {
    setEmail('candidate.demo@careertrack.bd');
    setPassword('Candidate2026!');
    setFullName('Recruitment Candidate');
    setPhone('+880 1711223344');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#12111f] shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800/80 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">CareerTrack BD</h2>
              <p className="text-[11px] text-zinc-400">Recruitment Portal Authentication</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 relative z-10">

          {/* Mode Switcher Tabs (Only if not in OTP step) */}
          {mode !== 'otp' && (
            <div className="flex rounded-xl p-1 bg-zinc-900 border border-zinc-800">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'login' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'signup' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Create Account (Sign Up)
              </button>
            </div>
          )}

          {/* Alert Banners */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span className="flex-1">{error}</span>
            </div>
          )}

          {successMessage && !error && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
              <span className="flex-1">{successMessage}</span>
            </div>
          )}

          {/* ── Mode 1: LOGIN ── */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. candidate@example.com"
                    className="input-dark pl-9 w-full text-xs sm:text-sm py-2.5"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-300">Password</label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="input-dark pl-9 pr-9 w-full text-xs sm:text-sm py-2.5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[11px] text-purple-300 flex items-center justify-between">
                <span>🔐 Protected with 6-Digit OAuth2 OTP</span>
                <button
                  type="button"
                  onClick={handleFillDemoAdmin}
                  className="font-bold text-purple-400 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> Auto-Fill Admin
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials…</span>
                  </>
                ) : (
                  <>
                    <span>Next: Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── Mode 2: SIGNUP ── */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Shah Abdul Mazid"
                    className="input-dark pl-9 w-full text-xs sm:text-sm py-2"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@example.com"
                    className="input-dark pl-9 w-full text-xs sm:text-sm py-2"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Mobile Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1XXXXXXXXX"
                    className="input-dark pl-9 w-full text-xs sm:text-sm py-2"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="input-dark pl-9 pr-9 w-full text-xs sm:text-sm py-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Registering Account…</span>
                  </>
                ) : (
                  <>
                    <span>Create Account &amp; Send OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── Mode 3: 6-DIGIT OTP VERIFICATION ── */}
          {mode === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-600/30">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white pt-2">Enter 6-Digit OTP Code</h3>
                <p className="text-xs text-zinc-400">
                  A verification code has been dispatched to:
                  <span className="block font-mono font-bold text-purple-300 pt-0.5">{email}</span>
                </p>
              </div>

              {/* Dev / Test OTP Helper Card */}
              {devOtp && (
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold">Verification OTP:</span>
                    <span className="font-mono font-extrabold text-base text-purple-300 tracking-wider">{devOtp}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtp(devOtp)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-sm flex items-center gap-1 transition-all"
                  >
                    <span>Auto-Fill</span>
                  </button>
                </div>
              )}

              {/* OTP Input Field */}
              <div className="space-y-1.5">
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono font-bold py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              {/* Resend & Countdown */}
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <button
                  type="button"
                  onClick={() => setMode(purpose === 'signup' ? 'signup' : 'login')}
                  className="hover:text-zinc-200 underline"
                >
                  ← Back to credentials
                </button>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Resend Code
                  </button>
                ) : (
                  <span>Resend in <strong className="text-white font-mono">{countdown}s</strong></span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="btn-primary w-full py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying OTP…</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify &amp; Enter Portal</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
