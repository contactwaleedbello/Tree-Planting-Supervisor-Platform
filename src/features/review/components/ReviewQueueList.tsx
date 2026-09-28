/**
 * ReviewQueueList.tsx
 *
 * Implements FR-10 Review Queue list entry point per Part B:
 * - Built using DataTable pattern confirmed in team-management.
 * - Displays exact PRD empty state text: "Nothing to review."
 * - Selecting a record opens GrowthCheckReview.
 *
 * PROPOSED COLUMNS (reported back to user per prompt):
 * 1. Tree ID & Code
 * 2. Species & Number
 * 3. Block Location
 * 4. Field Officer
 * 5. Submitted At
 * 6. Review Status (Needs Review / Verified / Rejected)
 * 7. Actions (Review Record)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { SearchFilterBar } from '../../../components/SearchFilterBar';
import { StatusBadge } from '../../../components/StatusBadge';
import { EmptyState } from '../../../components/EmptyState';
import { GrowthCheckReview } from './GrowthCheckReview';
import { GrowthCheckRecord } from '../types/review';
import { fetchReviewQueue } from '../services/reviewPlaceholder';

export const ReviewQueueList: React.FC = () => {
  const [queue, setQueue] = useState<GrowthCheckRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterActive, setIsFilterActive] = useState(false);

  // Active review item
  const [activeRecord, setActiveRecord] = useState<GrowthCheckRecord | null>(null);

  const loadData = async (shouldFail: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReviewQueue(shouldFail);
      setQueue(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load review queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDecisionComplete = (updatedRecord: GrowthCheckRecord) => {
    setQueue((prev) =>
      prev.map((r) => (r.id === updatedRecord.id ? updatedRecord : r))
    );
  };

  const filteredQueue = useMemo(() => {
    return queue.filter((r) => {
      const matchesSearch =
        r.treeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.blockId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.extensionOfficerName.toLowerCase().includes(searchQuery.toLowerCase());
      if (isFilterActive) {
        return matchesSearch && r.state === 'Needs Review';
      }
      return matchesSearch;
    });
  }, [queue, searchQuery, isFilterActive]);

  if (activeRecord) {
    return (
      <GrowthCheckReview
        record={activeRecord}
        onBack={() => setActiveRecord(null)}
        onDecisionComplete={handleDecisionComplete}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-7 w-48 bg-[#E2E5E6] rounded-md" />
        <div className="h-10 w-full max-w-md bg-[#E2E5E6] rounded-lg" />
        <div className="h-72 bg-[#E2E5E6] rounded-xl" />
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
            Review Queue
          </h1>
          <p className="text-xs text-[#5E625E] mt-1">
            Single quality gate for tree registrations, validations, and growth checks before audit verification.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="w-full sm:max-w-md">
          <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFilterClick={() => setIsFilterActive(!isFilterActive)}
            isFilterActive={isFilterActive}
            searchPlaceholder="Search tree ID, species, or officer"
          />
        </div>
      </div>

      {/* Queue Table */}
      {filteredQueue.length === 0 ? (
        <EmptyState
          title="Nothing to review."
          message="Submitted registrations, validations, and growth checks will appear here for quality review."
        />
      ) : (
        <div className="w-full overflow-x-auto border border-[#E2E5E6] rounded-xl bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F1E6] border-b border-[#E2E5E6]">
                <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                  Tree ID
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                  Species & Number
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                  Block
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                  Extension Officer
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                  Submitted At
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
              {filteredQueue.map((item) => (
                <tr key={item.id} className="hover:bg-[#F5F8F4] transition-colors">
                  {/* Tree ID */}
                  <td className="px-4 py-4 text-xs font-bold text-[#1C211B]">
                    {item.treeId}
                  </td>

                  {/* Species & Number */}
                  <td className="px-4 py-4 text-xs text-[#1C211B]">
                    <span className="font-semibold">{item.species}</span>
                    <span className="text-[#7B7E7B] ml-1">#{item.systemTreeNumber}</span>
                  </td>

                  {/* Block */}
                  <td className="px-4 py-4 text-xs text-[#5E625E]">
                    <span className="px-2 py-0.5 rounded-md bg-[#FAFCFE] border border-[#E2E5E6]">
                      {item.blockId}
                    </span>
                  </td>

                  {/* Extension Officer */}
                  <td className="px-4 py-4 text-xs font-medium text-[#1C211B]">
                    {item.extensionOfficerName}
                  </td>

                  {/* Submitted At */}
                  <td className="px-4 py-4 text-xs text-[#7B7E7B]">
                    {item.submittedAt}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 text-xs">
                    <StatusBadge status={item.state} variant="pill" />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 text-xs text-right">
                    <button
                      type="button"
                      onClick={() => setActiveRecord(item)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#2E5421] text-white hover:bg-[#234019] font-semibold text-xs transition-colors shadow-xs"
                    >
                      Review Record
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
