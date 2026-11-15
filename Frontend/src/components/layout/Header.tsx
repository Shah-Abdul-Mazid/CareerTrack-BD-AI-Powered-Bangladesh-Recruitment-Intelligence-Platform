import React from 'react';
import { Bell, Plus, Search, CheckCircle2, AlertCircle, Menu } from 'lucide-react';

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

        <div className="flex items-center gap-2 pl-2 sm:pl-3" style={{ borderLeft: '1px solid var(--border)' }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}
          >
            BD
          </div>
          <div className="hidden xl:block">
            <div className="text-sm font-semibold text-white leading-tight">Shah Abdul Mazid</div>
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Recruitment Specialist</div>
          </div>
        </div>
      </div>
    </header>
  );
};
