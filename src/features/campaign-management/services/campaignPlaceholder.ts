/**
 * campaignPlaceholder.ts
 *
 * Implements api-network-rules.md for Campaign Management:
 * 1. Scoped placeholder function returning campaigns, stats, and available blocks.
 * 2. Simulates network latency, result, and potential failure states.
 * 3. Does not hardcode endpoint names or environment variables.
 *
 * OPEN QUESTION (auth-access-rules.md & AGENTS.md section 4):
 * The exact field or relationship connecting a Supervisor to their specific campaigns/blocks
 * is currently unconfirmed in the PRD data model. The placeholder data layer provides
 * the supervisor's scoped data without inventing a mock authorization schema field.
 */

import {
  CampaignStats,
  OperationalCampaignItem,
  AvailableBlockItem,
  NewCampaignInput,
} from '../types/campaign';

const INITIAL_CAMPAIGN_STATS: CampaignStats = {
  activeCampaignsCount: 0,
  monitoringCadenceAdherencePercent: 0,
  officersActiveInFieldCount: 0,
  completedCampaignsCount: 0,
  averageCheckCoveragePercent: 92.4,
  completedCount: 0,
  safetyAlertsCount: 0,
  unsafeBlocksCount: 0,
  officersHoldingCachedRoutesCount: 0,
};

const INITIAL_CAMPAIGNS: OperationalCampaignItem[] = [
  {
    id: 'camp-1',
    name: 'Green Trees Farms',
    area: 'Layin wanke wanke street',
    targetTrees: 1000000,
    claimedTrees: 9,
    pendingTrees: 34,
    mappedBlocksCount: 1,
    assignedOfficersCount: 1,
    status: 'In Progress',
  },
  {
    id: 'camp-2',
    name: 'Green Trees Farms',
    area: 'Layin wanke wanke street',
    targetTrees: 1000000,
    claimedTrees: 9,
    pendingTrees: 34,
    mappedBlocksCount: 1,
    assignedOfficersCount: 1,
    status: 'Completed',
  },
  {
    id: 'camp-3',
    name: 'Green Trees Farms',
    area: 'Layin wanke wanke street',
    targetTrees: 1000000,
    claimedTrees: 9,
    pendingTrees: 34,
    mappedBlocksCount: 1,
    assignedOfficersCount: 1,
    status: 'Completed',
  },
];

const INITIAL_AVAILABLE_BLOCKS: AvailableBlockItem[] = [
  {
    id: 'JGW-BLC-097',
    name: 'JGW-BLC-097',
    state: 'Jigawa State',
    hectares: 5.67443,
    isFilled: false,
    polygon: [
      { lat: 23.4556, lng: 23.4556 },
      { lat: 23.457, lng: 23.458 },
      { lat: 23.454, lng: 23.459 },
      { lat: 23.453, lng: 23.456 },
    ],
  },
  {
    id: 'JGW-BLC-098',
    name: 'JGW-BLC-098',
    state: 'Kano State',
    hectares: 7.23512,
    isFilled: true,
  },
  {
    id: 'JGW-BLC-099',
    name: 'JGW-BLC-099',
    state: 'Lagos State',
    hectares: 10.48576,
    isFilled: false,
  },
  {
    id: 'JGW-BLC-100',
    name: 'JGW-BLC-100',
    state: 'Rivers State',
    hectares: 3.98258,
    isFilled: false,
  },
];

export interface FetchCampaignsResult {
  stats: CampaignStats;
  campaigns: OperationalCampaignItem[];
}

/**
 * Fetch operational campaigns and campaign stats.
 * Simulates network fetch with three distinct states (loading, success, failure).
 */
export async function fetchOperationalCampaigns(
  shouldFail: boolean = false
): Promise<FetchCampaignsResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (shouldFail) {
    throw new Error('Failed to load operational campaigns. Please try again.');
  }

  return {
    stats: { ...INITIAL_CAMPAIGN_STATS, activeCampaignsCount: INITIAL_CAMPAIGNS.filter(c => c.status === 'In Progress').length, completedCampaignsCount: INITIAL_CAMPAIGNS.filter(c => c.status === 'Completed').length },
    campaigns: [...INITIAL_CAMPAIGNS],
  };
}

/**
 * Fetch blocks available for campaign assignment.
 */
export async function fetchAvailableBlocks(): Promise<AvailableBlockItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [...INITIAL_AVAILABLE_BLOCKS];
}

/**
 * Submit creation of a new planting campaign.
 */
export async function createPlantingCampaign(
  input: NewCampaignInput
): Promise<OperationalCampaignItem> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const newCampaign: OperationalCampaignItem = {
    id: `camp-${Date.now()}`,
    name: input.name,
    area: 'Assigned Regional Zone',
    targetTrees: input.targetTrees,
    claimedTrees: 0,
    pendingTrees: input.targetTrees,
    mappedBlocksCount: input.selectedBlockIds ? input.selectedBlockIds.length : 0,
    assignedOfficersCount: input.assignedOfficers ? input.assignedOfficers.length : 0,
    status: 'In Progress',
  };

  INITIAL_CAMPAIGNS.unshift(newCampaign);
  return newCampaign;
}
