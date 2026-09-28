/**
 * TreeManagementLanding.tsx
 *
 * Implements Tree Management Overview landing page per:
 * - design/ui-reference/record-detail/tree management.png
 * - AGENTS.md section 4
 * - api-network-rules.md
 */

import React, { useState, useEffect, useMemo } from 'react';
import { StatCard } from '../../../components/StatCard';
import { SearchFilterBar } from '../../../components/SearchFilterBar';
import { TableActionMenu } from '../../../components/TableActionMenu';
import { EmptyState } from '../../../components/EmptyState';
import { AddSpecieTypeModal } from '../../tree-reference-data/components/AddSpecieTypeModal';
import { TreeProfile, TreeDetailData } from './TreeProfile';
import { BlockProfile, BlockProfileData } from './BlockProfile';
import { CustodianIndividual, CustodianProfileData } from './CustodianIndividual';
import { GrowthCheckReview } from '../../review/components/GrowthCheckReview';
import { GrowthCheckRecord } from '../../review/types/review';
import {
  TreeManagementStats,
  TreeManagementSpeciesRow,
} from '../types/treeManagement';
import { fetchTreeManagementOverview } from '../services/treeManagementPlaceholder';

const DEFAULT_TREE_DETAIL: TreeDetailData = {
  id: 'Maize/b23/Alph/00045',
  blockName: 'JGW-BLC-097',
  speciesName: 'Mouringa',
  speciesType: 'Hardwood / Perennial',
  batch: 'Batch #23',
  qrId: 'GL-TREE-00045-QR',
  validationStatus: 'Verified',
  positionType: 'Captured',
  coordinate: { lat: 23.4556, lng: 23.4556 },
  photos: [
    {
      id: 'tree-photo-1',
      signedUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      altText: 'Tree full canopy view',
    },
    {
      id: 'tree-photo-2',
      signedUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&q=80',
      altText: 'Tree bark and soil condition',
    },
  ],
  blockDetails: {
    name: 'JGW-BLC-097',
    sizeHectares: 5.67,
    state: 'Jigawa State',
    lga: 'Dutse',
    ward: 'Kudai',
    village: 'Chamo',
    lat: 23.4556,
    lng: 23.4556,
  },
  custodian: {
    name: 'Marcus A. Lee',
    phone: '+2349198765432',
    ward: 'Mariri Cluster',
    type: 'Community Custodian',
    timestamp: 'Today 10:25 PM',
  },
  growthCheckTasks: [
    {
      id: 'gc-1',
      title: 'Quarterly Check #2 Completed',
      subtitle: 'Height: 1.8m, Girth: 14cm, Canopy: Excellent',
      timestamp: 'Sep 24, 2026',
    },
  ],
};

export const TreeManagementLanding: React.FC = () => {
  const [stats, setStats] = useState<TreeManagementStats | null>(null);
  const [rows, setRows] = useState<TreeManagementSpeciesRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterActive, setIsFilterActive] = useState(false);

  // Modal / Detail state
  const [isAddSpecieOpen, setIsAddSpecieOpen] = useState(false);
  const [selectedTree, setSelectedTree] = useState<TreeDetailData | null>(null);
  const [selectedGrowthCheckForReview, setSelectedGrowthCheckForReview] = useState<GrowthCheckRecord | null>(null);
  const [selectedCustodianForProfile, setSelectedCustodianForProfile] = useState<CustodianProfileData | null>(null);
  const [selectedBlockForProfile, setSelectedBlockForProfile] = useState<BlockProfileData | null>(null);

  const loadData = async (shouldFail: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTreeManagementOverview(shouldFail);
      setStats(data.stats);
      setRows(data.rows);
    } catch (err: any) {
      setError(err.message || 'Failed to load tree management overview.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch = r.speciesName.toLowerCase().includes(searchQuery.toLowerCase());
      if (isFilterActive) {
        return matchesSearch && r.foundInBlocksCount > 3;
      }
      return matchesSearch;
    });
  }, [rows, searchQuery, isFilterActive]);

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
          <span>Back to Tree Profile</span>
        </button>
        <GrowthCheckReview
          record={selectedGrowthCheckForReview}
          onBack={() => setSelectedGrowthCheckForReview(null)}
          onDecisionComplete={() => setSelectedGrowthCheckForReview(null)}
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
          <span>Back to Tree Management</span>
        </button>
        <BlockProfile
          block={selectedBlockForProfile}
          onBackToBlocks={() => setSelectedBlockForProfile(null)}
        />
      </div>
    );
  }

  if (selectedTree) {
    return (
      <div className="flex flex-col gap-4 p-4 sm:p-6 max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => setSelectedTree(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#2E5421] hover:underline self-start mb-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Tree Management</span>
        </button>
        <TreeProfile
          tree={selectedTree}
          onBackToBlock={() => setSelectedTree(null)}
          onReviewTask={(taskId) => {
            setSelectedGrowthCheckForReview({
              id: taskId || 'gc-001',
              treeId: selectedTree.id,
              systemTreeNumber: selectedTree.qrId,
              blockId: selectedTree.blockName,
              species: selectedTree.speciesName,
              extensionOfficerName: selectedTree.custodian?.name || 'Marcus A. Lee',
              submittedAt: 'Today 10:25 PM',
              state: 'Needs Review',
              coordinates: selectedTree.coordinate,
              accessibility: 'Accessible',
              photos: selectedTree.photos,
              additionalComments: 'Quarterly growth check review submission.',
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
            });
          }}
          onViewCustodianProfile={() => {
            setSelectedCustodianForProfile({
              id: 'cust-1',
              name: selectedTree.custodian?.name || 'Marcus A. Lee',
              ward: selectedTree.custodian?.ward || 'Mariri Cluster',
              type: 'Individual',
              email: 'marcus.lee@greenlegacy.org',
              phoneNumber: selectedTree.custodian?.phone || '+2349198765432',
              assignedTrees: 140,
              assignedBlocks: 2,
              campaigns: 1,
              assignedSpecies: 3,
            });
          }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-7 w-64 bg-[#E2E5E6] rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-28 bg-[#E2E5E6] rounded-xl" />
          <div className="h-28 bg-[#E2E5E6] rounded-xl" />
          <div className="h-28 bg-[#E2E5E6] rounded-xl" />
          <div className="h-28 bg-[#E2E5E6] rounded-xl" />
        </div>
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-[#1C211B] tracking-tight">
          Tree Management Overview
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
            onClick={() => setIsAddSpecieOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2E5421] text-white hover:bg-[#234019] rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Tree Specie</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards matching tree management.png */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Number of Trees */}
          <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="text-2xl font-bold text-[#1C211B]">
              {stats.totalTreesCount.toString().padStart(2, '0')}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <svg className="w-4 h-4 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19V6m0 0l-4 4m4-4l4 4M5 19h14" />
              </svg>
              <span className="text-xs font-medium text-[#424641]">Total Number of Trees</span>
            </div>
            <div className="mt-3">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#EEF0F2] text-[#5E625E]">
                {stats.campaignsCount.toString().padStart(2, '0')} campaigns
              </span>
            </div>
          </div>

          {/* Card 2: Total Validated Trees */}
          <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="text-2xl font-bold text-[#1C211B]">
              {stats.totalValidatedTreesCount.toString().padStart(2, '0')}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <svg className="w-4 h-4 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19V6m0 0l-4 4m4-4l4 4M5 19h14" />
              </svg>
              <span className="text-xs font-medium text-[#424641]">Total Validated Trees</span>
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#EEF0F2] text-[#5E625E]">
                {stats.validatedBlocksCount.toString().padStart(2, '0')} Block
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#EDF2FD] text-[#406AC1]">
                {stats.validatedLocationsCount.toString().padStart(2, '0')} Locations
              </span>
            </div>
          </div>

          {/* Card 3: Total Growth Checks */}
          <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="text-2xl font-bold text-[#1C211B]">
              {stats.totalGrowthChecksCount.toString().padStart(2, '0')}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <svg className="w-4 h-4 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19V6m0 0l-4 4m4-4l4 4M5 19h14" />
              </svg>
              <span className="text-xs font-medium text-[#424641]">Total Growth Checks</span>
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#EEF0F2] text-[#5E625E]">
                {stats.growthCheckBlocksCount.toString().padStart(2, '0')} Block
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#EDF2FD] text-[#406AC1]">
                {stats.growthCheckLocationsCount.toString().padStart(2, '0')} Locations
              </span>
            </div>
          </div>

          {/* Card 4: Total Reported Incidents */}
          <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="text-2xl font-bold text-[#1C211B]">
              {stats.totalReportedIncidentsCount.toString().padStart(2, '0')}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <svg className="w-4 h-4 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19V6m0 0l-4 4m4-4l4 4M5 19h14" />
              </svg>
              <span className="text-xs font-medium text-[#424641]">Total Reported Incidents</span>
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FEE4E2] text-[#D92D20]">
                {stats.damagedIncidentsCount.toString().padStart(2, '0')} Damaged
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FDF1E8] text-[#8C532B]">
                {stats.missingIncidentsCount.toString().padStart(2, '0')} Missing
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Section: Tree Management */}
      <div className="flex flex-col gap-4">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-[#1C211B]">
            Tree Management
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
        {filteredRows.length === 0 ? (
          <EmptyState
            title="No tree species found."
            message="Register your first tree specie or clear your filter search."
            actionLabel="Add Tree Specie"
            actionVariant="primary"
            onAction={() => setIsAddSpecieOpen(true)}
          />
        ) : (
          <div className="w-full overflow-x-auto border border-[#E2E5E6] rounded-xl bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F1E6] border-b border-[#E2E5E6]">
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Species Name
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Found In Blocks
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Total Trees
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Growth Checked
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#1C211B] tracking-wide">
                    Campaigns
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
                {filteredRows.map((row) => (
                  <tr key={row.id} className="hover:bg-[#F5F8F4] transition-colors">
                    {/* Species Name */}
                    <td className="px-4 py-4 text-xs font-bold text-[#1C211B]">
                      {row.speciesName}
                    </td>

                    {/* Found In Blocks */}
                    <td className="px-4 py-4 text-xs">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-[#FAFCFE] border border-[#E2E5E6] text-[#5E625E]">
                        {row.foundInBlocksCount} Blocks
                      </span>
                    </td>

                    {/* Total Trees */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex flex-col gap-1.5 p-2 bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl max-w-xs">
                        <span className="font-semibold text-[#1C211B]">
                          {row.totalTrees.target >= 1000000
                            ? `${(row.totalTrees.target / 1000000).toFixed(0)}M Trees`
                            : `${row.totalTrees.target.toLocaleString()} Trees`}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#ECFDF3] text-[#027A48] border border-[#D1FADF]">
                            {row.totalTrees.validatedCount.toString().padStart(2, '0')} Validated
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F2F4F7] text-[#344054] border border-[#EAECF0]">
                            {row.totalTrees.registeredCount.toString().padStart(2, '0')} Registered
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Growth Checked */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex flex-col gap-1.5 p-2 bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl max-w-xs">
                        <span className="font-semibold text-[#1C211B]">
                          {row.growthChecked.target >= 1000000
                            ? `${(row.growthChecked.target / 1000000).toFixed(0)}M Trees`
                            : `${row.growthChecked.target.toLocaleString()} Trees`}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#ECFDF3] text-[#027A48] border border-[#D1FADF]">
                            {row.growthChecked.okCount.toString().padStart(2, '0')} OK
                          </span>
                          <span className="px-1.5 py-0.5 rounded-md text-[11px] font-medium bg-[#FEE4E2] text-[#D92D20] border border-[#FECDCA]">
                            {row.growthChecked.damagedCount.toString().padStart(2, '0')} Damaged
                          </span>
                          <span className="px-1.5 py-0.5 rounded-md text-[11px] font-medium bg-[#FEF0C7] text-[#B54708] border border-[#FEDF89]">
                            {row.growthChecked.stolenCount.toString().padStart(2, '0')} Stolen
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Campaigns */}
                    <td className="px-4 py-4 text-xs font-medium text-[#1C211B]">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                        <span>{row.campaignsCount} campaigns</span>
                      </div>
                    </td>

                    {/* Last Sync */}
                    <td className="px-4 py-4 text-xs text-[#7B7E7B]">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-[#7B7E7B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{row.lastSync}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-xs text-right">
                      <TableActionMenu
                        items={[
                          {
                            label: 'View tree profile',
                            onClick: () => setSelectedTree({ ...DEFAULT_TREE_DETAIL, speciesName: row.speciesName }),
                          },
                          {
                            label: 'View blocks',
                            onClick: () => {
                              setSelectedBlockForProfile({
                                id: row.id,
                                name: `Block ${row.speciesName}`,
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
                                    officerName: 'Marcus A. Lee',
                                    phoneNumber: '+2349198765432',
                                    timestamp: 'Today 10:25 PM',
                                    statusBadge: 'Growth Check',
                                    recordType: 'growth_check',
                                  },
                                ],
                                stakeholders: [
                                  {
                                    id: 'stk-1',
                                    name: 'Marcus A. Lee',
                                    role: 'EO Supervisor',
                                    phone: '+2349198765432',
                                    cluster: 'Mariri Cluster',
                                    timestamp: 'Today 10:25 PM',
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

      {/* Register Tree Specie Modal */}
      <AddSpecieTypeModal
        isOpen={isAddSpecieOpen}
        onClose={() => setIsAddSpecieOpen(false)}
        onSuccess={() => setIsAddSpecieOpen(false)}
      />

      {/* Custodian Details Modal */}
      {selectedCustodianForProfile && (
        <CustodianIndividual
          isOpen={Boolean(selectedCustodianForProfile)}
          onClose={() => setSelectedCustodianForProfile(null)}
          onBack={() => setSelectedCustodianForProfile(null)}
          custodian={selectedCustodianForProfile}
        />
      )}
    </div>
  );
};
