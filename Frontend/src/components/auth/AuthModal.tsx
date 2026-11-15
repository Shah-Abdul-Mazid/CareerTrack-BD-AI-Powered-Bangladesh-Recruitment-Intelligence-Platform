import React, { useState, useEffect } from 'react';
import { 
  X, Mail, Lock, User, Phone, ShieldCheck, KeyRound, 
  ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Eye, EyeOff, CheckCircle 
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
    resendOtp,
    forgotPassword,
    resetPassword
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'otp' | 'forgot' | 'reset'>('login');
  const [purpose, setPurpose] = useState<'login' | 'signup' | 'password_reset'>('login');
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
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
      setNewPassword('');
      setRetypePassword('');
    }
  }, [isAuthModalOpen, authModalMode]);

  useEffect(() => {
    let timer: any;
    if ((mode === 'otp' || mode === 'reset') && countdown > 0) {
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
      const res = await login(email.trim().toLowerCase(), password);
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
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim() || undefined,
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
    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError('Please enter the full 6-digit OTP code.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await verifyOtp(email.trim().toLowerCase(), cleanOtp, purpose === 'signup' ? 'signup' : 'login');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await forgotPassword(email.trim().toLowerCase());
      setPurpose('password_reset');
      setMode('reset');
      setCountdown(60);
      setCanResend(false);
      setOtp('');
      setNewPassword('');
      setRetypePassword('');
      setSuccessMessage(res.message || `Password reset code sent to ${email}.`);
      if (res.dev_otp) {
        setDevOtp(res.dev_otp);
      }
    } catch (err: any) {
      setError(err.message || 'Could not send reset code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== retypePassword) {
      setError('Passwords do not match. Please retype carefully.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await resetPassword({
        email: email.trim().toLowerCase(),
        otp: cleanOtp,
        new_password: newPassword,
      });
      setSuccessMessage(res.message || 'Password reset successfully! Please sign in with your new password.');
      setPassword('');
      setNewPassword('');
      setRetypePassword('');
      setOtp('');
      setDevOtp(null);
      setMode('login');
    } catch (err: any) {
      setError(err.message || 'Password reset failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setError(null);
    setLoading(true);
    try {
      const res = await resendOtp(email.trim().toLowerCase(), purpose);
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

          {/* Mode Switcher Tabs (Only if in login or signup) */}
          {(mode === 'login' || mode === 'signup') && (
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
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); setSuccessMessage(null); }}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold hover:underline"
                  >
                    Forgot password?
                  </button>
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

          {/* ── Mode: FORGOT PASSWORD ── */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-600/30">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white pt-2">Password Recovery</h3>
                <p className="text-xs text-zinc-400">
                  Enter your registered email to receive a 6-digit reset code.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. candidate@example.com"
                    className="input-dark pl-9 w-full text-xs sm:text-sm py-2.5"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="btn-primary w-full py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending Reset Code…</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); setSuccessMessage(null); }}
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* ── Mode: RESET PASSWORD (OTP + New Password + Retype) ── */}
          {mode === 'reset' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-600/30">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white pt-2">Set New Password</h3>
                <p className="text-xs text-zinc-400">
                  Code sent to <span className="font-mono text-purple-300 font-bold">{email}</span>
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
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">6-Digit Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[0.5em] text-xl font-mono font-bold py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="input-dark pl-9 pr-9 w-full text-xs sm:text-sm py-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Retype Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Retype New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type={showRetypePassword ? 'text' : 'password'}
                    required
                    value={retypePassword}
                    onChange={(e) => setRetypePassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className={`input-dark pl-9 pr-9 w-full text-xs sm:text-sm py-2 ${
                      retypePassword && retypePassword !== newPassword ? 'border-rose-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRetypePassword(!showRetypePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                  >
                    {showRetypePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {retypePassword && retypePassword !== newPassword && (
                  <p className="text-[11px] text-rose-400">Passwords do not match.</p>
                )}
              </div>

              {/* Resend & Back */}
              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); setSuccessMessage(null); }}
                  className="hover:text-zinc-200 underline"
                >
                  ← Back to Sign In
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
                disabled={loading || otp.length !== 6 || !newPassword || newPassword !== retypePassword}
                className="btn-primary w-full py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Resetting Password…</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Reset Password &amp; Sign In</span>
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
                disabled={loading || otp.length !== 6}
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
export default AuthModal;