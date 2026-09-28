import React, { useState } from 'react';
import { NotificationsDropdown } from './NotificationsDropdown';
import { LogoutModal } from './LogoutModal';

export type NavItemKey =
  | 'dashboard'
  | 'users'
  | 'beneficiaries'
  | 'campaigns'
  | 'reports'
  | 'blocks'
  | 'trees'
  | 'notifications'
  | 'settings';

interface AppShellProps {
  currentNav: NavItemKey;
  onNavigate: (nav: NavItemKey) => void;
  pageTitle?: string;
  userInitials?: string;
  onLogoutConfirm: () => void;
  children: React.ReactNode;
}

/**
 * AppShell: Persistent navigation rail, top user header, notifications dropdown,
 * and logout confirmation dialog.
 * Unifies layout seen across all shell reference frames.
 */
export const AppShell: React.FC<AppShellProps> = ({
  currentNav,
  onNavigate,
  pageTitle = 'Dashboard Overview',
  userInitials = 'AB',
  onLogoutConfirm,
  children,
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navItems = [
    {
      key: 'dashboard' as NavItemKey,
      label: 'Dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      key: 'users' as NavItemKey,
      label: 'Users',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      key: 'beneficiaries' as NavItemKey,
      label: 'Beneficiaries',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      key: 'campaigns' as NavItemKey,
      label: 'Campaigns',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      ),
    },
    {
      key: 'reports' as NavItemKey,
      label: 'Report Management',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      key: 'blocks' as NavItemKey,
      label: 'Block Management',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      key: 'trees' as NavItemKey,
      label: 'Tree Management',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3L6 10h3l-4 7h6v4h2v-4h6l-4-7h3l-6-7z" />
        </svg>
      ),
    },
    {
      key: 'notifications' as NavItemKey,
      label: 'Notifications',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8F4] flex">
      {/* 1. Left Sidebar (Persistent Navigation Rail) */}
      <aside className="w-64 bg-[#FAFCFE] border-r border-[#E2E5E6] flex flex-col justify-between shrink-0 min-h-screen sticky top-0 h-screen p-5">
        <div>
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-2 mb-8 px-2">
            <svg className="w-8 h-8 text-[#2E5421]" viewBox="0 0 40 40" fill="currentColor">
              <path d="M20 2C10.059 2 2 10.059 2 20c0 7.95 5.21 14.68 12.39 16.94.88.16 1.21-.38 1.21-.85 0-.42-.02-1.81-.02-3.28-4.9.91-6.04-1.19-6.43-2.3-.22-.57-1.17-2.3-2-2.76-.69-.37-1.67-1.28-.03-1.3 1.55-.02 2.66 1.43 3.03 2.03 1.77 3.01 4.65 2.16 5.79 1.64.18-1.28.69-2.16 1.26-2.66-4.08-.46-8.36-2.04-8.36-9.08 0-2 .72-3.65 1.89-4.93-.19-.46-.82-2.34.18-4.88 0 0 1.54-.49 5.05 1.88 1.47-.41 3.04-.62 4.6-.62 1.56 0 3.13.21 4.6.62 3.51-2.38 5.04-1.88 5.04-1.88 1.01 2.54.38 4.42.19 4.88 1.18 1.28 1.89 2.92 1.89 4.93 0 7.06-4.3 8.61-8.39 9.06.71.61 1.34 1.81 1.34 3.66 0 2.64-.02 4.77-.02 5.43 0 .48.32 1.03 1.22.85C32.79 34.68 38 27.94 38 20c0-9.941-8.059-18-18-18z" />
            </svg>
            <div className="flex flex-col text-left leading-none">
              <span className="text-base font-bold tracking-tight text-[#936B40]">Green</span>
              <span className="text-base font-bold tracking-tight text-[#936B40]">Legacy</span>
            </div>
          </div>

          {/* Primary Nav List */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = currentNav === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onNavigate(item.key)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#2E5421] text-[#FAFCFE] shadow-sm'
                      : 'text-[#424641] hover:bg-[#EEF0F2] hover:text-[#1C211B]'
                  }`}
                >
                  <span className={isActive ? 'text-[#FAFCFE]' : 'text-[#7B7E7B]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Nav Items: Settings & Logout */}
        <div className="flex flex-col gap-1 pt-4 border-t border-[#EEF0F2]">
          {/* Settings */}
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentNav === 'settings'
                ? 'bg-[#2E5421] text-[#FAFCFE] shadow-sm'
                : 'text-[#424641] hover:bg-[#EEF0F2] hover:text-[#1C211B]'
            }`}
          >
            <span className={currentNav === 'settings' ? 'text-[#FAFCFE]' : 'text-[#7B7E7B]'}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            <span>Settings</span>
          </button>

          {/* Logout button styled with red tint matching reference frames */}
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#FEEEED] text-[#C54A40] hover:bg-[#FCDDDB] transition-colors focus:outline-none"
          >
            <svg className="w-4 h-4 text-[#C54A40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-[#FAFCFE] border-b border-[#E2E5E6] px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-[#1C211B]">{pageTitle}</h1>
          </div>

          {/* Right Header: Notification Bell & User Initials */}
          <div className="flex items-center gap-4 relative">
            {/* Bell button with dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="w-9 h-9 rounded-xl border border-[#EEF0F2] bg-[#FAFCFE] hover:bg-[#EEF0F2] text-[#424641] flex items-center justify-center transition-colors focus:outline-none relative"
                aria-label="Toggle notifications"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* Dot */}
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#3C7429]" />
              </button>

              <NotificationsDropdown
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                onViewAll={() => {
                  onNavigate('notifications');
                  setIsNotificationsOpen(false);
                }}
              />
            </div>

            {/* User Avatar Circle */}
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className="w-9 h-9 rounded-full bg-[#EEF0F2] border border-[#CBCDCE] flex items-center justify-center text-xs font-bold text-[#1C211B] hover:bg-[#E2E5E6] transition-colors focus:outline-none"
              aria-label="User profile"
            >
              {userInitials}
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirmLogout={() => {
          setIsLogoutModalOpen(false);
          onLogoutConfirm();
        }}
      />
    </div>
  );
};
