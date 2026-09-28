/**
 * BlockAssignmentList.tsx
 *
 * Implements FR-09 Assignment Block List entry point per Part B:
 * - Built using DataTable pattern confirmed in team-management and campaign-management.
 * - Displays exact PRD empty state text: "Unassigned." for unassigned blocks.
 * - Displays exact PRD unsafe error text: "This block is flagged unsafe and cannot be assigned."
 * - Flags unassigned empty state when list is completely empty or block has no assignment.
 * - Leaves the end-assignment action unbuilt as instructed (genuinely blocked).
 *
 * PROPOSED COLUMNS (reported back to user per prompt):
 * 1. Block ID & Name
 * 2. Location & Zone
 * 3. Safety Flag (Safe / Unsafe)
 * 4. Block State (Draft / Mapped / Active / Retired)
 * 5. Spacing & Target (Spacing Standard & Expected Tree Count)
 * 6. Assignment Status (Officer Name or "Unassigned.")
 * 7. Actions (Assign Block button / menu)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { SearchFilterBar } from '../../../components/SearchFilterBar';
import { StatusBadge } from '../../../components/StatusBadge';
import { EmptyState } from '../../../components/EmptyState';
import { TableActionMenu } from '../../../components/TableActionMenu';
import { AssignBlockModal } from './AssignBlockModal';
import { BlockProfile, BlockProfileData } from '../../record-detail';
import { MappableBlockItem } from '../types/assignment';
import { fetchMappableBlocks } from '../services/assignmentPlaceholder';

export interface BlockAssignmentListProps {
  onNavigateToNotifications?: () => void;
}

const mapBlockToProfile = (block: MappableBlockItem): BlockProfileData => ({
  id: block.id,
  name: block.name,
  polygon: [
    { lat: 12.0022, lng: 8.5919 },
    { lat: 12.0045, lng: 8.5955 },
    { lat: 12.0018, lng: 8.5982 },
    { lat: 11.9995, lng: 8.5942 },
  ],
  notifications: [
    {
      id: 'notif-1',
      categoryTag: 'Pending',
      title: '123-454-YT-1234',
      recordType: 'growth_check',
      officerName: block.currentAssignment?.officerName || 'Marcus A. Lee',
      phoneNumber: '+2349198765432',
      timestamp: 'Today 10:25 PM',
      statusBadge: 'Growth Check',
    },
    {
      id: 'notif-2',
      categoryTag: 'Pending',
      title: '123-454-YT-1234',
      recordType: 'incident',
      officerName: block.currentAssignment?.officerName || 'Marcus A. Lee',
      phoneNumber: '+2349198765432',
      timestamp: 'Today 09:14 PM',
      statusBadge: 'Damaged/Destroyed',
    },
  ],
  stakeholders: [
    {
      id: 'stk-1',
      name: block.currentAssignment?.officerName || 'Marcus A. Lee',
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

export const BlockAssignmentList: React.FC<BlockAssignmentListProps> = ({
  onNavigateToNotifications,
}) => {
  const [blocks, setBlocks] = useState<MappableBlockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlockForProfile, setSelectedBlockForProfile] = useState<MappableBlockItem | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterActive, setIsFilterActive] = useState(false);

  // Modal state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>(undefined);

  const loadData = async (shouldFail: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMappableBlocks(shouldFail);
      setBlocks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load block assignments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignmentCreated = (updatedBlock: MappableBlockItem) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b))
    );
  };

  const handleOpenAssignModal = (blockId?: string) => {
    setSelectedBlockId(blockId);
    setIsAssignModalOpen(true);
  };

  const filteredBlocks = useMemo(() => {
    return blocks.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.currentAssignment?.officerName || '').toLowerCase().includes(searchQuery.toLowerCase());
      if (isFilterActive) {
        return matchesSearch && !b.currentAssignment;
      }
      return matchesSearch;
    });
  }, [blocks, searchQuery, isFilterActive]);

  if (selectedBlockForProfile) {
    return (
      <div className="flex flex-col gap-4 p-4 sm:p-6 max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => setSelectedBlockForProfile(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#2E5421] hover:underline self-start mb-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Block Assignments</span>
        </button>
        <BlockProfile
          block={mapBlockToProfile(selectedBlockForProfile)}
          onBackToBlocks={() => setSelectedBlockForProfile(null)}
          onSeeAllNotifications={onNavigateToNotifications}
          onTrackActivities={() => onNavigateToNotifications && onNavigateToNotifications()}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-7 w-56 bg-[#E2E5E6] rounded-md" />
        <div className="h-10 w-full max-w-md bg-[#E2E5E6] rounded-lg" />
        <div className="h-80 bg-[#E2E5E6] rounded-xl" />
      </div>
    );
  }

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1C211B] tracking-tight">
            Block Assignments
          </h1>
          <p className="text-xs text-[#5E625E] mt-1">
            Assign field extension officers to mapped blocks and monitor task deployment.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenAssignModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2E5421] text-white hover:bg-[#234019] rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Assign Block</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="w-full sm:max-w-md">
          <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFilterClick={() => setIsFilterActive(!isFilterActive)}
            isFilterActive={isFilterActive}
            searchPlaceholder="Search block, location, or officer"
          />
        </div>
      </div>

      {/* Data Table */}
      {filteredBlocks.length === 0 ? (
        <EmptyState
          title="Unassigned."
          message="No blocks match the current filter criteria."
          actionLabel="Assign Block"
          actionVariant="primary"
          onAction={() => handleOpenAssignModal()}
        />
      ) : (
        <div className="w-full overflow-x-auto border border-[#E2E5E6] rounded-xl bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F1E6] border-b border-[#E2E5E6]">
                <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                  Block
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                  Location
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                  Safety
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                  Block State
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                  Spacing & Expected Trees
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                  Current Assignment
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF0F2]">
              {filteredBlocks.map((block) => {
                const isUnsafe = block.safety === 'Unsafe';
                return (
                  <tr key={block.id} className="hover:bg-[#F5F8F4] transition-colors">
                    {/* Block Name */}
                    <td className="px-4 py-4 text-xs font-bold text-[#1C211B]">
                      <button
                        type="button"
                        onClick={() => setSelectedBlockForProfile(block)}
                        className="text-[#1C211B] hover:text-[#2E5421] hover:underline text-left font-bold cursor-pointer"
                      >
                        {block.name}
                      </button>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-4 text-xs text-[#5E625E]">
                      {block.location}
                    </td>

                    {/* Safety Flag */}
                    <td className="px-4 py-4 text-xs">
                      <StatusBadge
                        status={block.safety}
                        variant="dot"
                      />
                    </td>

                    {/* Block State */}
                    <td className="px-4 py-4 text-xs">
                      <StatusBadge
                        status={block.blockState}
                        variant="outline"
                      />
                    </td>

                    {/* Spacing & Target */}
                    <td className="px-4 py-4 text-xs text-[#1C211B]">
                      <span className="font-medium">{block.spacingStandard}</span>
                      <span className="text-[#7B7E7B] ml-1">
                        • {block.expectedTreeCount.toLocaleString()} trees
                      </span>
                    </td>

                    {/* Current Assignment / Empty State */}
                    <td className="px-4 py-4 text-xs">
                      {block.currentAssignment ? (
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-[#1C211B]">
                            {block.currentAssignment.officerName}
                          </span>
                          <span className="text-[11px] text-[#7B7E7B]">
                            Since {block.currentAssignment.startDate}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F2F4F7] text-[#5E625E] border border-[#EAECF0]">
                          Unassigned.
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-xs text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedBlockForProfile(block)}
                          className="px-2.5 py-1.5 rounded-lg border border-[#E2E5E6] text-[#5E625E] hover:text-[#1C211B] hover:bg-[#FAFCFE] font-medium text-xs transition-colors"
                        >
                          View
                        </button>
                        {isUnsafe ? (
                          <div className="inline-flex items-center gap-1 text-[11px] text-[#C54A40] font-medium">
                            <span>This block is flagged unsafe and cannot be assigned.</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenAssignModal(block.id)}
                            className="px-3 py-1.5 rounded-lg border border-[#2E5421] text-[#2E5421] hover:bg-[#F5F8F4] font-semibold text-xs transition-colors"
                          >
                            {block.currentAssignment ? 'Reassign' : 'Assign'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Block Modal */}
      <AssignBlockModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        preselectedBlockId={selectedBlockId}
        onSuccess={handleAssignmentCreated}
      />
    </div>
  );
};
