import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  FileCheck2,
  FileSpreadsheet,
  Menu
} from 'lucide-react';
import { NavItemKey } from './Sidebar';

interface MobileBottomNavProps {
  currentTab: NavItemKey;
  onTabChange: (tab: NavItemKey) => void;
  onOpenMenu: () => void;
  totalApplicationsCount?: number;
  submittedCount?: number;
  admitCount?: number;
  pendingSeatPlanCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onTabChange,
  onOpenMenu,
  totalApplicationsCount = 0,
  submittedCount = 0,
  admitCount = 0,
  pendingSeatPlanCount = 0,
}) => {
  const items = [
    {
      key: 'dashboard' as NavItemKey,
      label: 'Home',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      key: 'applications' as NavItemKey,
      label: 'Board',
      icon: Briefcase,
      badge: totalApplicationsCount > 0 ? totalApplicationsCount : null,
      badgeColor: 'bg-purple-600',
    },
    {
      key: 'app-upload' as NavItemKey,
      label: 'Submit',
      icon: FileText,
      badge: submittedCount > 0 ? submittedCount : null,
      badgeColor: 'bg-blue-600',
    },
    {
      key: 'admit-upload' as NavItemKey,
      label: 'Admit',
      icon: FileCheck2,
      badge: admitCount > 0 ? admitCount : null,
      badgeColor: 'bg-emerald-600',
    },
    {
      key: 'seatplan-upload' as NavItemKey,
      label: 'Seat Plan',
      icon: FileSpreadsheet,
      badge: pendingSeatPlanCount > 0 ? 'TBA' : null,
      badgeColor: 'bg-amber-600 animate-pulse',
    },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 select-none transition-all"
      style={{
        background: 'rgba(13, 13, 18, 0.94)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid #1f1f28',
        paddingBottom: 'max(0.35rem, env(safe-area-inset-bottom, 0px))',
      }}
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-6 h-14 items-center px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`flex flex-col items-center justify-center py-1 relative rounded-xl transition-all duration-150 ${
                isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200 active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'text-purple-400 scale-110' : 'text-zinc-400'
                  }`}
                />
                {item.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-extrabold text-white flex items-center justify-center shadow ${
                      item.badgeColor || 'bg-purple-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium truncate max-w-[52px] ${
                  isActive ? 'text-purple-300 font-bold' : 'text-zinc-400'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-0.5" />
              )}
            </button>
          );
        })}

        {/* 6th item: More Menu Drawer Trigger */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1 relative rounded-xl text-zinc-400 hover:text-white active:scale-95 transition-all"
          title="Open Menu"
        >
          <Menu className="w-5 h-5 text-zinc-400" />
          <span className="text-[10px] mt-1 font-medium text-zinc-400">Menu</span>
        </button>
      </div>
    </nav>
  );
};
