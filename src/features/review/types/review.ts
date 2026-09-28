/**
 * types/review.ts
 *
 * Types for FR-10: Review Queue (Growth Check review).
 * References:
 * - AGENTS.md section 8 (FR-10 flow)
 * - state-mapping-rules.md (RecordState)
 * - design/ui-reference/FR-10-review-queue/Growth Check.png
 */

import { RecordState } from '../../../types/states';
import { PhotoItem } from '../../../components/PhotoGallery';

export interface SoilConditionMetrics {
  soilFertility: string;
  moistureContent: string;
  phValue: string;
  temperature: string;
  sunlight: string;
  humidity: string;
}

export interface PhysicalConditionChecks {
  brokenBranch: string;
  damagedBark: string;
  bentStem: string;
  rootsExposure: string;
}

export interface GrowthCheckRecord {
  id: string;
  treeId: string;
  systemTreeNumber: string;
  blockId: string;
  species: string;
  extensionOfficerName: string;
  submittedAt: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  accessibility: 'Accessible' | 'Inaccessible';
  photos: PhotoItem[];
  additionalComments?: string;
  soilCondition: SoilConditionMetrics;
  physicalCondition: PhysicalConditionChecks;
  state: RecordState;
  decidedAt?: string;
  decidedBy?: string;
  rejectionReason?: string;
}
