/**
 * types/treeManagement.ts
 *
 * Types for Tree Management Overview landing page.
 * Reference: design/ui-reference/record-detail/tree management.png
 */

export interface TreeManagementStats {
  totalTreesCount: number;
  campaignsCount: number;
  totalValidatedTreesCount: number;
  validatedBlocksCount: number;
  validatedLocationsCount: number;
  totalGrowthChecksCount: number;
  growthCheckBlocksCount: number;
  growthCheckLocationsCount: number;
  totalReportedIncidentsCount: number;
  damagedIncidentsCount: number;
  missingIncidentsCount: number;
}

export interface TreeManagementSpeciesRow {
  id: string;
  speciesName: string;
  foundInBlocksCount: number;
  totalTrees: {
    target: number;
    validatedCount: number;
    registeredCount: number;
  };
  growthChecked: {
    target: number;
    okCount: number;
    damagedCount: number;
    stolenCount: number;
  };
  campaignsCount: number;
  lastSync: string;
}
