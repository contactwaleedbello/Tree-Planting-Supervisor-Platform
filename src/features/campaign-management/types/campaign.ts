import { RecordState } from '../../../types/states';

export interface CampaignStats {
  activeCampaignsCount: number;
  monitoringCadenceAdherencePercent: number;
  officersActiveInFieldCount: number;
  completedCampaignsCount: number;
  averageCheckCoveragePercent: number;
  completedCount: number;
  safetyAlertsCount: number;
  unsafeBlocksCount: number;
  officersHoldingCachedRoutesCount: number;
}

export type CampaignStatus = 'In Progress' | 'Completed' | 'Draft' | 'Suspended';

export interface OperationalCampaignItem {
  id: string;
  name: string;
  area: string;
  targetTrees: number;
  claimedTrees: number;
  pendingTrees: number;
  mappedBlocksCount: number;
  assignedOfficersCount: number;
  status: CampaignStatus;
}

export interface AvailableBlockItem {
  id: string;
  name: string;
  state: string;
  hectares: number;
  isFilled?: boolean;
  polygon?: Array<{ lat: number; lng: number }>;
}

export interface NewCampaignInput {
  name: string;
  targetTrees: number;
  approvedSpecies: string[];
  startDate: string;
  endDate: string;
  selectedBlockIds?: string[];
  assignedOfficers?: Array<{ blockId: string; officerId: string }>;
}
