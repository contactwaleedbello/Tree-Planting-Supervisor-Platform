/**
 * treeManagementPlaceholder.ts
 *
 * Implements api-network-rules.md for Tree Management Overview:
 * - Scoped placeholder functions for stats and species overview table.
 * - Handles loading, result, and failure states.
 */

import {
  TreeManagementStats,
  TreeManagementSpeciesRow,
} from '../types/treeManagement';

const INITIAL_STATS: TreeManagementStats = {
  totalTreesCount: 0,
  campaignsCount: 0,
  totalValidatedTreesCount: 0,
  validatedBlocksCount: 0,
  validatedLocationsCount: 0,
  totalGrowthChecksCount: 0,
  growthCheckBlocksCount: 0,
  growthCheckLocationsCount: 0,
  totalReportedIncidentsCount: 0,
  damagedIncidentsCount: 0,
  missingIncidentsCount: 0,
};

const INITIAL_ROWS: TreeManagementSpeciesRow[] = [
  {
    id: 'sp-row-1',
    speciesName: 'Mango',
    foundInBlocksCount: 5,
    totalTrees: {
      target: 1000000,
      validatedCount: 9,
      registeredCount: 34,
    },
    growthChecked: {
      target: 1000000,
      okCount: 9,
      damagedCount: 34,
      stolenCount: 34,
    },
    campaignsCount: 4,
    lastSync: 'January 2, 2025',
  },
  {
    id: 'sp-row-2',
    speciesName: 'Neem',
    foundInBlocksCount: 4,
    totalTrees: {
      target: 500000,
      validatedCount: 15,
      registeredCount: 48,
    },
    growthChecked: {
      target: 500000,
      okCount: 15,
      damagedCount: 12,
      stolenCount: 5,
    },
    campaignsCount: 3,
    lastSync: 'January 2, 2025',
  },
  {
    id: 'sp-row-3',
    speciesName: 'Mahogany',
    foundInBlocksCount: 3,
    totalTrees: {
      target: 800000,
      validatedCount: 12,
      registeredCount: 20,
    },
    growthChecked: {
      target: 800000,
      okCount: 12,
      damagedCount: 8,
      stolenCount: 2,
    },
    campaignsCount: 2,
    lastSync: 'January 2, 2025',
  },
];

export interface FetchTreeManagementOverviewResult {
  stats: TreeManagementStats;
  rows: TreeManagementSpeciesRow[];
}

export async function fetchTreeManagementOverview(
  shouldFail: boolean = false
): Promise<FetchTreeManagementOverviewResult> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (shouldFail) {
    throw new Error('Failed to load tree management overview.');
  }
  return {
    stats: { ...INITIAL_STATS },
    rows: [...INITIAL_ROWS],
  };
}
