import React, { useState } from 'react';
import { StatCard } from '../StatCard';
import { MapBanner } from '../MapBanner';
import { TabBar, TabItem } from '../TabBar';
import { EmptyState } from '../EmptyState';
import { ActivityItem } from '../ActivityItem';
import { ReviewRecordType } from '../../types/states';

export interface DashboardDefaultProps {
  onNavigateToNotifications?: () => void;
  onAssignReportClick?: () => void;
  onAddOfficerClick?: () => void;
  onInitiateCampaignClick?: () => void;
  onAddBlockClick?: () => void;
  onAddTreeSpecieClick?: () => void;
  onReviewItemClick?: (recordType: ReviewRecordType, id?: string) => void;
  onNavigateToCampaigns?: () => void;
  onNavigateToReports?: () => void;
}

const dashboardTabs: TabItem[] = [
  {
    id: 'reports',
    label: 'Reports',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'users',
    label: 'Users',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    id: 'campaigns',
    label: 'Campaigns',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
      </svg>
    ),
  },
  {
    id: 'trees',
    label: 'Trees',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3L6 10h3l-4 7h6v4h2v-4h6l-4-7h3l-6-7z" />
      </svg>
    ),
  },
];

/**
 * DashboardDefault: The bare landing Dashboard screen.
 * Matches design/ui-reference/Dashboard Flow/ (Dashboard (Reports).png, Dashboard (Users).png,
 * Dashboard.png [Campaigns], Dashboard-1.png [Trees], and Dashboard-2.png through Dashboard-5.png).
 */
export const DashboardDefault: React.FC<DashboardDefaultProps> = ({
  onNavigateToNotifications,
  onAssignReportClick,
  onAddOfficerClick,
  onInitiateCampaignClick,
  onAddBlockClick,
  onAddTreeSpecieClick,
  onReviewItemClick,
  onNavigateToCampaigns,
  onNavigateToReports,
}) => {
  const [activeTab, setActiveTab] = useState<string>('reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [isAddTreeMenuOpen, setIsAddTreeMenuOpen] = useState(false);


  return (
    <div className="flex flex-col gap-6">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold text-[#1C211B] tracking-tight">
          Dashboard Overview
        </h2>
      </div>

      {/* Row of 5 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          value="00"
          label="Users"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          chips={[
            { label: '00 Active', variant: 'success' },
            { label: '00 Inactive', variant: 'neutral' },
          ]}
        />

        <StatCard
          value="00"
          label="Trees"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3L6 10h3l-4 7h6v4h2v-4h6l-4-7h3l-6-7z" />
            </svg>
          }
          chips={[
            { label: '00 Verified', variant: 'success' },
            { label: '00 Locations', variant: 'neutral' },
          ]}
        />

        <StatCard
          value="00"
          label="Beneficiaries"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          chips={[
            { label: '00 Verified', variant: 'success' },
            { label: '00 pending', variant: 'warning' },
          ]}
        />

        <StatCard
          value="00"
          label="Reports"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          chips={[
            { label: '00 Completed', variant: 'success' },
            { label: '00 Pending', variant: 'neutral' },
          ]}
        />

        <StatCard
          value="00"
          label="Campaigns"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          }
          chips={[
            { label: '00 Active', variant: 'success' },
            { label: '00 Completed', variant: 'info' },
          ]}
        />
      </div>

      {/* Map Banner Section */}
      <div className="w-full">
        <MapBanner height="h-64 sm:h-72 lg:h-80" />
      </div>

      {/* Tabs Row */}
      <TabBar
        tabs={dashboardTabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id)}
      />

      {/* Lower Grid: EmptyState Center + Notifications Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Center Panel (7 to 8 cols) - switches based on activeTab */}
        <div className="lg:col-span-8 flex flex-col justify-center py-6">
          {activeTab === 'reports' && (
            <EmptyState
              title="Mobilize Your Team"
              message="Put your officers on the map. Assign areas, set daily targets, and deploy tasks directly to the field."
              actionLabel="Assign Report"
              actionVariant="secondary"
              onAction={onAssignReportClick}
              icon={
                <div className="w-20 h-16 relative flex items-center justify-center">
                  <svg className="w-16 h-16 text-[#3C7429]" viewBox="0 0 64 64" fill="none" stroke="currentColor">
                    <rect x="10" y="10" width="44" height="44" rx="4" strokeWidth="2" />
                    <path d="M10 24h44M26 24v30M42 24v30" strokeWidth="1.5" strokeDasharray="2 2" />
                    <circle cx="34" cy="38" r="4" fill="#3C7429" />
                    <path d="M4 32h6M54 32h6" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              }
              className="border-dashed border-2 bg-transparent py-14"
            />
          )}

          {/*
           * Users tab matches design/ui-reference/Dashboard Flow/Dashboard (Users).png directly.
           */}
          {activeTab === 'users' && (
            <EmptyState
              title="Grow Your Field Roster"
              message="Bring new officers, enumerators, and leads on board. Send invites with preset roles and get them mission-ready."
              actionLabel="Add Officers"
              actionVariant="secondary"
              onAction={onAddOfficerClick || onAssignReportClick}
              icon={
                <div className="w-20 h-16 relative flex items-center justify-center">
                  <svg className="w-16 h-16 text-[#3C7429]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
              }
              className="border-dashed border-2 bg-transparent py-14"
            />
          )}

          {/*
           * Campaigns tab matches design/ui-reference/Dashboard Flow/Dashboard.png
           * and Dashboard-4.png directly.
           */}
          {activeTab === 'campaigns' && (
            <EmptyState
              title="Launch a Planting Campaign"
              message="Set your target zones, choose species, and rally field officers to put roots in the ground."
              actionLabel="Initiate a campaign"
              actionVariant="secondary"
              actionIcon={
                <svg className="w-4 h-4 text-[#8C532B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              }
              onAction={onInitiateCampaignClick || onAssignReportClick}
              icon={
                <div className="w-20 h-16 relative flex items-center justify-center">
                  <svg className="w-16 h-16 text-[#3C7429]" viewBox="0 0 64 64" fill="none" stroke="currentColor">
                    <path d="M32 46V20M32 20L25 27M32 20L39 27" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <ellipse cx="32" cy="48" rx="20" ry="6" strokeWidth="1.5" strokeDasharray="3 3" />
                    <ellipse cx="32" cy="48" rx="12" ry="3" strokeWidth="1.5" />
                    <path d="M22 30C18 32 16 36 18 40C20 44 26 44 32 44C38 44 44 44 46 40C48 36 46 32 42 30" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              }
              className="border-dashed border-2 bg-transparent py-14"
            />
          )}

          {/*
           * Trees tab matches design/ui-reference/Dashboard Flow/Dashboard-1.png,
           * Dashboard-5.png, and dropdown Alerts-4.png directly.
           */}
          {activeTab === 'trees' && (
            <EmptyState
              title="Register Farm & Tree Blocks"
              message="Onboard partner farms and allocate their tree quotas into organized, species-based blocks for easy tracking."
              icon={
                <div className="w-20 h-16 relative flex items-center justify-center">
                  <svg className="w-16 h-16 text-[#3C7429]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3L6 10h3l-4 7h6v4h2v-4h6l-4-7h3l-6-7z" />
                  </svg>
                </div>
              }
              customAction={
                <div className="relative inline-block text-left">
                  <button
                    type="button"
                    onClick={() => setIsAddTreeMenuOpen(!isAddTreeMenuOpen)}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold border border-[#C97A3E] text-[#8C532B] hover:bg-[#FDF8F3] transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-[#8C532B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3L6 10h3l-4 7h6v4h2v-4h6l-4-7h3l-6-7z" />
                    </svg>
                    <span>Add</span>
                    <svg className="w-3.5 h-3.5 text-[#8C532B] ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu matching Alerts-4.png */}
                  {isAddTreeMenuOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#FAFCFE] rounded-xl border border-[#14B8A6]/40 shadow-lg z-20 py-1.5 animate-in fade-in duration-100 divide-y divide-[#EEF0F2]">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddTreeMenuOpen(false);
                          if (onAddBlockClick) onAddBlockClick();
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#1C211B] hover:bg-[#EEF0F2] transition-colors cursor-pointer"
                      >
                        Add Block
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddTreeMenuOpen(false);
                          if (onAddTreeSpecieClick) onAddTreeSpecieClick();
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#1C211B] hover:bg-[#EEF0F2] transition-colors cursor-pointer"
                      >
                        Add Tree Specie
                      </button>
                    </div>
                  )}
                </div>
              }
              className="border-dashed border-2 bg-transparent py-14"
            />
          )}
        </div>

        {/* Right Sidebar: Notifications Panel (4 cols) */}
        <div className="lg:col-span-4 bg-[#FAFCFE] rounded-2xl border border-[#E2E5E6] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-[#1C211B]">Notifications</h3>
            {onNavigateToNotifications && (
              <button
                type="button"
                onClick={onNavigateToNotifications}
                className="text-xs font-semibold text-[#936B40] hover:text-[#745029] transition-colors focus:outline-none cursor-pointer"
              >
                See All
              </button>
            )}
          </div>

          {/* Search box with amber outline Filter button matching Dashboard Flow designs */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7B7E7B]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search here"
                className="w-full pl-10 pr-4 py-2 bg-[#FAFCFE] border border-[#CBCDCE] rounded-xl text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:border-[#3C7429] focus:ring-1 focus:ring-[#3C7429] transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsFilterActive(!isFilterActive)}
              className={`p-2 border rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                isFilterActive
                  ? 'border-[#2E5421] bg-[#EAF7EE] text-[#2E5421]'
                  : 'border-[#C97A3E] text-[#8C532B] hover:bg-[#FDF8F3]'
              }`}
              title="Filter notifications"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>

          {/* Activity items and alert cards switched per activeTab matching Dashboard-1 to Dashboard-5 */}
          <div className="flex flex-col gap-3">
            {activeTab === 'campaigns' ? (
              <>
                {/* Campaign alert cards from Dashboard-4.png */}
                <div className="p-3.5 bg-white border border-[#E2E5E6] rounded-xl shadow-xs flex flex-col gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full border border-[#1C211B] flex items-center justify-center shrink-0 mt-0.5 text-[#1C211B] text-xs font-bold">
                      !
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-xs font-bold text-[#1C211B]">Campaign live: Green Canopy 2026</h4>
                      <p className="text-[11px] text-[#555] leading-relaxed">
                        The 10,000-tree reforestation drive is active in Abuja Catchment. Officers can now register farm blocks.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#F0F2F2]">
                    <span className="text-[10px] text-[#7B7E7B]">Campaign launch · Just now</span>
                    <button
                      type="button"
                      onClick={() => onNavigateToCampaigns && onNavigateToCampaigns()}
                      className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#2E5421] hover:bg-[#23421A] rounded-lg transition-colors cursor-pointer"
                    >
                      Open campaign hub
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-white border border-[#E2E5E6] rounded-xl shadow-xs flex flex-col gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full border border-[#1C211B] flex items-center justify-center shrink-0 mt-0.5 text-[#1C211B] text-xs font-bold">
                      !
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-xs font-bold text-[#1C211B]">Milestone unlocked: 50% goal reached!</h4>
                      <p className="text-[11px] text-[#555] leading-relaxed">
                        2,500 of 5,000 trees have been planted, geotagged, and verified in Niger River Basin Campaign.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#F0F2F2]">
                    <span className="text-[10px] text-[#7B7E7B]">Milestone · 2h ago</span>
                    <button
                      type="button"
                      onClick={() => onNavigateToReports && onNavigateToReports()}
                      className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#2E5421] hover:bg-[#23421A] rounded-lg transition-colors cursor-pointer"
                    >
                      View analytics report
                    </button>
                  </div>
                </div>
              </>
            ) : activeTab === 'trees' ? (
              <>
                {/* Farm and Block Audit alerts from Dashboard-5.png */}
                <div className="p-3.5 bg-white border border-[#14B8A6]/40 rounded-xl shadow-xs flex flex-col gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full border border-[#1C211B] flex items-center justify-center shrink-0 mt-0.5 text-[#1C211B] text-xs font-bold">
                      !
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-xs font-bold text-[#1C211B]">Farm registered: Bello Agro Farm</h4>
                      <p className="text-[11px] text-[#555] leading-relaxed">
                        Allocated 200 trees across 3 blocks (100 Mango, 50 Guava, 50 Cashew). Assigned to Kuje Sector.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#F0F2F2]">
                    <span className="text-[10px] text-[#7B7E7B]">Farm reg · Just now</span>
                    <button
                      type="button"
                      onClick={() => onAssignReportClick && onAssignReportClick()}
                      className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#2E5421] hover:bg-[#23421A] rounded-lg transition-colors cursor-pointer"
                    >
                      Assign inspection officer
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-white border border-[#E2E5E6] rounded-xl shadow-xs flex flex-col gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full border border-[#1C211B] flex items-center justify-center shrink-0 mt-0.5 text-[#1C211B] text-xs font-bold">
                      !
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-xs font-bold text-[#1C211B]">Block audit ready: Guava Block A (50 Trees)</h4>
                      <p className="text-[11px] text-[#555] leading-relaxed">
                        Officer Fatima submitted 50 sapling geotags from Sunshine Orchards for your quality approval.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#F0F2F2]">
                    <span className="text-[10px] text-[#7B7E7B]">Inspection queue · 15m ago</span>
                    <button
                      type="button"
                      onClick={() => onReviewItemClick && onReviewItemClick('growth_check', 'gc-001')}
                      className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#2E5421] hover:bg-[#23421A] rounded-lg transition-colors cursor-pointer"
                    >
                      Verify block now
                    </button>
                  </div>
                </div>
              </>
            ) : activeTab === 'users' ? (
              <>
                {/* Officer activity cards from Dashboard (Users).png & Dashboard-3.png */}
                <div className="p-3.5 bg-white border border-[#E2E5E6] rounded-xl shadow-xs flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E5421] text-xs font-bold">
                        ML
                      </div>
                      <span className="text-xs font-bold text-[#1C211B]">Marcus A. Lee</span>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-semibold text-[#2E5421] border border-[#2E5421] rounded-full">
                      Online
                    </span>
                  </div>
                  <div className="text-[11px] text-[#555] flex flex-col gap-0.5">
                    <span className="flex items-center gap-1.5 text-[#555]">
                      <svg className="w-3 h-3 text-[#7B7E7B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      +2349198765432
                    </span>
                    <span className="flex items-center gap-1.5 text-[#555]">
                      <svg className="w-3 h-3 text-[#7B7E7B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Mariri Cluster
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#F0F2F2]">
                    <span className="text-[10px] text-[#7B7E7B]">Today 10:25 PM</span>
                    <button
                      type="button"
                      onClick={() => onReviewItemClick && onReviewItemClick('growth_check', 'gc-001')}
                      className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#2E5421] hover:bg-[#23421A] rounded-lg transition-colors cursor-pointer"
                    >
                      Track Activities
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-white border border-[#E2E5E6] rounded-xl shadow-xs flex flex-col gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full border border-[#1C211B] flex items-center justify-center shrink-0 mt-0.5 text-[#1C211B] text-xs font-bold">
                      !
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-xs font-bold text-[#1C211B]">New officer active: Fatima Garba</h4>
                      <p className="text-[11px] text-[#555] leading-relaxed">
                        Fatima accepted your invitation and successfully downloaded the Field Verification Mobile App.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#F0F2F2]">
                    <span className="text-[10px] text-[#7B7E7B]">Team roster · 12m ago</span>
                    <button
                      type="button"
                      onClick={() => onAssignReportClick && onAssignReportClick()}
                      className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#2E5421] hover:bg-[#23421A] rounded-lg transition-colors cursor-pointer"
                    >
                      Assign first task
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Reports tab: Pending reviews and Operations alert */}
                <ActivityItem
                  title="123-454-YT-1234"
                  categoryTag="Pending"
                  statusBadge="Growth Check"
                  recordType="growth_check"
                  officerName="Marcus A. Lee"
                  phoneNumber="+2349198765432"
                  timestamp="Today 10:25 PM"
                  actionLabel="Review"
                  onAction={() => onReviewItemClick && onReviewItemClick('growth_check', 'gc-001')}
                />

                <ActivityItem
                  title="123-454-YT-1234"
                  categoryTag="Pending"
                  statusBadge="Damaged/Destroyed"
                  recordType="incident"
                  officerName="Marcus A. Lee"
                  phoneNumber="+2349198765432"
                  timestamp="Today 09:14 PM"
                  actionLabel="Review"
                  onAction={() => onReviewItemClick && onReviewItemClick('incident', 'inc-001')}
                />

                {/* Operations card from Dashboard-2.png */}
                <div className="p-3.5 bg-white border border-[#E2E5E6] rounded-xl shadow-xs flex flex-col gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full border border-[#1C211B] flex items-center justify-center shrink-0 mt-0.5 text-[#1C211B] text-xs font-bold">
                      !
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-xs font-bold text-[#1C211B]">Assignment deployed successfully</h4>
                      <p className="text-[11px] text-[#555] leading-relaxed">
                        Auditing task routed to Officer Amina Bello. Target: 100 Neem trees in Bwari Zone.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#F0F2F2]">
                    <span className="text-[10px] text-[#7B7E7B]">Operations · Just now</span>
                    <button
                      type="button"
                      onClick={() => onAssignReportClick && onAssignReportClick()}
                      className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#2E5421] hover:bg-[#23421A] rounded-lg transition-colors cursor-pointer"
                    >
                      Track live progress
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
