import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, Plus, Search, CheckCircle2, AlertCircle, Menu, 
  User, LogIn, LogOut, ShieldCheck, ChevronDown, UserPlus, KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  pageTitle: string;
  onNewApplication: () => void;
  onOpenNotifications: () => void;
  onToggleMobileMenu?: () => void;
  pendingNotificationsCount?: number;
  isBackendConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  pageTitle,
  onNewApplication,
  onOpenNotifications,
  onToggleMobileMenu,
  pendingNotificationsCount = 2,
  isBackendConnected = true,
}) => {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return 'BD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between h-16 px-3.5 sm:px-6 flex-shrink-0"
      style={{
        background: 'rgba(13,12,29,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        paddingTop: 'max(0.25rem, env(safe-area-inset-top, 0px))',
      }}
    >
      {/* Left: Mobile Menu Toggle + Title */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors flex-shrink-0"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-white truncate max-w-[200px] sm:max-w-none">
            {pageTitle}
          </h1>
        </div>

        {/* API connection indicator badge */}
        <div
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
          style={{
            background: isBackendConnected
              ? 'rgba(16,185,129,0.12)'
              : 'rgba(239,68,68,0.12)',
            border: `1px solid ${isBackendConnected ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
            color: isBackendConnected ? '#34d399' : '#f87171',
          }}
        >
          {isBackendConnected ? (
            <><CheckCircle2 className="w-3.5 h-3.5" /><span>API Connected</span></>
          ) : (
            <><AlertCircle className="w-3.5 h-3.5" /><span>Backend Offline</span></>
          )}
        </div>
      </div>

      {/* Center: Search (Desktop only) */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-6">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search bank, post, job ID..."
            className="input-dark pl-9 py-2 text-sm w-full"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <button
          onClick={onNewApplication}
          className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-2"
          title="Add New Application"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Application</span>
        </button>

        <button
          onClick={onOpenNotifications}
          className="relative p-2 sm:p-2.5 rounded-xl transition-colors hover:bg-white/5 active:scale-95"
          style={{ color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" style={{ width: '18px', height: '18px' }} />
          {pendingNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          )}
        </button>

        {/* ── User Authentication Dropdown & Controls ── */}
        <div className="relative pl-2 sm:pl-3" style={{ borderLeft: '1px solid var(--border)' }} ref={dropdownRef}>
          {isAuthenticated && user ? (
            <div>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-all text-left"
                title="Account Menu"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-sm flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}
                >
                  {getInitials(user.full_name)}
                </div>
                <div className="hidden xl:block">
                  <div className="text-xs sm:text-sm font-semibold text-white leading-tight truncate max-w-[140px]">
                    {user.full_name}
                  </div>
                  <div className="text-[10px] text-zinc-400 capitalize flex items-center gap-1">
                    <span>{user.role === 'admin' ? 'Recruitment Admin' : 'Candidate'}</span>
                    <ChevronDown className="w-2.5 h-2.5 text-zinc-500" />
                  </div>
                </div>
              </button>

              {/* User Menu Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#141224] border border-zinc-800 shadow-2xl p-3 z-50 space-y-2 text-xs animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-1">
                    <p className="font-bold text-white text-xs">{user.full_name}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                    {user.phone && <p className="text-[10px] font-mono text-zinc-400">{user.phone}</p>}
                    <div className="pt-1 flex items-center gap-1.5">
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                        {user.role}
                      </span>
                      {user.is_verified && (
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-0.5">
                          ✓ OTP Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-1 space-y-1">
                    <button
                      type="button"
                      onClick={() => { setIsDropdownOpen(false); openAuthModal('login'); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white flex items-center gap-2 transition-colors font-medium"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                      <span>Switch / Sign In Account</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setIsDropdownOpen(false); openAuthModal('signup'); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white flex items-center gap-2 transition-colors font-medium"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Create Normal User Account</span>
                    </button>

                    <div className="border-t border-zinc-800 my-1" />

                    <button
                      type="button"
                      onClick={() => { setIsDropdownOpen(false); logout(); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-300 flex items-center gap-2 transition-colors font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-200 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-purple-400" />
                <span>Login</span>
              </button>

              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-sm transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
