/**
 * ReportsOverview.tsx
 *
 * Implements FR-12 Block-level reports screen per:
 * - design/ui-reference/FR-10-review-queue/Reports Overview.png
 * - AGENTS.md section 8 (FR-12 flow & zero-value rule)
 * - state-mapping-rules.md (M1 & M1b formulas)
 * - api-network-rules.md (loading, result, failure with retry)
 *
 * EXPORT CONSTRAINT:
 * As instructed in the master build prompt, the export action itself is blocked
 * on two unresolved questions:
 * 1. Toast copy conflict ("That export didn't complete" vs "Export failed. Try again.")
 * 2. Unconfirmed column list and file format for block-level export.
 * The export button is rendered with an inline unconfirmed flag.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { SearchFilterBar } from '../../../components/SearchFilterBar';
import { StatusBadge } from '../../../components/StatusBadge';
import { TableActionMenu } from '../../../components/TableActionMenu';
import { EmptyState } from '../../../components/EmptyState';
import { AssignBlockModal } from '../../assignment';
import { BlockProfile, BlockProfileData } from '../../record-detail';
import { GrowthCheckReview } from '../../review/components/GrowthCheckReview';
import { GrowthCheckRecord } from '../../review/types/review';
import { IncidentReview, IncidentRecordData } from '../../incidents/components/IncidentReview';
import {
  ReportsStats,
  BlockCoverageMetric,
  ReportItem,
} from '../types/report';
import { fetchReportsData } from '../services/reportPlaceholder';

export const ReportsOverview: React.FC = () => {
  const [stats, setStats] = useState<ReportsStats | null>(null);
  const [blockCoverage, setBlockCoverage] = useState<BlockCoverageMetric[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterActive, setIsFilterActive] = useState(false);

  // Connection states (Phase 3)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedGrowthCheckForReview, setSelectedGrowthCheckForReview] = useState<GrowthCheckRecord | null>(null);
  const [selectedIncidentForReview, setSelectedIncidentForReview] = useState<IncidentRecordData | null>(null);
  const [selectedBlockForProfile, setSelectedBlockForProfile] = useState<BlockProfileData | null>(null);

  const loadData = async (shouldFail: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReportsData(shouldFail);
      setStats(data.stats);
      setBlockCoverage(data.blockCoverage);
      setReports(data.reports);
    } catch (err: any) {
      setError(err.message || 'Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch =
        r.reporter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.campaign.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reportType.toLowerCase().includes(searchQuery.toLowerCase());
      if (isFilterActive) {
        return matchesSearch && r.status === 'Needs Review';
      }
      return matchesSearch;
    });
  }, [reports, searchQuery, isFilterActive]);

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
        <div className="h-40 bg-[#E2E5E6] rounded-2xl" />
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

  if (selectedGrowthCheckForReview) {
    return (
      <div className="flex flex-col gap-4 p-4 sm:p-6 max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => setSelectedGrowthCheckForReview(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#2E5421] hover:underline self-start mb-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Reports</span>
        </button>
        <GrowthCheckReview
          record={selectedGrowthCheckForReview}
          onBack={() => setSelectedGrowthCheckForReview(null)}
          onDecisionComplete={() => setSelectedGrowthCheckForReview(null)}
        />
      </div>
    );
  }

  if (selectedIncidentForReview) {
    return (
      <div className="flex flex-col gap-4 p-4 sm:p-6 max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => setSelectedIncidentForReview(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#2E5421] hover:underline self-start mb-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Reports</span>
        </button>
        <IncidentReview
          incident={selectedIncidentForReview}
          onBack={() => setSelectedIncidentForReview(null)}
        />
      </div>
    );
  }

  if (selectedBlockForProfile) {
    return (
      <div className="flex flex-col gap-4 p-4 sm:p-6 max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => setSelectedBlockForProfile(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#2E5421] hover:underline self-start mb-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Reports</span>
        </button>
        <BlockProfile
          block={selectedBlockForProfile}
          onBackToBlocks={() => setSelectedBlockForProfile(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-[#1C211B] tracking-tight">
          Reports Overview
        </h1>

        <div className="flex items-center gap-3">
          {/*
           * OPEN QUESTION (AGENTS.md section 8):
           * Export action is blocked on wording resolution ("That export didn't complete" vs "Export failed. Try again.")
           * and column list/format confirmation.
           */}
          <button
            type="button"
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
            onClick={() => setIsAssignModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2E5421] text-white hover:bg-[#234019] rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Assign Report</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Reports */}
          <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="text-2xl font-bold text-[#1C211B]">
              {stats.totalReports.toString().padStart(2, '0')}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <svg className="w-4 h-4 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs font-medium text-[#424641]">Total Reports</span>
            </div>
          </div>

          {/* Needs Review Reports */}
          <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="text-2xl font-bold text-[#1C211B]">
              {stats.needsReviewReports.toString().padStart(2, '0')}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <svg className="w-4 h-4 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs font-medium text-[#424641]">Needs Review Reports</span>
            </div>
          </div>

          {/* Verified Reports */}
          <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="text-2xl font-bold text-[#1C211B]">
              {stats.verifiedReports.toString().padStart(2, '0')}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <svg className="w-4 h-4 text-[#3CAD90]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs font-medium text-[#3CAD90]">Verified Reports</span>
            </div>
          </div>

          {/* Rejected Reports */}
          <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="text-2xl font-bold text-[#1C211B]">
              {stats.rejectedReports.toString().padStart(2, '0')}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <svg className="w-4 h-4 text-[#C54A40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs font-medium text-[#C54A40]">Rejected Reports</span>
            </div>
          </div>
        </div>
      )}

      {/* Block-Level Coverage (M1 & M1b Formulas per state-mapping-rules.md) */}
      <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#1C211B]">
              Block Verified Coverage & Registration (M1 & M1b)
            </h2>
            <p className="text-[11px] text-[#7B7E7B] mt-0.5">
              Only Verified records count toward audit coverage. Zero values are displayed for unverified blocks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {blockCoverage.map((b) => (
            <div
              key={b.blockId}
              className="p-4 bg-white border border-[#E2E5E6] rounded-xl flex flex-col gap-3"
            >
              <span className="text-xs font-bold text-[#1C211B]">{b.blockName}</span>
              <div className="flex flex-col gap-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#5E625E]">M1: Verified Check Coverage</span>
                    <span className="font-bold text-[#1C211B]">
                      {b.m1VerifiedCheckCoveragePercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#EEF0F2] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2E5421] transition-all duration-300"
                      style={{ width: `${Math.min(b.m1VerifiedCheckCoveragePercent, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#5E625E]">M1b: Registration Coverage</span>
                    <span className="font-bold text-[#1C211B]">
                      {b.m1bRegistrationCoveragePercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#EEF0F2] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D89859] transition-all duration-300"
                      style={{ width: `${Math.min(b.m1bRegistrationCoveragePercent, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-[#7B7E7B] pt-2 border-t border-[#EEF0F2]">
                Expected ground truth: <strong className="text-[#1C211B]">{b.expectedTreeCount}</strong> trees
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reports Management Table */}
      <div className="flex flex-col gap-4">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-[#1C211B]">
            Reports Management
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
          </div>
        </div>

        {/* Table */}
        {filteredReports.length === 0 ? (
          <EmptyState
            title="No reports found."
            message="Submitted block-level report records will appear here."
          />
        ) : (
          <div className="w-full overflow-x-auto border border-[#E2E5E6] rounded-xl bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F1E6] border-b border-[#E2E5E6]">
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Reporter
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Campaign
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Location
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Submission Date
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Report Type
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
                {filteredReports.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F5F8F4] transition-colors">
                    {/* Reporter */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-[#1C211B]">
                          {item.reporter.name}
                        </span>
                        <span className="text-[#5E625E]">{item.reporter.phone}</span>
                        <span className="text-[#7B7E7B]">{item.reporter.email}</span>
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAFCFE] border border-[#E2E5E6] text-[#5E625E]">
                            {item.reporter.zone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Campaign */}
                    <td className="px-4 py-4 text-xs font-medium text-[#1C211B]">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                        <span>{item.campaign}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-4 text-xs text-[#5E625E]">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAFCFE] border border-[#E2E5E6]">
                        <svg className="w-3.5 h-3.5 text-[#7B7E7B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{item.location}</span>
                      </div>
                    </td>

                    {/* Submission Date */}
                    <td className="px-4 py-4 text-xs text-[#7B7E7B]">
                      <div className="inline-flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-[#7B7E7B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{item.submissionDate}</span>
                      </div>
                    </td>

                    {/* Report Type */}
                    <td className="px-4 py-4 text-xs">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md font-medium text-[11px] ${
                          item.reportType === 'Validation'
                            ? 'bg-[#FDF1E8] text-[#8C532B] border border-[#E6CDA9]'
                            : 'bg-[#FEE4E2] text-[#D92D20] border border-[#FECDCA]'
                        }`}
                      >
                        {item.reportType}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 text-xs">
                      <StatusBadge
                        status={item.status}
                        variant="dot"
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-xs text-right">
                      <TableActionMenu
                        items={[
                          {
                            label: 'View report',
                            onClick: () => {
                              if ((item.reportType as string) === 'Incident' || (item.reportType as string) === 'Damaged/Destroyed') {
                                setSelectedIncidentForReview({
                                  id: item.id,
                                  incidentNumber: 'INC-2026-0891',
                                  treeId: '7890',
                                  species: item.campaign,
                                  category: 'Damaged/Destroyed',
                                  accessibility: 'Accessible',
                                  status: 'NeedsReview',
                                  coordinates: { lat: 23.4556, lng: 23.4556 },
                                  timestamp: item.submissionDate,
                                  reporterName: item.reporter.name,
                                  blockName: item.location,
                                  reasons: 'Damage detected during monitoring review pass.',
                                  photos: [
                                    {
                                      id: 'photo-1',
                                      signedUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
                                      altText: 'Damage photo',
                                    },
                                  ],
                                  soilCondition: {
                                    soilFertilityKg: '9 Kg',
                                    moistureContentPercent: '9 %',
                                    phValue: '9',
                                    temperatureCelsius: '29 oC',
                                    sunlightLux: '259 lux',
                                    humidityPercent: '29 %',
                                  },
                                  physicalCondition: {
                                    brokenBranch: true,
                                    damagedBark: false,
                                    bentStem: false,
                                    rootsExposure: false,
                                  },
                                });
                              } else {
                                setSelectedGrowthCheckForReview({
                                  id: item.id,
                                  treeId: 'Maize/b23/Alph/00045',
                                  systemTreeNumber: '7890',
                                  blockId: item.location,
                                  species: item.campaign,
                                  extensionOfficerName: item.reporter.name,
                                  submittedAt: item.submissionDate,
                                  coordinates: { lat: 23.4556, lng: 23.4556 },
                                  accessibility: 'Accessible',
                                  photos: [
                                    {
                                      id: 'photo-1',
                                      signedUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
                                      altText: 'Growth check photo',
                                    },
                                  ],
                                  additionalComments: 'Regular monitoring report submitted by extension officer.',
                                  soilCondition: {
                                    soilFertility: '9 Kg',
                                    moistureContent: '9 %',
                                    phValue: '9',
                                    temperature: '29 oC',
                                    sunlight: '259 lux',
                                    humidity: '29 %',
                                  },
                                  physicalCondition: {
                                    brokenBranch: 'NO',
                                    damagedBark: 'NO',
                                    bentStem: 'NO',
                                    rootsExposure: 'NO',
                                  },
                                  state: 'Needs Review',
                                });
                              }
                            },
                          },
                          {
                            label: 'View block',
                            onClick: () => {
                              setSelectedBlockForProfile({
                                id: item.id,
                                name: item.location,
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
                                    officerName: item.reporter.name,
                                    phoneNumber: '+2349198765432',
                                    timestamp: 'Today 10:25 PM',
                                    statusBadge: 'Growth Check',
                                    recordType: 'growth_check',
                                  },
                                ],
                                stakeholders: [
                                  {
                                    id: 'stk-1',
                                    name: item.reporter.name,
                                    role: 'Field Officer',
                                    phone: '+2349198765432',
                                    cluster: item.location,
                                    timestamp: item.submissionDate,
                                  },
                                ],
                              });
                            },
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

      {/* Assign Block Modal */}
      <AssignBlockModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
      />
    </div>
  );
};
