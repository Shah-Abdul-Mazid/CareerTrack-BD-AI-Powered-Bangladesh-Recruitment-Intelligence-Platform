import React, { useState, useEffect } from 'react';
import { 
  Mail, Lock, User, Phone, ShieldCheck, KeyRound, 
  ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Eye, EyeOff,
  Building2, Calendar, FileText, CheckCircle, ChevronRight, Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validatePassword } from '../utils/passwordPolicy';
import { PasswordPolicyChecklist } from '../components/auth/PasswordPolicyChecklist';

interface AuthPageProps {
  onContinueAsGuest?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onContinueAsGuest }) => {
  const { login, signup, verifyOtp, resendOtp, forgotPassword, resetPassword, continueAsGuest } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'otp' | 'forgot' | 'reset'>('login');
  const [purpose, setPurpose] = useState<'login' | 'signup' | 'password_reset'>('login');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Resend countdown
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Real-time password policy validation reports
  const signupPasswordReport = validatePassword(password, { fullName, email, phone });
  const resetPasswordReport = validatePassword(newPassword, { email });

  useEffect(() => {
    let timer: any;
    if ((mode === 'otp' || mode === 'reset') && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email.trim().toLowerCase(), password);
      if (res.status === 'otp_required' || res.status === 'otp_sent') {
        setPurpose('login');
        setMode('otp');
        setCountdown(60);
        setCanResend(false);
        setSuccessMessage('A 6-digit verification code has been dispatched.');
      } else if (res.access_token) {
        // Logged in directly if OTP was bypassed
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
    setSuccessMessage(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in your name, email, and password.');
      return;
    }
    if (!signupPasswordReport.isValid) {
      setError(signupPasswordReport.errors[0] || 'Password does not meet all security requirements.');
      return;
    }

    setLoading(true);
    try {
      const res = await signup({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim() || undefined,
      });

      setPurpose('signup');
      setMode('otp');
      setCountdown(60);
      setCanResend(false);
      setSuccessMessage('Account created! Please enter the 6-digit OTP code to verify.');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try another email.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError('Please enter the full 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(email.trim().toLowerCase(), cleanOtp, purpose === 'signup' ? 'signup' : 'login');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

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
      setSuccessMessage(res.message || 'A 6-digit password reset code has been dispatched.');
    } catch (err: any) {
      setError(err.message || 'Could not process password reset. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    if (!newPassword || !resetPasswordReport.isValid) {
      setError(resetPasswordReport.errors[0] || 'New password does not meet all security requirements.');
      return;
    }
    if (newPassword !== retypePassword) {
      setError('Passwords do not match. Please retype your new password.');
      return;
    }

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
      setMode('login');
    } catch (err: any) {
      setError(err.message || 'Password reset failed. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setError(null);
    setLoading(true);
    try {
      const res = await resendOtp(email.trim().toLowerCase(), purpose);
      setCountdown(60);
      setCanResend(false);
      setSuccessMessage('Fresh 6-digit OTP dispatched successfully.');
    } catch (err: any) {
      setError(err.message || 'Could not resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestExplore = () => {
    if (onContinueAsGuest) {
      onContinueAsGuest();
    } else {
      continueAsGuest();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, #090714 0%, #120e24 50%, #0d0a1a 100%)' }}>
      {/* Top Navbar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-base text-white shadow-lg shadow-purple-600/30"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
          >
            CT
          </div>
          <div>
            <div className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              CareerTrack BD
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase tracking-widest hidden sm:inline-block">
                Recruitment Intel
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Bangladesh Bank &amp; Government Portal Tracker</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGuestExplore}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 transition-all flex items-center gap-1.5"
        >
          <Compass className="w-3.5 h-3.5 text-purple-400" />
          <span>Explore as Guest</span>
        </button>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
        
        {/* Left Hero Column */}
        <div className="flex-1 space-y-6 text-left max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI-Driven Recruitment Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Your career pursuit, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-400">streamlined &amp; verified.</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Monitor bank recruitment circulars, manage multiple tracking IDs, auto-extract admit cards, and look up confirmed examination seat plans in real-time.
          </p>

          {/* Key Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="w-7 h-7 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400">
                <Building2 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Central Bank &amp; Govt Posts</h4>
              <p className="text-[11px] text-zinc-400">Combined 9 Banks, Senior Officer &amp; IT Engineer positions synced.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="w-7 h-7 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400">
                <Calendar className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Live Exam Seat Plans</h4>
              <p className="text-[11px] text-zinc-400">Automatic roll-range center lookup and reporting countdowns.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">AI Document Parser</h4>
              <p className="text-[11px] text-zinc-400">Instantly extracts tracking IDs, job numbers, and candidate bio from PDFs.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="w-7 h-7 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">6-Digit OTP OAuth2 Security</h4>
              <p className="text-[11px] text-zinc-400">Two-factor email/phone verification for both candidates and administrators.</p>
            </div>
          </div>
        </div>

        {/* Right Auth Card */}
        <div className="w-full max-w-md">
          <div className="relative rounded-3xl bg-[#141126]/90 border border-purple-500/20 shadow-2xl shadow-purple-950/40 p-6 sm:p-8 backdrop-blur-xl">
            
            {/* Header Switcher (When in login or signup) */}
            {(mode === 'login' || mode === 'signup') && (
              <div className="space-y-5">
                <div className="flex p-1 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setError(null); setSuccessMessage(null); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      mode === 'login'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setError(null); setSuccessMessage(null); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      mode === 'signup'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Register Normal User
                  </button>
                </div>

                <div className="text-left">
                  <h3 className="text-xl font-extrabold text-white">
                    {mode === 'login' ? 'Welcome back, Candidate' : 'Create Candidate Account'}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    {mode === 'login'
                      ? 'Enter your credentials to receive your 6-digit OTP.'
                      : 'Join CareerTrack BD to manage your applications and exam notices.'}
                  </p>
                </div>
              </div>
            )}

            {/* Header for OTP Mode */}
            {mode === 'otp' && (
              <div className="text-left space-y-2 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Two-Factor Authentication</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">Verify 6-Digit Code</h3>
                <p className="text-xs text-zinc-400">
                  We dispatched an OTP verification code to <span className="font-semibold text-zinc-200">{email}</span>.
                </p>
              </div>
            )}

            {/* Header for Forgot Password Mode */}
            {mode === 'forgot' && (
              <div className="text-left space-y-2 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Password Recovery</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">Forgot Password</h3>
                <p className="text-xs text-zinc-400">
                  Enter your registered email address and we will dispatch a 6-digit code to reset your password.
                </p>
              </div>
            )}

            {/* Header for Reset Password Mode */}
            {mode === 'reset' && (
              <div className="text-left space-y-2 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Password Reset Verification</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">Set New Password</h3>
                <p className="text-xs text-zinc-400">
                  Enter the 6-digit OTP code sent to <span className="font-semibold text-zinc-200">{email}</span> and your new password.
                </p>
              </div>
            )}

            {/* Status alerts */}
            {error && (
              <div className="mt-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="mt-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form: Sign In */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. candidate@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-300">Password</label>
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(null); setSuccessMessage(null); }}
                      className="text-xs text-purple-400 hover:text-purple-300 font-semibold hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Sign In &amp; Request OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Form: Sign Up (Normal User) */}
            {mode === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="mt-5 space-y-3.5 text-left">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Shah Abdul Mazid"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. candidate@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+880 1531329222"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="8–30 characters (e.g. Nova#Jade7Star)"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Real-time Interactive Password Checklist & Passphrase Generator */}
                  <PasswordPolicyChecklist
                    report={signupPasswordReport}
                    passwordValue={password}
                    onGeneratePassphrase={(newPwd) => setPassword(newPwd)}
                    userContext={{ fullName, email, phone }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !signupPasswordReport.isValid || !fullName.trim() || !email.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Register &amp; Dispatch OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Form: Forgot Password */}
            {mode === 'forgot' && (
              <form onSubmit={handleForgotPasswordSubmit} className="mt-5 space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Registered Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. candidate@example.com"
                      required
                      autoFocus
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send Password Reset Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center">
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

            {/* Form: Reset Password (OTP + New Password + Retype Password) */}
            {mode === 'reset' && (
              <form onSubmit={handleResetPasswordSubmit} className="mt-5 space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Enter 6-Digit Reset Code</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••••"
                      autoFocus
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-purple-500/50 text-white text-center text-lg font-mono font-bold tracking-widest placeholder:text-zinc-600 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="8–30 characters (e.g. Nova#Jade7Star)"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Real-time Interactive Password Checklist for Reset Mode */}
                  <PasswordPolicyChecklist
                    report={resetPasswordReport}
                    passwordValue={newPassword}
                    onGeneratePassphrase={(newPwd) => {
                      setNewPassword(newPwd);
                      setRetypePassword(newPwd);
                    }}
                    userContext={{ email }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Retype New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type={showRetypePassword ? 'text' : 'password'}
                      value={retypePassword}
                      onChange={e => setRetypePassword(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-900/90 border text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:ring-1 ${
                        retypePassword && retypePassword !== newPassword
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                          : 'border-zinc-700/80 focus:border-purple-500 focus:ring-purple-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRetypePassword(!showRetypePassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showRetypePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {retypePassword && retypePassword !== newPassword && (
                    <p className="text-[11px] text-rose-400">Passwords do not match.</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6 || !resetPasswordReport.isValid || !newPassword || newPassword !== retypePassword}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Reset Password &amp; Sign In</span>
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setError(null); setSuccessMessage(null); }}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    ← Back to Sign In
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={!canResend || loading}
                    className="text-purple-400 hover:text-purple-300 font-medium disabled:opacity-50 transition-colors"
                  >
                    {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
                  </button>
                </div>
              </form>
            )}

            {/* Form: OTP Verification */}
            {mode === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="mt-5 space-y-5 text-left">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300">Enter 6-Digit OTP Code</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••••"
                      autoFocus
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/90 border border-purple-500/50 text-white text-center text-lg font-mono font-bold tracking-widest placeholder:text-zinc-600 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Verify &amp; Enter Dashboard</span>
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Resend OTP */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setMode(purpose === 'signup' ? 'signup' : 'login')}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    ← Back to {purpose === 'signup' ? 'Sign Up' : 'Sign In'}
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={!canResend || loading}
                    className="text-purple-400 hover:text-purple-300 font-medium disabled:opacity-50 transition-colors"
                  >
                    {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
                  </button>
                </div>
              </form>
            )}

            {/* Bottom option to explore as guest */}
            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
              <button
                type="button"
                onClick={handleGuestExplore}
                className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors flex items-center justify-center gap-1.5 mx-auto font-medium"
              >
                <span>Don't want to log in right now?</span>
                <span className="text-purple-400 font-bold underline">Explore as Guest</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="py-4 border-t border-white/5 text-center text-xs text-zinc-500">
        <p>CareerTrack BD © 2026 • Bangladesh Recruitment Intelligence &amp; Schedule Platform</p>
      </footer>
    </div>
  );
};
export default AuthPage;