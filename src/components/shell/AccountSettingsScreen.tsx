import React, { useState } from 'react';
import { TabBar, TabItem } from '../TabBar';
import { AccountProfileGeneral } from './AccountProfileGeneral';
import { AccountProfileSessions } from './AccountProfileSessions';
import { AccountProfileSupport } from './AccountProfileSupport';

const tabs: TabItem[] = [
  {
    id: 'general',
    label: 'General',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    id: 'sessions',
    label: 'Sessions',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'support',
    label: 'Support',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

/**
 * AccountSettingsScreen: Wrapper unifying the three Account Settings tabs.
 */
export const AccountSettingsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('general');

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-[#1C211B] tracking-tight">Settings</h2>
      </div>

      {/* Tabs */}
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId)}
        className="border-b border-[#EEF0F2]"
      />

      {/* Tab Panels */}
      <div className="pt-2">
        {activeTab === 'general' && <AccountProfileGeneral />}
        {activeTab === 'sessions' && <AccountProfileSessions />}
        {activeTab === 'support' && <AccountProfileSupport />}
      </div>
    </div>
  );
};
