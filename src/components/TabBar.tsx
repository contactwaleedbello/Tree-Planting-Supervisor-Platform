import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center gap-1.5 p-1 border-b border-[#E2E5E6] overflow-x-auto ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              isActive
                ? 'bg-[#2E5421] text-[#FAFCFE] shadow-sm'
                : 'text-[#5E625E] hover:bg-[#EEF0F2] hover:text-[#1C211B]'
            }`}
          >
            {tab.icon && (
              <span className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FAFCFE]' : 'text-[#7B7E7B]'}`}>
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-[#3C7429] text-[#FAFCFE]'
                    : 'bg-[#E2E5E6] text-[#5E625E]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
