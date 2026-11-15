import React from 'react';
import {
  LayoutDashboard, Briefcase, Calendar, FileText,
  Bot, Bell, Building2, Users, ChevronLeft, ChevronRight,
  UserCheck, FileSpreadsheet, FileCheck2, X
} from 'lucide-react';

export type NavItemKey = 
  | 'dashboard' 
  | 'applications' 
  | 'resume' 
  | 'companies' 
  | 'interviews' 
  | 'calendar' 
  | 'app-upload'
  | 'admit-upload'
  | 'seatplan-upload'
  | 'documents' 
  | 'assistant' 
  | 'notifications';

interface SidebarProps {
  currentTab: NavItemKey;
  onTabChange: (tab: NavItemKey) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  pendingAlertsCount?: number;
  submittedCount?: number;
  admitCount?: number;
  pendingSeatPlanCount?: number;
  totalApplicationsCount?: number;
}

const MAIN_MENU = [
  { key: 'dashboard' as NavItemKey,    label: 'Dashboard',     icon: LayoutDashboard },
  { key: 'resume' as NavItemKey,       label: 'Resume / CV',   icon: UserCheck },
  { key: 'applications' as NavItemKey, label: 'Applications',  icon: Briefcase, isAppList: true },
  { key: 'companies' as NavItemKey,    label: 'Companies',     icon: Building2 },
  { key: 'interviews' as NavItemKey,   label: 'Interviews',    icon: Users },
  { key: 'calendar' as NavItemKey,     label: 'Calendar',      icon: Calendar },
];

const TOOLS_MENU = [
  { key: 'app-upload' as NavItemKey,      label: 'Application PDF Upload', icon: FileText,        kind: 'app' },
  { key: 'admit-upload' as NavItemKey,    label: 'Admit Card Upload',      icon: FileCheck2,      kind: 'admit' },
  { key: 'seatplan-upload' as NavItemKey, label: 'Seat Plan & Schedule',   icon: FileSpreadsheet, kind: 'seatplan' },
  { key: 'assistant' as NavItemKey,       label: 'AI Coach & Intel',       icon: Bot,             kind: 'bot' },
  { key: 'notifications' as NavItemKey,   label: 'Notifications',          icon: Bell,            kind: 'bell', hasBadge: true },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
  pendingAlertsCount = 2,
  submittedCount = 0,
  admitCount = 0,
  pendingSeatPlanCount = 0,
  totalApplicationsCount = 0,
}) => {

  const handleItemClick = (key: NavItemKey) => {
    onTabChange(key);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const renderItem = (
    item: {
      key: NavItemKey;
      label: string;
      icon: any;
      hasBadge?: boolean;
      kind?: string;
      isAppList?: boolean;
    },
    isMobileView: boolean = false
  ) => {
    const Icon = item.icon;
    const isActive = currentTab === item.key;
    const isCollapsed = !isMobileView && collapsed;

    // Determine badge for item
    let badgeContent: React.ReactNode = null;
    if (item.hasBadge && pendingAlertsCount > 0) {
      badgeContent = (
        <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
          {pendingAlertsCount}
        </span>
      );
    } else if (item.isAppList && totalApplicationsCount > 0) {
      badgeContent = (
        <span className="px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-300 border border-purple-500/30 text-[10px] font-bold flex-shrink-0">
          {totalApplicationsCount}
        </span>
      );
    } else if (item.kind === 'app' && submittedCount > 0) {
      badgeContent = (
        <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold flex-shrink-0">
          {submittedCount}
        </span>
      );
    } else if (item.kind === 'admit' && admitCount > 0) {
      badgeContent = (
        <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex-shrink-0">
          {admitCount}
        </span>
      );
    } else if (item.kind === 'seatplan') {
      if (pendingSeatPlanCount > 0) {
        badgeContent = (
          <span className="px-1.5 py-0.5 rounded-full bg-amber-500/25 text-amber-300 border border-amber-500/40 text-[10px] font-bold animate-pulse flex-shrink-0" title="Seat Plan notice pending for admit card">
            ⏳ {pendingSeatPlanCount} TBA
          </span>
        );
      } else {
        badgeContent = (
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold flex-shrink-0">
            ✓ Ready
          </span>
        );
      }
    }

    return (
      <button
        key={item.key}
        onClick={() => handleItemClick(item.key)}
        title={isCollapsed ? item.label : undefined}
        className={`w-full flex items-center rounded-xl transition-all duration-150 group select-none
          ${isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5 gap-3'}
          ${isActive
            ? 'text-white font-semibold'
            : 'text-zinc-400 hover:text-white hover:bg-white/5 active:bg-white/10'
          }
        `}
        style={isActive ? {
          background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(124,58,237,0.12) 100%)',
          borderLeft: isCollapsed ? 'none' : '3px solid #8b5cf6',
          boxShadow: '0 0 20px rgba(124,58,237,0.15)',
        } : {
          borderLeft: isCollapsed ? 'none' : '3px solid transparent',
        }}
      >
        <Icon className={`flex-shrink-0 transition-colors
          ${isCollapsed ? 'w-5 h-5' : 'w-4.5 h-4.5'}
          ${isActive ? 'text-purple-400' : 'text-zinc-400 group-hover:text-zinc-200'}
        `} style={{ width: '18px', height: '18px' }} />

        {!isCollapsed && (
          <>
            <span className={`text-xs sm:text-sm font-medium flex-1 text-left truncate ${isActive ? 'text-white' : ''}`}>
              {item.label}
            </span>
            {badgeContent}
          </>
        )}

        {/* Tooltip dot for active in collapsed */}
        {isCollapsed && isActive && (
          <span className="absolute right-0 w-1 h-6 bg-purple-500 rounded-l-full" />
        )}
      </button>
    );
  };

  const navContent = (isMobile: boolean = false) => (
    <>
      {/* ── Brand ── */}
      <div className={`flex items-center h-16 border-b px-4 gap-3 flex-shrink-0`}
        style={{ borderColor: '#1f1f28' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
          <span className="text-white font-extrabold text-sm">K</span>
        </div>
        {(isMobile || !collapsed) && (
          <div className="overflow-hidden flex-1">
            <div className="text-sm font-extrabold text-white tracking-tight whitespace-nowrap">CareerTrack BD</div>
            <div className="text-[10px] font-semibold tracking-wider uppercase text-purple-400">
              Recruitment Intel
            </div>
          </div>
        )}
        {isMobile ? (
          <button
            onClick={onCloseMobile}
            className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          !collapsed && (
            <button onClick={onToggleCollapse} className="ml-auto p-1.5 rounded-lg transition-colors hover:bg-white/5 text-zinc-400 hover:text-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
          )
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className={`flex-1 overflow-y-auto py-4 space-y-1 ${!isMobile && collapsed ? 'px-2' : 'px-3'}`}>
        {(isMobile || !collapsed) && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 pb-2">Main Menu</p>
        )}
        {MAIN_MENU.map((i) => renderItem(i, isMobile))}

        {/* Tools Section */}
        <div className={`${!isMobile && collapsed ? 'my-3' : 'mt-6 mb-2'}`}>
          {(isMobile || !collapsed) && <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 pb-2">Intelligence &amp; Uploads</p>}
          {!isMobile && collapsed && <div className="border-t mx-2 my-3 border-zinc-800" />}
        </div>
        {TOOLS_MENU.map((i) => renderItem(i, isMobile))}
      </nav>

      {/* ── Footer ── */}
      <div className={`flex-shrink-0 border-t ${!isMobile && collapsed ? 'px-2 py-3 space-y-1' : 'px-3 py-3 space-y-1 pb-[max(1rem,env(safe-area-inset-bottom))]'}`}
        style={{ borderColor: '#1f1f28' }}>
        {!isMobile && collapsed ? (
          <button onClick={onToggleCollapse}
            className="w-full flex justify-center p-3 rounded-xl transition-colors hover:bg-white/5 text-zinc-400 hover:text-white">
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="px-3 py-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <span className="text-xs font-bold text-purple-300">Asia/Dhaka (BST)</span>
            </div>
            <p className="text-[10px] mt-1 text-zinc-400 leading-tight">
              BB · BSCS · BPSC · Teletalk
            </p>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop Permanent Sidebar (lg:flex) ── */}
      <aside
        className="hidden lg:flex fixed inset-y-0 left-0 z-30 flex-col transition-all duration-300 select-none"
        style={{
          width: collapsed ? '72px' : '240px',
          background: '#0d0d12',
          borderRight: '1px solid #1f1f28',
        }}
      >
        {navContent(false)}
      </aside>

      {/* ── Mobile Off-Canvas Drawer (< lg) ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
            onClick={onCloseMobile}
          />
          {/* Drawer sheet */}
          <aside
            className="fixed inset-y-0 left-0 w-[280px] max-w-[85vw] flex flex-col z-50 bg-[#0d0d12] border-r border-[#1f1f28] shadow-2xl transition-transform duration-300 ease-out"
          >
            {navContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
