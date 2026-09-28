/**
 * CampaignOverview.tsx
 *
 * Implements the Campaign Management Overview screen per:
 * - design/ui-reference/campaign-management/Campaign  Overview.png
 * - AGENTS.md section 4 & 9
 * - api-network-rules.md (loading, success, failure with retry, PRD empty state)
 * - react-architecture-rules.md (reuses shared src/components/)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { StatCard, StatChip } from '../../../components/StatCard';
import { SearchFilterBar } from '../../../components/SearchFilterBar';
import { StatusBadge } from '../../../components/StatusBadge';
import { TableActionMenu } from '../../../components/TableActionMenu';
import { EmptyState } from '../../../components/EmptyState';
import { MapBanner } from '../../../components/MapBanner';
import { AddCampaignModal } from './AddCampaignModal';
import {
  CampaignStats,
  OperationalCampaignItem,
} from '../types/campaign';
import { fetchOperationalCampaigns } from '../services/campaignPlaceholder';

export const CampaignOverview: React.FC = () => {
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [campaigns, setCampaigns] = useState<OperationalCampaignItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterActive, setIsFilterActive] = useState(false);

  // Add Campaign Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadData = async (shouldFail: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchOperationalCampaigns(shouldFail);
      setStats(result.stats);
      setCampaigns(result.campaigns);
    } catch (err: any) {
      setError(err.message || 'Failed to load operational campaigns. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCampaignCreated = (newCampaign: OperationalCampaignItem) => {
    setCampaigns((prev) => [newCampaign, ...prev]);
    if (stats) {
      setStats({
        ...stats,
        activeCampaignsCount: stats.activeCampaignsCount + 1,
      });
    }
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.area.toLowerCase().includes(searchQuery.toLowerCase());
      if (isFilterActive) {
        return matchesSearch && c.status === 'In Progress';
      }
      return matchesSearch;
    });
  }, [campaigns, searchQuery, isFilterActive]);

  // Loading state (api-network-rules.md Rule 3)
  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-7 w-64 bg-[#E2E5E6] rounded-md" />
          <div className="flex gap-3">
            <div className="h-9 w-24 bg-[#E2E5E6] rounded-lg" />
            <div className="h-9 w-40 bg-[#E2E5E6] rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-[#E2E5E6] rounded-xl" />
          <div className="h-32 bg-[#E2E5E6] rounded-xl" />
          <div className="h-32 bg-[#E2E5E6] rounded-xl" />
        </div>
        <div className="h-64 bg-[#E2E5E6] rounded-2xl" />
        <div className="h-72 bg-[#E2E5E6] rounded-xl" />
      </div>
    );
  }

  // Error state with retry action (api-network-rules.md Rule 3 & Rule 4)
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 max-w-xl mx-auto my-12 text-center bg-[#FAFCFE] rounded-2xl border border-[#FAC4C0]">
        <div className="w-12 h-12 rounded-full bg-[#FEEEED] text-[#C54A40] flex items-center justify-center mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-[#1C211B] mb-2">Network Error</h3>
        <p className="text-xs text-[#5E625E] mb-6">{error}</p>
        <button
          type="button"
          onClick={() => loadData()}
          className="px-5 py-2.5 bg-[#2E5421] text-white text-xs font-bold rounded-lg hover:bg-[#234019] transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-[#1C211B] tracking-tight">
          Campaign Management Overview
        </h1>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled
            title="Export action blocked pending column list and wording confirmation"
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#C97A3E] text-[#8C532B] hover:bg-[#FDF8F3] rounded-lg text-xs font-semibold transition-colors opacity-80 cursor-not-allowed"
          >
            <span>Export</span>
            <svg className="w-4 h-4 text-[#8C532B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2E5421] text-white hover:bg-[#234019] rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            <span>Initiate a campaign</span>
          </button>
        </div>
      </div>

      {/* Three Stat Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Active Campaigns */}
          <StatCard
            value={stats.activeCampaignsCount.toString().padStart(2, '0')}
            label="Active Campaigns"
            icon={
              <svg className="w-4 h-4 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            chips={[
              {
                label: `${stats.monitoringCadenceAdherencePercent.toString().padStart(2, '0')}% Monitoring Cadence Adherence`,
                variant: 'neutral',
              },
              {
                label: `${stats.officersActiveInFieldCount.toString().padStart(2, '0')} Officers Active in Field`,
                variant: 'info',
              },
            ]}
          />

          {/* Card 2: Completed Campaigns */}
          <StatCard
            value={stats.completedCampaignsCount.toString().padStart(2, '0')}
            label="Completed Campaigns"
            icon={
              <svg className="w-4 h-4 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            chips={[
              {
                label: `${stats.averageCheckCoveragePercent}% Average Check Coverage`,
                variant: 'success',
              },
              {
                label: `${stats.completedCount.toString().padStart(2, '0')} Completed`,
                variant: 'neutral',
              },
            ]}
          />

          {/* Card 3: Safety Alerts */}
          <StatCard
            value={stats.safetyAlertsCount.toString().padStart(2, '0')}
            label="Safety Alerts"
            icon={
              <svg className="w-4 h-4 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            chips={[
              {
                label: `${stats.unsafeBlocksCount.toString().padStart(2, '0')} Unsafe Block(s)`,
                variant: 'error',
              },
              {
                label: `${stats.officersHoldingCachedRoutesCount.toString().padStart(2, '0')} Officer(s) Hold Cached Routes`,
                variant: 'info',
              },
            ]}
          />
        </div>
      )}

      {/* Geographic Overview Map Banner (matching Campaign Overview design layout) */}
      <MapBanner height="h-72 sm:h-80" />

      {/* Operational Campaigns Section */}
      <div className="flex flex-col gap-4">
        {/* Section Header & Search/Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-[#1C211B]">
            Operational Campaigns
          </h2>

          <div className="flex-1 max-w-lg sm:ml-auto">
            <SearchFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onFilterClick={() => setIsFilterActive(!isFilterActive)}
              isFilterActive={isFilterActive}
              searchPlaceholder="Search here"
            />
          </div>
        </div>

        {/* Campaigns Table or Empty State */}
        {filteredCampaigns.length === 0 ? (
          <EmptyState
            title="No operational campaigns found."
            message="Initiate your first campaign to begin tracking planting progress across blocks."
            actionLabel="Initiate a campaign"
            actionVariant="primary"
            onAction={() => setIsAddModalOpen(true)}
          />
        ) : (
          <div className="w-full overflow-x-auto border border-[#E2E5E6] rounded-xl bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F1E6] border-b border-[#E2E5E6]">
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Campaign Name
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Campaign Area
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Target Baseline
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Mapped Blocks
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Assigned Officers
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF0F2]">
                {filteredCampaigns.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F5F8F4] transition-colors">
                    {/* Column: Campaign Name */}
                    <td className="px-4 py-4 text-xs font-medium text-[#1C211B]">
                      {item.name}
                    </td>

                    {/* Column: Campaign Area */}
                    <td className="px-4 py-4 text-xs text-[#5E625E]">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAFCFE] border border-[#E2E5E6]">
                        <svg className="w-3.5 h-3.5 text-[#7B7E7B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{item.area}</span>
                      </div>
                    </td>

                    {/* Column: Target Baseline */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-semibold text-[#1C211B]">
                          {item.targetTrees >= 1000000
                            ? `${(item.targetTrees / 1000000).toFixed(0)}M Trees`
                            : `${item.targetTrees.toLocaleString()} Trees`}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#ECFDF3] text-[#027A48] border border-[#D1FADF]">
                            {item.claimedTrees.toString().padStart(2, '0')} Claimed
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F2F4F7] text-[#344054] border border-[#EAECF0]">
                            {item.pendingTrees.toString().padStart(2, '0')} Pending
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Column: Mapped Blocks */}
                    <td className="px-4 py-4 text-xs">
                      <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-[#FAFCFE] border border-[#E2E5E6] font-medium text-[#1C211B]">
                        {item.mappedBlocksCount} Block(s)
                      </div>
                    </td>

                    {/* Column: Assigned Officers */}
                    <td className="px-4 py-4 text-xs">
                      <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-[#FAFCFE] border border-[#E2E5E6] font-medium text-[#1C211B]">
                        {item.assignedOfficersCount} Block(s)
                      </div>
                    </td>

                    {/* Column: Status */}
                    <td className="px-4 py-4 text-xs">
                      <StatusBadge
                        status={item.status}
                        variant="dot"
                      />
                    </td>

                    {/* Column: Actions */}
                    <td className="px-4 py-4 text-xs text-right">
                      <TableActionMenu
                        items={[
                          {
                            label: 'View details',
                            onClick: () => console.log('View details', item.id),
                          },
                          {
                            label: 'Edit campaign',
                            onClick: () => console.log('Edit campaign', item.id),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Campaign Modal */}
      <AddCampaignModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleCampaignCreated}
      />
    </div>
  );
};
