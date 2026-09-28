/**
 * FieldOfficerRoster.tsx
 *
 * Implements Field Officer Roster (User Management Overview) screen.
 * References:
 * - design/ui-reference/team-management/User Management.png
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
import { AddOfficerModal } from './AddOfficerModal';
import { AssignBlockModal } from '../../assignment';
import { UserProfile, UserProfileData } from '../../record-detail';
import {
  FieldOfficerStats,
  FieldOfficerItem,
  PersonMarker,
} from '../types/team';
import { fetchFieldOfficers, mapOfficersToPeopleMarkers } from '../services/teamPlaceholder';

export interface FieldOfficerRosterProps {
  onNavigateToNotifications?: () => void;
}

const mapOfficerToUserProfile = (officer: FieldOfficerItem): UserProfileData => ({
  id: officer.id,
  name: officer.name,
  ward: officer.zone,
  status: officer.status === 'Active' ? 'Online' : officer.status,
  userState: officer.userState,
  assignedBlockName: officer.assignedBlockName,
  assignedCoordinate: officer.assignedCoordinate,
  positionType: officer.positionType,
  avatarSignedUrl: officer.avatarSignedUrl,
  role: 'Field Officer',
  email: officer.email,
  phoneNumber: officer.phone,
  idCardFilename: 'identity_card_verified.pdf',
  assignedBlocksCount: 3,
  completedTasks: {
    total: officer.completedTasks.total,
    verified: officer.completedTasks.verifiedCount,
    rejected: officer.completedTasks.rejectedCount,
    pending: officer.completedTasks.pendingCount,
  },
  activeAssignment: {
    projectName: officer.activeAssignment.projectName,
    location: officer.activeAssignment.location,
    validationsCount: officer.activeAssignment.validationsCount,
    growthCheckCount: officer.activeAssignment.growthChecksCount,
  },
  notifications: [
    {
      id: 'notif-1',
      title: '123-454-YT-1234',
      categoryTag: 'Pending',
      statusBadge: 'Growth Check',
      recordType: 'growth_check',
      officerName: officer.name,
      phoneNumber: officer.phone,
      timestamp: 'Today 10:25 PM',
    },
    {
      id: 'notif-2',
      title: '123-454-YT-1234',
      categoryTag: 'Pending',
      statusBadge: 'Damaged/Destroyed',
      recordType: 'incident',
      officerName: officer.name,
      phoneNumber: officer.phone,
      timestamp: 'Today 09:14 PM',
    },
  ],
  relatedStakeholders: [
    {
      id: 'stk-1',
      name: 'Marcus A. Lee',
      role: 'EXTENSION OFFICER',
      phone: '+2349198765432',
      cluster: 'Mariri Cluster',
      timestamp: 'Today 10:25 PM',
    },
    {
      id: 'stk-2',
      name: 'Amina Yusuf',
      role: 'Custodian',
      phone: '+2348031234567',
      cluster: 'Mariri Cluster',
      timestamp: 'Yesterday 04:12 PM',
    },
  ],
});

export const FieldOfficerRoster: React.FC<FieldOfficerRosterProps> = ({
  onNavigateToNotifications,
}) => {
  const [stats, setStats] = useState<FieldOfficerStats | null>(null);
  const [officers, setOfficers] = useState<FieldOfficerItem[]>([]);
  const [peopleMarkers, setPeopleMarkers] = useState<PersonMarker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOfficerForProfile, setSelectedOfficerForProfile] = useState<FieldOfficerItem | null>(null);
  const [selectedOfficerForAssign, setSelectedOfficerForAssign] = useState<FieldOfficerItem | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterActive, setIsFilterActive] = useState(false);

  // Add Officer Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadData = async (shouldFail: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFieldOfficers(shouldFail);
      setStats(result.stats);
      setOfficers(result.officers);
      setPeopleMarkers(result.peopleMarkers);
    } catch (err: any) {
      setError(err.message || 'Failed to load field officers roster. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOfficerAdded = (newOfficer: FieldOfficerItem) => {
    setOfficers((prev) => {
      const updated = [newOfficer, ...prev];
      setPeopleMarkers(mapOfficersToPeopleMarkers(updated));
      return updated;
    });
    if (stats) {
      setStats({
        ...stats,
        totalUsers: stats.totalUsers + 1,
      });
    }
  };

  const filteredOfficers = useMemo(() => {
    return officers.filter((o) => {
      const matchesSearch =
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.phone.includes(searchQuery) ||
        o.zone.toLowerCase().includes(searchQuery.toLowerCase());
      if (isFilterActive) {
        return matchesSearch && (o.status === 'Active' || o.status === 'Online');
      }
      return matchesSearch;
    });
  }, [officers, searchQuery, isFilterActive]);

  if (selectedOfficerForProfile) {
    return (
      <div className="flex flex-col gap-4 p-4 sm:p-6 max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => setSelectedOfficerForProfile(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#2E5421] hover:underline self-start mb-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Users Overview</span>
        </button>
        <UserProfile
          user={mapOfficerToUserProfile(selectedOfficerForProfile)}
          onBackToTeam={() => setSelectedOfficerForProfile(null)}
          onSeeAllNotifications={onNavigateToNotifications}
        />
      </div>
    );
  }

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
          Users Overview
        </h1>
      </div>

      {/* 4 Stat Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Users */}
          <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="text-2xl font-bold text-[#1C211B]">
              {stats.totalUsers.toString().padStart(2, '0')}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <svg className="w-4 h-4 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-xs font-medium text-[#424641]">Total Users</span>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="text-2xl font-bold text-[#1C211B]">
              {stats.activeUsers.toString().padStart(2, '0')}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <svg className="w-4 h-4 text-[#3CAD90]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-xs font-medium text-[#3CAD90]">Active Users</span>
            </div>
          </div>

          {/* Suspended Users */}
          <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="text-2xl font-bold text-[#1C211B]">
              {stats.suspendedUsers.toString().padStart(2, '0')}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <svg className="w-4 h-4 text-[#C54A40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-xs font-medium text-[#C54A40]">Suspended Users</span>
            </div>
          </div>

          {/* Users Online */}
          <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="text-2xl font-bold text-[#1C211B]">
              {stats.usersOnline.toString().padStart(2, '0')}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <svg className="w-4 h-4 text-[#406AC1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-xs font-medium text-[#406AC1]">Users Online</span>
            </div>
          </div>
        </div>
      )}

      {/* Overview Map Banner with Field Officer Markers colored by UserState */}
      <MapBanner peopleMarkers={peopleMarkers} height="h-72 sm:h-80" />

      {/* User Management Table Section */}
      <div className="flex flex-col gap-4">
        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-[#1C211B]">
            User Management
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search here"
                className="w-full px-3.5 py-2 bg-[#FAFCFE] border border-[#CBCDCE] rounded-lg text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:border-[#2E5421] focus:ring-1 focus:ring-[#2E5421]"
              />
            </div>

            {/* Add Officers Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#1C211B] hover:text-[#2E5421] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Add Officers</span>
            </button>

            {/* Filter Button */}
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

            {/* Export Table Button */}
            <button
              type="button"
              disabled
              title="Export action blocked pending column list and wording confirmation"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2E5421] text-white hover:bg-[#234019] rounded-lg text-xs font-semibold transition-colors opacity-90 cursor-not-allowed"
            >
              <span>Export Table</span>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Table */}
        {filteredOfficers.length === 0 ? (
          <EmptyState
            title="No field officers found."
            message="Onboard your first field officer to begin tracking assignments and verifications."
            actionLabel="Add Officers"
            actionVariant="primary"
            onAction={() => setIsAddModalOpen(true)}
          />
        ) : (
          <div className="w-full overflow-x-auto border border-[#E2E5E6] rounded-xl bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F1E6] border-b border-[#E2E5E6]">
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Field Officer
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Contact & Zone
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Active Assignment
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Completed Tasks
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Last Sync
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF0F2]">
                {filteredOfficers.map((officer) => (
                  <tr key={officer.id} className="hover:bg-[#F5F8F4] transition-colors">
                    {/* Field Officer */}
                    <td className="px-4 py-4 text-xs font-medium text-[#1C211B]">
                      <button
                        type="button"
                        onClick={() => setSelectedOfficerForProfile(officer)}
                        className="font-medium text-[#1C211B] hover:text-[#2E5421] hover:underline text-left cursor-pointer"
                      >
                        {officer.name}
                      </button>
                    </td>

                    {/* Contact & Zone */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex flex-col gap-1">
                        <span className="text-[#1C211B] font-medium">{officer.phone}</span>
                        <span className="text-[#7B7E7B]">{officer.email}</span>
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAFCFE] border border-[#E2E5E6] text-[#5E625E]">
                            {officer.zone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 text-xs">
                      <StatusBadge
                        status={officer.status}
                        variant="dot"
                      />
                    </td>

                    {/* Active Assignment */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex flex-col gap-1.5 max-w-xs">
                        <div className="flex items-center gap-1.5 font-medium text-[#1C211B]">
                          <svg className="w-3.5 h-3.5 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                          </svg>
                          <span>{officer.activeAssignment.projectName}</span>
                        </div>
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] bg-[#FAFCFE] border border-[#E2E5E6] text-[#7B7E7B]">
                            {officer.activeAssignment.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FDF1E8] text-[#8C532B] border border-[#E6CDA9]">
                            {officer.activeAssignment.validationsCount} Validations
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FDF1E8] text-[#8C532B] border border-[#E6CDA9]">
                            {officer.activeAssignment.growthChecksCount} Growth check
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Completed Tasks */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-bold text-[#1C211B]">
                            {officer.completedTasks.total}
                          </span>
                          <span className="text-[11px] text-[#7B7E7B]">Completed Tasks</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-[#ECFDF3] text-[#027A48] border border-[#D1FADF]">
                            {officer.completedTasks.verifiedCount} Verified
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-[#FEE4E2] text-[#D92D20] border border-[#FECDCA]">
                            {officer.completedTasks.rejectedCount} Rejected
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-[#F2F4F7] text-[#344054] border border-[#EAECF0]">
                            {officer.completedTasks.pendingCount} Pending
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Last Sync */}
                    <td className="px-4 py-4 text-xs">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-[#FAFCFE] border border-[#E2E5E6] text-xs text-[#5E625E]">
                        {officer.lastSync}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-xs text-right">
                      <TableActionMenu
                        items={[
                          {
                            label: 'View profile',
                            onClick: () => setSelectedOfficerForProfile(officer),
                          },
                          {
                            label: 'Assign block',
                            onClick: () => setSelectedOfficerForAssign(officer),
                          },
                          {
                            label: 'Deactivate',
                            variant: 'danger',
                            onClick: () => console.log('Deactivate', officer.id),
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

      {/* Add Officer Modal */}
      <AddOfficerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleOfficerAdded}
      />

      {/* Assign Block Modal */}
      <AssignBlockModal
        isOpen={Boolean(selectedOfficerForAssign)}
        onClose={() => setSelectedOfficerForAssign(null)}
        preselectedOfficerId={selectedOfficerForAssign?.id}
        preselectedOfficerName={selectedOfficerForAssign?.name}
      />
    </div>
  );
};
