/**
 * types/assignment.ts
 *
 * Types for FR-09: Assign blocks.
 * References:
 * - AGENTS.md section 8 (FR-09 Assign blocks)
 * - state-mapping-rules.md (BlockSafetyFlag, BlockAssignmentState, UserState)
 * - form-validation-rules.md
 */

import { BlockSafetyFlag, BlockAssignmentState, UserState } from '../../../types/states';

export interface MappableBlockItem {
  id: string;
  name: string;
  safety: BlockSafetyFlag;
  blockState: 'Draft' | 'Mapped' | 'Active' | 'Retired';
  location: string;
  spacingStandard: string;
  expectedTreeCount: number;
  currentAssignment: {
    officerId: string;
    officerName: string;
    startDate: string;
    endDate?: string;
    status: BlockAssignmentState;
  } | null;
}

export interface ActiveOfficerOption {
  id: string;
  name: string;
  ward: string;
  userState: UserState;
}

export interface CreateAssignmentInput {
  taskType: string;
  blockId: string;
  officerId: string;
  targetQuota: number;
  startDate: string;
  endDate?: string;
  fieldInstructions?: string;
}
