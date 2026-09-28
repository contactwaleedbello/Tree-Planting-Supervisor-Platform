/**
 * Locked state enums and types per .agent/rules/state-mapping-rules.md.
 * Do not rename, paraphrase, or invent values.
 */

/** Position labels per state-mapping-rules.md */
export type PositionLabel = 'Captured' | 'Low Accuracy' | 'Simulated' | 'Unknown';

/**
 * Helper to get display label for position.
 * "Simulated" displays as "Approximate" per state-mapping-rules.md,
 * but stored and compared value is always "Simulated".
 */
export function getPositionDisplayLabel(position: PositionLabel): string {
  if (position === 'Simulated') {
    return 'Approximate';
  }
  return position;
}

/** Record states for this web build per state-mapping-rules.md */
export type RecordState = 'Submitted' | 'Needs Review' | 'Verified' | 'Rejected';

/** Incident states per state-mapping-rules.md */
export type IncidentState =
  | 'Reported'
  | 'NeedsReview'
  | 'ReplacementApproved'
  | 'ReplacementRejected'
  | 'Escalated'
  | 'Closed';

/** Tree states per state-mapping-rules.md */
export type TreeState = 'Active' | 'IncidentFlagged' | 'Dead' | 'Replaced';

/** Block states per state-mapping-rules.md */
export type BlockState = 'Draft' | 'Mapped' | 'Active' | 'Retired';

/** Safety flag per state-mapping-rules.md */
export type BlockSafetyFlag = 'Safe' | 'Unsafe';

/** Block assignment states per state-mapping-rules.md */
export type BlockAssignmentState = 'Active' | 'Ended';

/** User states per state-mapping-rules.md */
export type UserState = 'Active' | 'Suspended' | 'Pending' | 'Deactivated';

/** Custodian types per state-mapping-rules.md */
export type CustodianType = 'Individual' | 'Block';

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface PersonMarker {
  id: string;
  name: string;
  role?: string;
  personType: 'officer' | 'custodian';
  userState?: UserState;
  custodianType?: CustodianType;
  blockId: string;
  blockName: string;
  subBlockName?: string;
  coordinate: Coordinate;
  positionType?: PositionLabel;
  avatarSignedUrl?: string;
  phone?: string;
  email?: string;
  assignedCount?: number;
}

/**
 * Discriminator for reviewable records across queues and feeds.
 * Distinguishes incident reports from review queue checks without parsing category display labels.
 */
export type ReviewRecordType = 'incident' | 'growth_check' | 'validation' | 'registration';
