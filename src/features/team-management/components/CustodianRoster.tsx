/**
 * CustodianRoster.tsx
 *
 * Implements Custodian Roster (Custodian Overview) screen.
 * References:
 * - design/ui-reference/team-management/Custodian Overview.png
 * - AGENTS.md section 4 & 9
 * - api-network-rules.md (loading, result, failure with retry, PRD empty state)
 * - react-architecture-rules.md (reuses shared src/components/)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { StatCard } from '../../../components/StatCard';
import { SearchFilterBar } from '../../../components/SearchFilterBar';
import { StatusBadge } from '../../../components/StatusBadge';
import { TableActionMenu } from '../../../components/TableActionMenu';
import { EmptyState } from '../../../components/EmptyState';
import { MapBanner } from '../../../components/MapBanner';
import { CustodianIndividual, CustodianProfileData } from '../../record-detail';
import { AssignBlockModal } from '../../assignment';
import {
  CustodianStats,
  CustodianItem,
  PersonMarker,
} from '../types/team';
import { fetchCustodians } from '../services/teamPlaceholder';

const mapCustodianToProfile = (custodian: CustodianItem): CustodianProfileData => ({
  id: custodian.id,
  name: custodian.name,
  ward: custodian.zone,
  type: custodian.custodianType,
  assignedBlockName: custodian.assignedBlockName,
  assignedCoordinate: custodian.assignedCoordinate,
  positionType: custodian.positionType,
  avatarSignedUrl: custodian.avatarSignedUrl,
  email: custodian.email,
  phoneNumber: custodian.phone,
  assignedTrees: custodian.treeAllocation.total,
  assignedBlocks: 2,
  campaigns: 1,
  assignedSpecies: custodian.treeAllocation.breakdown?.length || 4,
});

export const CustodianRoster: React.FC = () => {
  const [stats, setStats] = useState<CustodianStats | null>(null);
  const [custodians, setCustodians] = useState<CustodianItem[]>([]);
  const [peopleMarkers, setPeopleMarkers] = useState<PersonMarker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustodianForProfile, setSelectedCustodianForProfile] = useState<CustodianItem | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterActive, setIsFilterActive] = useState(false);

  const loadData = async (shouldFail: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCustodians(shouldFail);
      setStats(result.stats);
      setCustodians(result.custodians);
      setPeopleMarkers(result.peopleMarkers);
    } catch (err: any) {
      setError(err.message || 'Failed to load custodians roster. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCustodians = useMemo(() => {
    return custodians.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.zone.toLowerCase().includes(searchQuery.toLowerCase());
      if (isFilterActive) {
        return matchesSearch && c.custodianType === 'Block';
      }
      return matchesSearch;
    });
  }, [custodians, searchQuery, isFilterActive]);

  // Loading state (api-network-rules.md Rule 3)
  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-7 w-48 bg-[#E2E5E6] rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-28 bg-[#E2E5E6] rounded-xl" />
          <div className="h-28 bg-[#E2E5E6] rounded-xl" />
          <div className="h-28 bg-[#E2E5E6] rounded-xl" />
          <div className="h-28 bg-[#E2E5E6] rounded-xl" />
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
          Custodian Overview
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2E5421] text-white hover:bg-[#234019] rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Block Owners</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Custodians */}
          <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="text-2xl font-bold text-[#1C211B]">
              {stats.totalCustodians.toString().padStart(2, '0')}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <svg className="w-4 h-4 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs font-medium text-[#424641]">Total Custodians</span>
            </div>
          </div>

          {/* Validated Custodians */}
          <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="text-2xl font-bold text-[#1C211B]">
              {stats.validatedCustodians.toString().padStart(2, '0')}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <svg className="w-4 h-4 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-medium text-[#424641]">Validated Custodians</span>
            </div>
          </div>

          {/* Individual Custodians */}
          <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="text-2xl font-bold text-[#1C211B]">
              {stats.individualCustodians.toString().padStart(2, '0')}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <svg className="w-4 h-4 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs font-medium text-[#424641]">Individual Custodians</span>
            </div>
          </div>

          {/* Block Custodians */}
          <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="text-2xl font-bold text-[#1C211B]">
              {stats.blockCustodians.toString().padStart(2, '0')}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <svg className="w-4 h-4 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polygon points="12 2, 22 8, 18 21, 6 21, 2 8" strokeWidth={1.5} />
              </svg>
              <span className="text-xs font-medium text-[#424641]">Block Custodians</span>
            </div>
          </div>
        </div>
      )}

      {/* Overview Map Banner with Custodian Markers differentiated by Custodian Type */}
      <MapBanner peopleMarkers={peopleMarkers} height="h-72 sm:h-80" />

      {/* Custodian Management Section */}
      <div className="flex flex-col gap-4">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-[#1C211B]">
            Custodian Management
          </h2>

          <div className="flex items-center gap-3">
            <div className="w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search here"
                className="w-full px-3.5 py-2 bg-[#FAFCFE] border border-[#CBCDCE] rounded-lg text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:border-[#2E5421] focus:ring-1 focus:ring-[#2E5421]"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsFilterActive(!isFilterActive)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 border rounded-lg text-xs font-semibold transition-colors ${
                isFilterActive
                  ? 'bg-[#FDF8F3] border-[#C97A3E] text-[#8C532B]'
                  : 'bg-white border-[#C97A3E] text-[#8C532B] hover:bg-[#FDF8F3]'
              }`}
            >
              <span>Filter</span>
              <svg className="w-3.5 h-3.5 text-[#8C532B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>

            <button
              type="button"
              disabled
              title="Export action blocked pending column list and wording confirmation"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2E5421] text-white hover:bg-[#234019] rounded-lg text-xs font-semibold transition-colors opacity-90 cursor-not-allowed shrink-0"
            >
              <span>Export Table</span>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Table */}
        {filteredCustodians.length === 0 ? (
          <EmptyState
            title="No custodians found."
            message="No custodian records matched your filter criteria."
          />
        ) : (
          <div className="w-full overflow-x-auto border border-[#E2E5E6] rounded-xl bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F1E6] border-b border-[#E2E5E6]">
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Custodian Name
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Contact & Zone
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Custodian Type
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Tree Allocation
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Assigned Officer
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Campaign
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF0F2]">
                {filteredCustodians.map((custodian) => (
                  <tr key={custodian.id} className="hover:bg-[#F5F8F4] transition-colors">
                    {/* Custodian Name */}
                    {/* Custodian Name */}
                    <td className="px-4 py-4 text-xs font-medium text-[#1C211B]">
                      <button
                        type="button"
                        onClick={() => setSelectedCustodianForProfile(custodian)}
                        className="font-medium text-[#1C211B] hover:text-[#2E5421] hover:underline text-left cursor-pointer"
                      >
                        {custodian.name}
                      </button>
                    </td>

                    {/* Contact & Zone */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex flex-col gap-1">
                        <span className="text-[#1C211B] font-medium">{custodian.phone}</span>
                        <span className="text-[#7B7E7B]">{custodian.email}</span>
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAFCFE] border border-[#E2E5E6] text-[#5E625E]">
                            {custodian.zone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Custodian Type */}
                    <td className="px-4 py-4 text-xs">
                      <StatusBadge
                        status={custodian.custodianType}
                        variant="dot"
                      />
                    </td>

                    {/* Tree Allocation */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex flex-col gap-1.5 p-2 bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl max-w-xs">
                        <span className="text-base font-bold text-[#1C211B]">
                          {custodian.treeAllocation.total}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {custodian.treeAllocation.breakdown.map((item, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white border border-[#E2E5E6] text-[#5E625E]"
                            >
                              {item.count} {item.species}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Assigned Officer */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-[#1C211B]">
                          {custodian.assignedOfficer.name}
                        </span>
                        <span className="text-[#7B7E7B]">{custodian.assignedOfficer.phone}</span>
                        <span className="text-[#7B7E7B]">{custodian.assignedOfficer.email}</span>
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] bg-[#FAFCFE] border border-[#E2E5E6] text-[#5E625E]">
                            {custodian.assignedOfficer.zone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Campaign */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex flex-col gap-1.5 p-2.5 bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl max-w-xs">
                        <div className="flex items-center gap-1.5 font-medium text-[#1C211B]">
                          <svg className="w-3.5 h-3.5 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                          </svg>
                          <span>{custodian.campaign.name}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[#1C211B]">
                            {custodian.campaign.progressPercent} %
                          </span>
                          <StatusBadge
                            status={custodian.campaign.status}
                            variant="dot"
                          />
                        </div>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-[#ECFDF3] text-[#027A48] border border-[#D1FADF]">
                            {custodian.campaign.verifiedCount.toString().padStart(2, '0')} Verified
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-[#F2F4F7] text-[#344054] border border-[#EAECF0]">
                            {custodian.campaign.pendingCount.toString().padStart(2, '0')} Pending
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-xs text-right">
                      <TableActionMenu
                        items={[
                          {
                            label: 'View details',
                            onClick: () => setSelectedCustodianForProfile(custodian),
                          },
                          {
                            label: 'Reassign officer',
                            onClick: () => console.log('Reassign officer', custodian.id),
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

      {/* Custodian Details Modal */}
      {selectedCustodianForProfile && (
        <CustodianIndividual
          isOpen={Boolean(selectedCustodianForProfile)}
          onClose={() => setSelectedCustodianForProfile(null)}
          onBack={() => setSelectedCustodianForProfile(null)}
          custodian={mapCustodianToProfile(selectedCustodianForProfile)}
          onNewAssignment={() => setIsAssignModalOpen(true)}
        />
      )}

      {/* Assign Block Modal triggered from Custodian */}
      <AssignBlockModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        preselectedOfficerName={selectedCustodianForProfile?.assignedOfficer.name}
      />
    </div>
  );
};
