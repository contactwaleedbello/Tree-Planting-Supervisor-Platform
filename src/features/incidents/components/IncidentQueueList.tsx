/**
 * IncidentQueueList.tsx
 *
 * Implements FR-11 Incident Queue list entry point per Part B:
 * - Built using DataTable pattern confirmed in team-management.
 * - Displays exact PRD empty state text: "No incidents to review."
 * - Selecting an incident opens IncidentReview component.
 *
 * PROPOSED COLUMNS (reported back to user per prompt):
 * 1. Incident ID & Tree ID
 * 2. Category
 * 3. Block Location
 * 4. Reporting Officer
 * 5. Reported Timestamp
 * 6. Incident Status (NeedsReview, ReplacementApproved, ReplacementRejected, Escalated)
 * 7. Actions (Review Incident)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { SearchFilterBar } from '../../../components/SearchFilterBar';
import { StatusBadge } from '../../../components/StatusBadge';
import { EmptyState } from '../../../components/EmptyState';
import { IncidentReview, IncidentRecordData } from './IncidentReview';
import { AssignBlockModal } from '../../assignment/components/AssignBlockModal';
import {
  fetchIncidentQueue,
  approveIncident,
  rejectIncident,
  escalateIncident,
} from '../services/incidentPlaceholder';

export const IncidentQueueList: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentRecordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterActive, setIsFilterActive] = useState(false);

  // Selected incident
  const [activeIncident, setActiveIncident] = useState<IncidentRecordData | null>(null);

  // Re-assign Assignment modal state (Group 6: opens FR-09 form pre-filled with incident context)
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [reassignTargetIncident, setReassignTargetIncident] = useState<IncidentRecordData | null>(null);

  const loadData = async (shouldFail: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchIncidentQueue(shouldFail);
      setIncidents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load incident review queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    const updated = await approveIncident(id);
    setIncidents((prev) => prev.map((i) => (i.id === id ? updated : i)));
  };

  const handleReject = async (id: string, reason: string) => {
    const updated = await rejectIncident(id, reason);
    setIncidents((prev) => prev.map((i) => (i.id === id ? updated : i)));
  };

  const handleEscalate = async (id: string) => {
    const updated = await escalateIncident(id);
    setIncidents((prev) => prev.map((i) => (i.id === id ? updated : i)));
  };

  const handleReassign = (id: string) => {
    const target = incidents.find((i) => i.id === id) || (activeIncident?.id === id ? activeIncident : null);
    if (target) {
      setReassignTargetIncident(target);
      setIsReassignOpen(true);
    }
  };

  const filteredIncidents = useMemo(() => {
    return incidents.filter((i) => {
      const matchesSearch =
        i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (i.incidentNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (i.reporterName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.species.toLowerCase().includes(searchQuery.toLowerCase());
      if (isFilterActive) {
        return matchesSearch && i.status === 'NeedsReview';
      }
      return matchesSearch;
    });
  }, [incidents, searchQuery, isFilterActive]);

  if (activeIncident) {
    return (
      <>
        <IncidentReview
          incident={activeIncident}
          onBack={() => setActiveIncident(null)}
          onClose={() => setActiveIncident(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onEscalate={handleEscalate}
          onReassign={handleReassign}
        />

        {/* FR-09 Assignment Modal with incident context pre-filled */}
        {isReassignOpen && reassignTargetIncident && (
          <AssignBlockModal
            isOpen={isReassignOpen}
            onClose={() => {
              setIsReassignOpen(false);
              setReassignTargetIncident(null);
            }}
            preselectedBlockId={reassignTargetIncident.blockName}
            initialTaskType="Re-assignment / Incident Verification"
            initialFieldInstructions={`Incident #${reassignTargetIncident.incidentNumber || reassignTargetIncident.id} - Tree #${reassignTargetIncident.treeId} (${reassignTargetIncident.species}). Reason: ${reassignTargetIncident.reasons}`}
            onSuccess={() => {
              setIsReassignOpen(false);
              setReassignTargetIncident(null);
            }}
          />
        )}
      </>
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
            Incident Review Queue
          </h1>
          <p className="text-xs text-[#5E625E] mt-1">
            Review damage or loss incidents reported on planted trees. Approve for replacement, reject, or escalate to Super Admin.
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
            searchPlaceholder="Search incident ID, tree, or officer"
          />
        </div>
      </div>

      {/* Incident Table */}
      {filteredIncidents.length === 0 ? (
        <EmptyState
          title="No incidents to review."
          message="When field officers report damaged, diseased, or missing trees, incidents will appear here."
        />
      ) : (
        <div className="w-full overflow-x-auto border border-[#E2E5E6] rounded-xl bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F1E6] border-b border-[#E2E5E6]">
                <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                  Incident ID & Tree
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                  Category
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                  Block
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                  Reporting Officer
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                  Reported At
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
              {filteredIncidents.map((item) => (
                <tr key={item.id} className="hover:bg-[#F5F8F4] transition-colors">
                  {/* Incident ID & Tree */}
                  <td className="px-4 py-4 text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1C211B]">
                        {item.incidentNumber || item.id}
                      </span>
                      <span className="text-[11px] text-[#7B7E7B]">
                        {item.species} • #{item.treeId}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4 text-xs font-medium text-[#C54A40]">
                    {item.category}
                  </td>

                  {/* Block */}
                  <td className="px-4 py-4 text-xs text-[#5E625E]">
                    <span className="px-2 py-0.5 rounded-md bg-[#FAFCFE] border border-[#E2E5E6]">
                      {item.blockName || 'JGW-BLC-097'}
                    </span>
                  </td>

                  {/* Reporting Officer */}
                  <td className="px-4 py-4 text-xs font-medium text-[#1C211B]">
                    {item.reporterName}
                  </td>

                  {/* Reported At */}
                  <td className="px-4 py-4 text-xs text-[#7B7E7B]">
                    {item.timestamp}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 text-xs">
                    <StatusBadge status={item.status} variant="pill" />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 text-xs text-right">
                    <button
                      type="button"
                      onClick={() => setActiveIncident(item)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#2E5421] text-white hover:bg-[#234019] font-semibold text-xs transition-colors shadow-xs"
                    >
                      Review Incident
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FR-09 Assignment Modal with incident context pre-filled */}
      {isReassignOpen && reassignTargetIncident && (
        <AssignBlockModal
          isOpen={isReassignOpen}
          onClose={() => {
            setIsReassignOpen(false);
            setReassignTargetIncident(null);
          }}
          preselectedBlockId={reassignTargetIncident.blockName}
          initialTaskType="Re-assignment / Incident Verification"
          initialFieldInstructions={`Incident #${reassignTargetIncident.incidentNumber || reassignTargetIncident.id} - Tree #${reassignTargetIncident.treeId} (${reassignTargetIncident.species}). Reason: ${reassignTargetIncident.reasons}`}
          onSuccess={() => {
            setIsReassignOpen(false);
            setReassignTargetIncident(null);
          }}
        />
      )}
    </div>
  );
};
